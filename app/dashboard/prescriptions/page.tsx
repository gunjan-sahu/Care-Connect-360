import { PrescriptionsView } from '@/components/dashboard/prescriptions-view'
import { prescriptions } from '@/lib/data'

export default function PrescriptionsPage() {
  return <PrescriptionsView prescriptions={prescriptions} />
}
