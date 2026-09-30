from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        PATIENT = "Patient", "Patient"
        DOCTOR = "Doctor", "Doctor"

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.PATIENT)