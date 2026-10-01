export type Paged<T> = { count: number; next: string | null; previous: string | null; results: T[] }

export type Doctor = {
  id: number
  name: string
  initials: string
  specialty: string
  hospital: string
  rating: string
}

export type PatientProfile = {
  id: number
  name: string
  age: number
  gender: string
  blood_type: string
  medical_condition: string
  insurance_provider: string
  allergies: string
}

export type Appointment = {
  id: number
  patient: number
  patient_name: string
  patient_age: number
  patient_condition: string
  doctor: number
  doctor_name: string
  specialty: string
  date: string
  time: string
  kind: 'Video' | 'Chat' | 'Follow-up'
  status: 'Upcoming' | 'Completed' | 'Cancelled'
  reason: string
  room_number: number | null
  discharge_date: string | null
  test_results: string
}

export type DoctorStats = {
  fee: number
  upcoming: number
  today: number
  patients: number
  completed: number
  months: { month: string; visits: number; amount: number }[]
}

export type Prescription = {
  id: number
  doctor_name: string
  name: string
  dosage: string
  frequency: string
  refills_left: number
  supply_days: number
  supply_total: number
  status: 'Active' | 'Refill due' | 'Expired'
}

export type Invoice = {
  id: number
  code: string
  service: string
  date: string
  amount: string
  covered: string
  amount_due: string
  status: 'Paid' | 'Due' | 'Processing'
}