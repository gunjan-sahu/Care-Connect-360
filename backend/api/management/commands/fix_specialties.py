from django.core.management.base import BaseCommand

from api.models import Appointment, Doctor

CONDITION_TO_SPECIALTY = {
    "Cancer": "Oncology",
    "Diabetes": "Endocrinology",
    "Asthma": "Pulmonology",
    "Hypertension": "Cardiology",
    "Arthritis": "Rheumatology",
    "Obesity": "Nutrition",
}


class Command(BaseCommand):
    help = "Set dataset doctors' specialty from the conditions of their patients"

    def handle(self, *args, **options):
        updated = 0
        for doctor in Doctor.objects.filter(user__isnull=True):
            appt = Appointment.objects.filter(doctor=doctor).select_related("patient").first()
            if not appt:
                continue
            doctor.specialty = CONDITION_TO_SPECIALTY.get(appt.patient.medical_condition, "General Practice")
            doctor.save(update_fields=["specialty"])
            updated += 1
        self.stdout.write(self.style.SUCCESS(f"Updated {updated} doctors."))