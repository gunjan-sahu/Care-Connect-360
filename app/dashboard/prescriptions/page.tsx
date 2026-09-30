import { PrescriptionsView } from '@/components/dashboard/prescriptions-view'
import { DoctorPrescriptions } from '@/components/dashboard/doctor-prescriptions'
import { prescriptions } from '@/lib/data'

export default function PrescriptionsPage() {
  return (
    <>
      <DoctorPrescriptions />
      <PrescriptionsView prescriptions={prescriptions} />
    </>
  )
}