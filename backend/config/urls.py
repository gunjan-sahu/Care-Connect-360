from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from api.auth_views import login_view, me, register
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
    path("api/auth/register/", register),
    path("api/auth/login/", login_view),
    path("api/auth/refresh/", TokenRefreshView.as_view()),
    path("api/auth/me/", me),
    path("api/", include(router.urls)),
]