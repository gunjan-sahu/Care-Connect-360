from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import (
    AppointmentViewSet,
    DoctorViewSet,
    InvoiceViewSet,
    PatientViewSet,
    PrescriptionViewSet,
)

router = DefaultRouter()
router.register("doctors", DoctorViewSet, basename="doctor")
router.register("patients", PatientViewSet, basename="patient")
router.register("appointments", AppointmentViewSet, basename="appointment")
router.register("prescriptions", PrescriptionViewSet, basename="prescription")
router.register("invoices", InvoiceViewSet, basename="invoice")


def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/", include(router.urls)),
]