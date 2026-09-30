export type QueueItem = {
  id: string
  patient: string
  age: number
  reason: string
  time: string
  type: 'Video' | 'Chat' | 'Follow-up'
  status: 'Waiting' | 'In progress' | 'Scheduled' | 'Done'
}

export type Patient = {
  id: string
  name: string
  age: number
  gender: string
  condition: string
  lastVisit: string
  allergies: string
  meds: string[]
}

export const doctorProfile = {
  name: 'Dr. Amara Okafor',
  initials: 'AO',
  specialty: 'General Practice',
}

export const doctorStats = [
  { label: "Today's patients", value: '8' },
  { label: 'Waiting now', value: '2' },
  { label: 'Avg. visit', value: '14 min' },
  { label: 'Pending notes', value: '3' },
]

export const queue: QueueItem[] = [
  { id: 'q1', patient: 'Jordan Miles', age: 34, reason: 'BP follow-up, afternoon fatigue', time: '14:30', type: 'Video', status: 'Waiting' },
  { id: 'q2', patient: 'Sara Ahmed', age: 27, reason: 'Persistent cough, 5 days', time: '14:45', type: 'Video', status: 'Waiting' },
  { id: 'q3', patient: 'Luis Ortega', age: 51, reason: 'Diabetes check-in', time: '15:15', type: 'Follow-up', status: 'Scheduled' },
  { id: 'q4', patient: 'Meera Nair', age: 42, reason: 'Migraine review', time: '15:45', type: 'Chat', status: 'Scheduled' },
  { id: 'q5', patient: 'Tom Becker', age: 63, reason: 'Medication renewal', time: '13:00', type: 'Video', status: 'Done' },
]

export const patients: Patient[] = [
  { id: 'p1', name: 'Jordan Miles', age: 34, gender: 'Male', condition: 'Hypertension', lastVisit: 'Sep 04', allergies: 'None', meds: ['Lisinopril 10 mg', 'Atorvastatin 20 mg'] },
  { id: 'p2', name: 'Sara Ahmed', age: 27, gender: 'Female', condition: 'Seasonal allergies', lastVisit: 'Aug 18', allergies: 'Penicillin', meds: ['Cetirizine 10 mg'] },
  { id: 'p3', name: 'Luis Ortega', age: 51, gender: 'Male', condition: 'Type 2 diabetes', lastVisit: 'Sep 12', allergies: 'None', meds: ['Metformin 500 mg'] },
  { id: 'p4', name: 'Meera Nair', age: 42, gender: 'Female', condition: 'Chronic migraine', lastVisit: 'Sep 01', allergies: 'Sulfa drugs', meds: ['Sumatriptan 50 mg'] },
  { id: 'p5', name: 'Tom Becker', age: 63, gender: 'Male', condition: 'High cholesterol', lastVisit: 'Sep 30', allergies: 'None', meds: ['Rosuvastatin 10 mg'] },
]

export const earningsByMonth = [
  { month: 'May', amount: 3200 },
  { month: 'Jun', amount: 3800 },
  { month: 'Jul', amount: 3500 },
  { month: 'Aug', amount: 4300 },
  { month: 'Sep', amount: 4700 },
]

export const payouts = [
  { id: 'PAY-311', date: 'Sep 28', visits: 12, amount: 960, status: 'Paid' },
  { id: 'PAY-298', date: 'Sep 21', visits: 14, amount: 1120, status: 'Paid' },
  { id: 'PAY-284', date: 'Sep 14', visits: 11, amount: 880, status: 'Paid' },
  { id: 'PAY-320', date: 'Oct 05', visits: 9, amount: 720, status: 'Pending' },
]