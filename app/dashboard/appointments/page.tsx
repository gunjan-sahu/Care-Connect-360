import { AppointmentsView } from '@/components/dashboard/appointments-view'
import { appointments, doctors } from '@/lib/data'

export default function AppointmentsPage() {
  return <AppointmentsView appointments={appointments} doctors={doctors} />
}
