import { BillingView } from '@/components/dashboard/billing-view'
import { invoices } from '@/lib/data'

export default function BillingPage() {
  return <BillingView invoices={invoices} />
}
