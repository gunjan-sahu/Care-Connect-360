export type Doctor = {
  id: string
  name: string
  specialty: string
  initials: string
  rating: number
  nextSlot: string
}

export type Appointment = {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  type: 'Video' | 'Chat' | 'Follow-up'
  status: 'Upcoming' | 'Completed' | 'Cancelled'
}

export type Prescription = {
  id: string
  name: string
  dosage: string
  frequency: string
  prescribedBy: string
  refillsLeft: number
  supplyDays: number
  supplyTotal: number
  status: 'Active' | 'Refill due' | 'Expired'
}

export type Invoice = {
  id: string
  service: string
  date: string
  amount: number
  covered: number
  status: 'Paid' | 'Due' | 'Processing'
}

export const doctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Amara Okafor', specialty: 'General Practice', initials: 'AO', rating: 4.9, nextSlot: 'Today, 14:30' },
  { id: 'd2', name: 'Dr. Lukas Weber', specialty: 'Cardiology', initials: 'LW', rating: 4.8, nextSlot: 'Tomorrow, 09:00' },
  { id: 'd3', name: 'Dr. Priya Raman', specialty: 'Dermatology', initials: 'PR', rating: 4.9, nextSlot: 'Today, 17:15' },
  { id: 'd4', name: 'Dr. Mateo Silva', specialty: 'Psychiatry', initials: 'MS', rating: 4.7, nextSlot: 'Thu, 11:45' },
]

export const specialties = ['General Practice', 'Cardiology', 'Dermatology', 'Psychiatry', 'Pediatrics', 'Nutrition']

export const appointments: Appointment[] = [
  { id: 'a1', doctor: 'Dr. Amara Okafor', specialty: 'General Practice', date: 'Sep 28', time: '14:30', type: 'Video', status: 'Upcoming' },
  { id: 'a2', doctor: 'Dr. Lukas Weber', specialty: 'Cardiology', date: 'Oct 02', time: '09:00', type: 'Follow-up', status: 'Upcoming' },
  { id: 'a3', doctor: 'Dr. Priya Raman', specialty: 'Dermatology', date: 'Oct 07', time: '17:15', type: 'Chat', status: 'Upcoming' },
  { id: 'a4', doctor: 'Dr. Mateo Silva', specialty: 'Psychiatry', date: 'Sep 19', time: '11:45', type: 'Video', status: 'Completed' },
  { id: 'a5', doctor: 'Dr. Amara Okafor', specialty: 'General Practice', date: 'Sep 04', time: '10:00', type: 'Video', status: 'Completed' },
  { id: 'a6', doctor: 'Dr. Lukas Weber', specialty: 'Cardiology', date: 'Aug 22', time: '15:30', type: 'Video', status: 'Cancelled' },
]

export const prescriptions: Prescription[] = [
  { id: 'rx1', name: 'Lisinopril', dosage: '10 mg', frequency: 'Once daily, morning', prescribedBy: 'Dr. Lukas Weber', refillsLeft: 3, supplyDays: 22, supplyTotal: 30, status: 'Active' },
  { id: 'rx2', name: 'Atorvastatin', dosage: '20 mg', frequency: 'Once daily, evening', prescribedBy: 'Dr. Lukas Weber', refillsLeft: 1, supplyDays: 4, supplyTotal: 30, status: 'Refill due' },
  { id: 'rx3', name: 'Tretinoin cream', dosage: '0.025%', frequency: 'Nightly, thin layer', prescribedBy: 'Dr. Priya Raman', refillsLeft: 2, supplyDays: 18, supplyTotal: 45, status: 'Active' },
  { id: 'rx4', name: 'Sertraline', dosage: '50 mg', frequency: 'Once daily', prescribedBy: 'Dr. Mateo Silva', refillsLeft: 0, supplyDays: 0, supplyTotal: 30, status: 'Expired' },
]

export const invoices: Invoice[] = [
  { id: 'INV-2048', service: 'Video consultation — Cardiology', date: 'Sep 19, 2026', amount: 120, covered: 90, status: 'Due' },
  { id: 'INV-2031', service: 'Prescription renewal', date: 'Sep 10, 2026', amount: 35, covered: 35, status: 'Paid' },
  { id: 'INV-2017', service: 'Video consultation — General', date: 'Sep 04, 2026', amount: 80, covered: 60, status: 'Paid' },
  { id: 'INV-2002', service: 'Dermatology chat review', date: 'Aug 28, 2026', amount: 45, covered: 20, status: 'Processing' },
  { id: 'INV-1988', service: 'Lab results review', date: 'Aug 15, 2026', amount: 60, covered: 60, status: 'Paid' },
]

export const vitals = [
  { label: 'Heart rate', value: '72', unit: 'bpm', trend: [68, 71, 70, 74, 72, 69, 72] },
  { label: 'Blood pressure', value: '118/76', unit: 'mmHg', trend: [122, 120, 121, 119, 118, 117, 118] },
  { label: 'Sleep', value: '7.4', unit: 'hrs', trend: [6.2, 7.1, 6.8, 7.6, 7.2, 8.0, 7.4] },
]
