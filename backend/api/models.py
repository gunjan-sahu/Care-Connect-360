from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        PATIENT = "Patient", "Patient"
        DOCTOR = "Doctor", "Doctor"

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.PATIENT)


class Doctor(models.Model):
    user = models.OneToOneField(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name="doctor_profile"
    )
    name = models.CharField(max_length=120)
    specialty = models.CharField(max_length=80, default="General Practice")
    hospital = models.CharField(max_length=160, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=4.5)

    def __str__(self):
        return self.name


class Patient(models.Model):
    user = models.OneToOneField(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name="patient_profile"
    )
    name = models.CharField(max_length=120)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=20)
    blood_type = models.CharField(max_length=5, blank=True)
    medical_condition = models.CharField(max_length=120, blank=True)
    insurance_provider = models.CharField(max_length=120, blank=True)
    allergies = models.CharField(max_length=200, default="None")

    def __str__(self):
        return self.name


class Appointment(models.Model):
    class Kind(models.TextChoices):
        VIDEO = "Video", "Video"
        CHAT = "Chat", "Chat"
        FOLLOW_UP = "Follow-up", "Follow-up"

    class Status(models.TextChoices):
        UPCOMING = "Upcoming", "Upcoming"
        COMPLETED = "Completed", "Completed"
        CANCELLED = "Cancelled", "Cancelled"

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="appointments")
    date = models.DateField()
    time = models.TimeField()
    kind = models.CharField(max_length=10, choices=Kind.choices, default=Kind.VIDEO)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.UPCOMING)
    reason = models.CharField(max_length=200, blank=True)
    room_number = models.PositiveIntegerField(null=True, blank=True)
    discharge_date = models.DateField(null=True, blank=True)
    test_results = models.CharField(max_length=20, blank=True)

    class Meta:
        ordering = ["date", "time"]


class Prescription(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "Active", "Active"
        REFILL_DUE = "Refill due", "Refill due"
        EXPIRED = "Expired", "Expired"

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="prescriptions")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="prescriptions")
    name = models.CharField(max_length=120)
    dosage = models.CharField(max_length=60, blank=True)
    frequency = models.CharField(max_length=80, blank=True)
    refills_left = models.PositiveIntegerField(default=2)
    supply_days = models.PositiveIntegerField(default=30)
    supply_total = models.PositiveIntegerField(default=30)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)


class Invoice(models.Model):
    class Status(models.TextChoices):
        PAID = "Paid", "Paid"
        DUE = "Due", "Due"
        PROCESSING = "Processing", "Processing"

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="invoices")
    code = models.CharField(max_length=20, unique=True)
    service = models.CharField(max_length=160)
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    covered = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.DUE)

    class Meta:
        ordering = ["-date"]