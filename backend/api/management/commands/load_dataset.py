import random
from datetime import time
from decimal import Decimal
from pathlib import Path

import pandas as pd
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from api.models import Appointment, Doctor, Invoice, Patient, Prescription

CONDITION_TO_SPECIALTY = {
    "Cancer": "Oncology",
    "Diabetes": "Endocrinology",
    "Asthma": "Pulmonology",
    "Hypertension": "Cardiology",
    "Arthritis": "Rheumatology",
    "Obesity": "Nutrition",
}
KIND_BY_ADMISSION = {"Emergency": "Video", "Urgent": "Video", "Elective": "Follow-up"}
ROW_LIMIT = 3000  # keep it fast; raise later if you want more


class Command(BaseCommand):
    help = "Load the Kaggle healthcare dataset into Oracle"

    @transaction.atomic
    def handle(self, *args, **options):
        random.seed(42)
        path = Path(settings.BASE_DIR) / "data" / "healthcare_dataset.csv"
        if not path.exists():
            self.stderr.write(f"File not found: {path}")
            return

        df = pd.read_csv(path).head(ROW_LIMIT)
        df["Name"] = df["Name"].str.title().str.strip()
        df["Doctor"] = df["Doctor"].str.title().str.strip()
        df["Date of Admission"] = pd.to_datetime(df["Date of Admission"])
        df["Discharge Date"] = pd.to_datetime(df["Discharge Date"])

        Invoice.objects.all().delete()
        Prescription.objects.all().delete()
        Appointment.objects.all().delete()
        Patient.objects.all().delete()
        Doctor.objects.all().delete()

        doctors = {}
        for _, r in df.drop_duplicates("Doctor").iterrows():
            doctors[r["Doctor"]] = Doctor.objects.create(
                name=f"Dr. {r['Doctor']}",
                specialty=CONDITION_TO_SPECIALTY.get(r["Medical Condition"], "General Practice"),
                hospital=str(r["Hospital"]).strip(),
                rating=Decimal(str(round(random.uniform(4.2, 5.0), 1))),
            )

        patients = {}
        for i, r in df.iterrows():
            patient = Patient.objects.create(
                name=r["Name"],
                age=int(r["Age"]),
                gender=r["Gender"],
                blood_type=r["Blood Type"],
                medical_condition=r["Medical Condition"],
                insurance_provider=r["Insurance Provider"],
            )
            patients[i] = patient
            doctor = doctors[r["Doctor"]]
            admitted = r["Date of Admission"].date()
            status = "Completed" if admitted < pd.Timestamp("2026-10-01").date() else "Upcoming"

            Appointment.objects.create(
                patient=patient,
                doctor=doctor,
                date=admitted,
                time=time(random.choice([9, 10, 11, 14, 15, 16]), random.choice([0, 30])),
                kind=KIND_BY_ADMISSION.get(r["Admission Type"], "Video"),
                status=status,
                reason=r["Medical Condition"],
                room_number=int(r["Room Number"]),
                discharge_date=r["Discharge Date"].date(),
                test_results=r["Test Results"],
            )

            supply_total = 30
            supply_days = random.randint(0, supply_total)
            Prescription.objects.create(
                patient=patient,
                doctor=doctor,
                name=r["Medication"],
                dosage=random.choice(["10 mg", "20 mg", "50 mg", "100 mg"]),
                frequency=random.choice(["Once daily", "Twice daily", "Every 8 hours"]),
                refills_left=random.randint(0, 3),
                supply_days=supply_days,
                supply_total=supply_total,
                status="Refill due" if supply_days <= 5 else "Active",
            )

            amount = Decimal(str(round(float(r["Billing Amount"]), 2)))
            Invoice.objects.create(
                patient=patient,
                code=f"INV-{3000 + i}",
                service=f"{r['Admission Type']} care: {r['Medical Condition']}",
                date=admitted,
                amount=amount,
                covered=(amount * Decimal("0.7")).quantize(Decimal("0.01")),
                status=random.choice(["Paid", "Paid", "Due", "Processing"]),
            )

        self.stdout.write(self.style.SUCCESS(
            f"Loaded {len(doctors)} doctors, {len(patients)} patients, "
            f"{len(patients)} appointments, prescriptions and invoices."
        ))