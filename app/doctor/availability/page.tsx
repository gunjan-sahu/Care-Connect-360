import { earningsByMonth, payouts } from '@/lib/doctor-data'
import { cn } from '@/lib/utils'

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default function EarningsPage() {
  const max = Math.max(...earningsByMonth.map((m) => m.amount))
  const thisMonth = earningsByMonth[earningsByMonth.length - 1].amount
  const pending = payouts.filter((p) => p.status === 'Pending').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <section className="rounded-[1.75rem] bg-foreground p-6 text-background">
        <p className="text-sm text-background/60">This month</p>
        <p className="mt-2 text-5xl font-medium tracking-tight">{inr(thisMonth)}</p>
      </section>
      <section className="rounded-[1.75rem] bg-card p-6">
        <p className="text-sm text-muted-foreground">Pending payout</p>
        <p className="mt-2 text-4xl font-medium tracking-tight">{inr(pending)}</p>
      </section>
      <section className="rounded-[1.75rem] bg-card p-6">
        <p className="text-sm text-muted-foreground">Visits this month</p>
        <p className="mt-2 text-4xl font-medium tracking-tight">58</p>
      </section>

      <section className="rounded-[1.75rem] bg-card p-5 sm:p-6 lg:col-span-3">
        <h2 className="font-medium">Last 5 months</h2>
        <div className="mt-6 flex h-48 items-end gap-3">
          {earningsByMonth.map((m) => (
            <div key={m.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div
                className="w-full rounded-t-xl bg-brand transition-[height] duration-1000"
                style={{ height: `${(m.amount / max) * 85}%` }}
                title={inr(m.amount)}
              />
              <span className="text-xs text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-card p-5 sm:p-6 lg:col-span-3">
        <h2 className="font-medium">Payouts</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="pb-3 font-normal">ID</th>
                <th className="pb-3 font-normal">Date</th>
                <th className="pb-3 font-normal">Visits</th>
                <th className="pb-3 text-right font-normal">Amount</th>
                <th className="pb-3 pl-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="py-3.5 font-mono text-xs">{p.id}</td>
                  <td className="py-3.5">{p.date}</td>
                  <td className="py-3.5">{p.visits}</td>
                  <td className="py-3.5 text-right font-medium">{inr(p.amount)}</td>
                  <td className="py-3.5 pl-4">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                        p.status === 'Paid' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}