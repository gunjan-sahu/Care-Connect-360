import { earningsByMonth, payouts } from '@/lib/doctor-data'
import { cn } from '@/lib/utils'

export default function EarningsPage() {
  const max = Math.max(...earningsByMonth.map((m) => m.amount))
  const thisMonth = earningsByMonth[earningsByMonth.length - 1].amount

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">This month</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">${thisMonth.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Pending payout</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">$720</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Visits this month</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">58</p>
        </div>
      </div>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-sm font-medium">Last 5 months</h2>
        <div className="mt-4 flex h-40 items-end gap-3">
          {earningsByMonth.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-brand"
                style={{ height: `${(m.amount / max) * 100}%` }}
                title={`$${m.amount}`}
              />
              <span className="text-xs text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="text-sm font-medium">Payouts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-normal">ID</th>
                <th className="px-4 py-2 font-normal">Date</th>
                <th className="px-4 py-2 font-normal">Visits</th>
                <th className="px-4 py-2 text-right font-normal">Amount</th>
                <th className="px-4 py-2 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-3">{p.date}</td>
                  <td className="px-4 py-3">{p.visits}</td>
                  <td className="px-4 py-3 text-right font-medium">${p.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-md px-2 py-1 text-xs font-medium',
                        p.status === 'Paid' ? 'bg-success/15 text-success' : 'bg-amber-100 text-amber-800',
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