from django.core.management.base import BaseCommand

from api.models import Doctor, Patient, User

PASSWORD = "Demo@12345"


class Command(BaseCommand):
    help = "Create demo login accounts linked to real dataset rows"

    def handle(self, *args, **options):
        patient = Patient.objects.order_by("id").first()
        doctor = Doctor.objects.order_by("id").first()
        if not patient or not doctor:
            self.stderr.write("No data found. Run load_dataset first.")
            return
        self.make("patient@careconnect.test", User.Role.PATIENT, patient)
        self.make("doctor@careconnect.test", User.Role.DOCTOR, doctor)

    def make(self, email, role, profile):
        user, _ = User.objects.get_or_create(username=email, defaults={"email": email})
        user.email = email
        user.role = role
        user.first_name = profile.name
        user.set_password(PASSWORD)
        user.save()
        profile.user = user
        profile.save()
        self.stdout.write(self.style.SUCCESS(f"{role}: {email} / {PASSWORD}  ->  {profile.name}"))