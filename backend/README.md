# CareConnect360

A demo telemedicine app. Patients book consultations, view prescriptions and pay invoices. Doctors manage their schedule and patients.

> **Demo project.** Video calls and chat are simulated, and payments are fake. Do not use real patient data.

**Tech:** Next.js, Tailwind, shadcn (frontend). Django, Django REST Framework, JWT, Oracle (backend).

## You need

Node.js 20+, pnpm, Python 3.12+, Docker Desktop, Git.

## 1. Get the code

```powershell
git clone https://github.com/gunjan-sahu/Care-Connect-360.git
cd Care-Connect-360
```

## 2. Start the database

```powershell
copy .env.example .env
```
Open `.env` and set your own passwords, then:
```powershell
docker compose up -d
```

## 3. Start the backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```
Open `backend/.env`. Set `DJANGO_SECRET_KEY` (make one with `python -c "import secrets; print(secrets.token_urlsafe(50))"`) and use the same DB user and password as the root `.env`.

Download the Kaggle "Healthcare Dataset" and save it as `backend/data/healthcare_dataset.csv`. Then:

```powershell
python manage.py migrate
python manage.py load_dataset
python manage.py create_demo_users
python manage.py runserver
```
The backend runs at http://127.0.0.1:8000

## 4. Start the frontend

Open a new terminal in the project root:
```powershell
pnpm install
pnpm dev
```
Open http://localhost:3000

## Demo logins

- Patient: `patient@careconnect.test`
- Doctor: `doctor@careconnect.test`
- Password: `Demo@12345`

## Known limits

- Video and chat are simulated (no real calls).
- Payments, pharmacy choice and invoice downloads are demos.
- Doctor availability is saved only in the browser.