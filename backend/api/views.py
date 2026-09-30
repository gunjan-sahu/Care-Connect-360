from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Appointment, Doctor, Invoice, Patient, Prescription
from .serializers import (
    AppointmentSerializer,
    DoctorSerializer,
    InvoiceSerializer,
    PatientSerializer,
    PrescriptionSerializer,
)


def get_profile(user):
    if user.role == "Doctor":
        return getattr(user, "doctor_profile", None)
    return getattr(user, "patient_profile", None)


def require_role(request, role):
    profile = get_profile(request.user)
    if request.user.role != role or profile is None:
        raise PermissionDenied(f"Only a {role.lower()} can do this.")
    return profile


class ScopedMixin:
    """Patients see only their rows. Doctors see only rows for their own work."""

    permission_classes = [IsAuthenticated]
    filter_params = {}
    doctor_field = "doctor"  # set to None if doctors should see nothing here

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        profile = get_profile(user)
        if profile is None:
            return qs.none()
        if user.role == "Doctor":
            qs = qs.filter(**{self.doctor_field: profile}) if self.doctor_field else qs.none()
        else:
            qs = qs.filter(patient=profile)
        for param, field in self.filter_params.items():
            value = self.request.query_params.get(param)
            if value:
                qs = qs.filter(**{field: value})
        return qs


class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Doctor.objects.all().order_by("name")
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        specialty = self.request.query_params.get("specialty")
        return qs.filter(specialty=specialty) if specialty else qs


class PatientViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        profile = get_profile(user)
        if profile is None:
            return Patient.objects.none()
        if user.role == "Doctor":
            qs = Patient.objects.filter(appointments__doctor=profile).distinct()
        else:
            qs = Patient.objects.filter(id=profile.id)
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(name__icontains=search)
        return qs.order_by("id")


class AppointmentViewSet(ScopedMixin, viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related("patient", "doctor").order_by("date", "time", "id")
    serializer_class = AppointmentSerializer
    http_method_names = ["get", "post", "head", "options"]
    filter_params = {"status": "status"}

    def perform_create(self, serializer):
        serializer.save(patient=require_role(self.request, "Patient"))

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = Appointment.Status.CANCELLED
        appointment.save()
        return Response(self.get_serializer(appointment).data)


class PrescriptionViewSet(ScopedMixin, viewsets.ModelViewSet):
    queryset = Prescription.objects.select_related("doctor").order_by("-created_at", "id")
    serializer_class = PrescriptionSerializer
    http_method_names = ["get", "post", "head", "options"]
    filter_params = {"status": "status"}

    def perform_create(self, serializer):
        serializer.save(doctor=require_role(self.request, "Doctor"))

    @action(detail=True, methods=["post"])
    def refill(self, request, pk=None):
        require_role(request, "Patient")
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


class InvoiceViewSet(ScopedMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Invoice.objects.all().order_by("-date", "id")
    serializer_class = InvoiceSerializer
    doctor_field = None
    filter_params = {"status": "status"}

    @action(detail=True, methods=["post"])
    def pay(self, request, pk=None):
        require_role(request, "Patient")
        invoice = self.get_object()
        invoice.status = Invoice.Status.PAID
        invoice.save()
        return Response(self.get_serializer(invoice).data)