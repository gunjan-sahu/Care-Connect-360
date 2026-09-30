from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Appointment, Doctor, Invoice, Patient, Prescription
from .serializers import (
    AppointmentSerializer,
    DoctorSerializer,
    InvoiceSerializer,
    PatientSerializer,
    PrescriptionSerializer,
)

# TEMPORARY: open access for testing. Step 6 replaces this with real login.
OPEN = [AllowAny]


class ParamFilterMixin:
    """Lets you filter with ?patient=5 or ?status=Upcoming in the URL."""

    filter_params = {}

    def get_queryset(self):
        qs = super().get_queryset()
        for param, field in self.filter_params.items():
            value = self.request.query_params.get(param)
            if value:
                qs = qs.filter(**{field: value})
        return qs


class DoctorViewSet(ParamFilterMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Doctor.objects.all().order_by("name")
    serializer_class = DoctorSerializer
    permission_classes = OPEN
    filter_params = {"specialty": "specialty"}


class PatientViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = OPEN

    def get_queryset(self):
        qs = Patient.objects.all().order_by("id")
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(name__icontains=search)
        return qs


class AppointmentViewSet(ParamFilterMixin, viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related("patient", "doctor").order_by("date", "time", "id")
    serializer_class = AppointmentSerializer
    permission_classes = OPEN
    http_method_names = ["get", "post", "head", "options"]
    filter_params = {"patient": "patient_id", "doctor": "doctor_id", "status": "status"}

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = Appointment.Status.CANCELLED
        appointment.save()
        return Response(self.get_serializer(appointment).data)


class PrescriptionViewSet(ParamFilterMixin, viewsets.ModelViewSet):
    queryset = Prescription.objects.select_related("doctor").order_by("-created_at", "id")
    serializer_class = PrescriptionSerializer
    permission_classes = OPEN
    http_method_names = ["get", "post", "head", "options"]
    filter_params = {"patient": "patient_id", "doctor": "doctor_id", "status": "status"}

    @action(detail=True, methods=["post"])
    def refill(self, request, pk=None):
        rx = self.get_object()
        if rx.refills_left == 0:
            return Response(
                {"detail": "No refills left. Ask your doctor for a renewal."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        rx.refills_left -= 1
        rx.supply_days = rx.supply_total
        rx.status = Prescription.Status.ACTIVE
        rx.save()
        return Response(self.get_serializer(rx).data)


class InvoiceViewSet(ParamFilterMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Invoice.objects.all().order_by("-date", "id")
    serializer_class = InvoiceSerializer
    permission_classes = OPEN
    filter_params = {"patient": "patient_id", "status": "status"}

    @action(detail=True, methods=["post"])
    def pay(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = Invoice.Status.PAID
        invoice.save()
        return Response(self.get_serializer(invoice).data)