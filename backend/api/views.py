from datetime import date
from django.db.models import F
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
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
            qs = (
                qs.filter(**{self.doctor_field: profile})
                if self.doctor_field
                else qs.none()
            )
        else:
            qs = qs.filter(patient=profile)

        for param, field in self.filter_params.items():
            value = self.request.query_params.get(param)
            if value:
                qs = qs.filter(**{field: value})

        return qs


class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search")
        specialty = self.request.query_params.get("specialty")
        if search:
            qs = qs.filter(name__icontains=search)
        elif specialty:
            qs = qs.filter(specialty=specialty)
        # Doctors who registered an account come first, then the dataset doctors
        return qs.order_by(F("user").asc(nulls_last=True), "name")


class PatientViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        profile = get_profile(user)

        if profile is None:
            return Patient.objects.none()

        if user.role == "Doctor":
            qs = Patient.objects.filter(
                appointments__doctor=profile
            ).distinct()
        else:
            qs = Patient.objects.filter(id=profile.id)

        search = self.request.query_params.get("search")

        if search:
            qs = qs.filter(name__icontains=search)

        return qs.order_by("id")


class AppointmentViewSet(ScopedMixin, viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related(
        "patient", "doctor"
    ).order_by("date", "time", "id")

    serializer_class = AppointmentSerializer
    http_method_names = ["get", "post", "head", "options"]

    filter_params = {
        "status": "status",
        "patient": "patient_id",
    }

    def perform_create(self, serializer):
        serializer.save(
            patient=require_role(self.request, "Patient")
        )

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = Appointment.Status.CANCELLED
        appointment.save()

        return Response(
            self.get_serializer(appointment).data
        )

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        require_role(request, "Doctor")
        appointment = self.get_object()
        appointment.status = Appointment.Status.COMPLETED
        appointment.save()

        return Response(
            self.get_serializer(appointment).data
        )


class PrescriptionViewSet(ScopedMixin, viewsets.ModelViewSet):
    queryset = Prescription.objects.select_related(
        "doctor"
    ).order_by("-created_at", "id")

    serializer_class = PrescriptionSerializer
    http_method_names = ["get", "post", "head", "options"]

    filter_params = {
        "status": "status",
        "patient": "patient_id",
    }

    def perform_create(self, serializer):
        doctor = require_role(self.request, "Doctor")
        patient = serializer.validated_data["patient"]

        if not Appointment.objects.filter(
            doctor=doctor,
            patient=patient,
        ).exists():
            raise PermissionDenied(
                "You can only prescribe to your own patients."
            )

        serializer.save(doctor=doctor)

    @action(detail=True, methods=["post"])
    def refill(self, request, pk=None):
        require_role(request, "Patient")
        rx = self.get_object()

        if rx.refills_left == 0:
            return Response(
                {
                    "detail": "No refills left. Ask your doctor for a renewal."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        rx.refills_left -= 1
        rx.supply_days = rx.supply_total
        rx.status = Prescription.Status.ACTIVE
        rx.save()

        return Response(
            self.get_serializer(rx).data
        )


class InvoiceViewSet(ScopedMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Invoice.objects.all().order_by("-date", "id")
    serializer_class = InvoiceSerializer
    doctor_field = None

    filter_params = {
        "status": "status",
    }

    @action(detail=True, methods=["post"])
    def pay(self, request, pk=None):
        require_role(request, "Patient")
        invoice = self.get_object()
        invoice.status = Invoice.Status.PAID
        invoice.save()

        return Response(
            self.get_serializer(invoice).data
        )


VISIT_FEE = 800


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def doctor_stats(request):
    doctor = require_role(request, "Doctor")
    appts = Appointment.objects.filter(doctor=doctor)
    today = date.today()

    completed_dates = list(
        appts.filter(status="Completed").values_list(
            "date",
            flat=True,
        )
    )

    months = []
    y, m = today.year, today.month

    for _ in range(5):
        visits = sum(
            1
            for d in completed_dates
            if d.year == y and d.month == m
        )

        months.append(
            {
                "month": date(y, m, 1).strftime("%b"),
                "visits": visits,
                "amount": visits * VISIT_FEE,
            }
        )

        m -= 1

        if m == 0:
            m, y = 12, y - 1

    months.reverse()

    return Response(
        {
            "fee": VISIT_FEE,
            "upcoming": appts.filter(
                status="Upcoming"
            ).count(),
            "today": appts.filter(
                date=today
            ).exclude(
                status="Cancelled"
            ).count(),
            "patients": appts.values(
                "patient"
            ).distinct().count(),
            "completed": len(completed_dates),
            "months": months,
        }
    )