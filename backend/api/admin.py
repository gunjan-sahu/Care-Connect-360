from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Appointment, Doctor, Invoice, Patient, Prescription, User

admin.site.register(User, UserAdmin)
admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(Appointment)
admin.site.register(Prescription)
admin.site.register(Invoice)