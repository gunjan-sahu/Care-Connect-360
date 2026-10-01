from rest_framework import serializers

from .models import Appointment, Doctor, Invoice, Patient, Prescription


class DoctorSerializer(serializers.ModelSerializer):
    initials = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ["id", "name", "initials", "specialty", "hospital", "rating"]

    def get_initials(self, obj):
        parts = [p for p in obj.name.replace("Dr.", "").split() if p]
        return "".join(p[0] for p in parts[:2]).upper()


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            "id", "name", "age", "gender", "blood_type",
            "medical_condition", "insurance_provider", "allergies",
        ]
class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source="doctor.name", read_only=True)
    specialty = serializers.CharField(source="doctor.specialty", read_only=True)
    patient_name = serializers.CharField(source="patient.name", read_only=True)
    patient_age = serializers.IntegerField(source="patient.age", read_only=True)
    patient_condition = serializers.CharField(source="patient.medical_condition", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id", "patient", "patient_name", "patient_age", "patient_condition",
            "doctor", "doctor_name", "specialty",
            "date", "time", "kind", "status", "reason",
            "room_number", "discharge_date", "test_results",
        ]
        read_only_fields = ["patient", "status", "room_number", "discharge_date", "test_results"]


class PrescriptionSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source="doctor.name", read_only=True)

    class Meta:
        model = Prescription
        fields = [
            "id", "patient", "doctor", "doctor_name", "name", "dosage", "frequency",
            "refills_left", "supply_days", "supply_total", "status", "created_at",
        ]
        read_only_fields = ["doctor", "refills_left", "supply_days", "supply_total", "status"]


class InvoiceSerializer(serializers.ModelSerializer):
    amount_due = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = [
            "id", "patient", "code", "service", "date",
            "amount", "covered", "amount_due", "status",
        ]

    def get_amount_due(self, obj):
        return obj.amount - obj.covered