'use client'

import { inr, shortDate } from '@/lib/format'
import { useApi } from '@/lib/use-api'
import type { Appointment, DoctorStats, Paged } from '@/lib/types'

export default function EarningsPage() {
  const stats = useApi<DoctorStats>('/doctor/stats/')
  const done = useApi<Paged<Appointment>>('/appointments/?status=Completed')
  const s = stats.data
  const months = s?.months ?? []
  const max = Math.max(1, ...months.map((m) => m.amount))
  const thisMonth = months[months.length - 1]
  const recent = (done.data?.results ?? []).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 15)

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <section className="rounded-[1.75rem] bg-foreground p-6 text-background">
        <p className="text-sm text-background/60">This month (estimated)</p>
        <p className="mt-2 text-5xl font-medium tracking-tight">{inr(thisMonth?.amount ?? 0)}</p>
      </section>
      <section className="rounded-[1.75rem] bg-card p-6">
        <p className="text-sm text-muted-foreground">Visits this month</p>
        <p className="mt-2 text-4xl font-medium tracking-tight">{thisMonth?.visits ?? 0}</p>
      </section>
      <section className="rounded-[1.75rem] bg-card p-6">
        <p className="text-sm text-muted-foreground">All completed visits</p>
        <p className="mt-2 text-4xl font-medium tracking-tight">{s?.completed ?? 0}</p>
      </section>

      <section className="rounded-[1.75rem] bg-card p-5 sm:p-6 lg:col-span-3">
        <h2 className="font-medium">Last 5 months</h2>
        <div className="mt-6 flex h-48 items-end gap-3">
          {months.map((m) => (
            <div key={m.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div
                className="w-full rounded-t-xl bg-brand transition-[height] duration-1000"
                style={{ height: `${Math.max(2, (m.amount / max) * 85)}%` }}
                title={inr(m.amount)}
              />
              <span className="text-xs text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-card p-5 sm:p-6 lg:col-span-3">
        <h2 className="font-medium">Recent completed visits</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="pb-3 font-normal">Date</th>
                <th className="pb-3 font-normal">Patient</th>
                <th className="pb-3 font-normal">Type</th>
                <th className="pb-3 text-right font-normal">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recent.map((a) => (
                <tr key={a.id}>
                  <td className="py-3.5">{shortDate(a.date)}, {a.date.slice(0, 4)}</td>
                  <td className="py-3.5">{a.patient_name}</td>
                  <td className="py-3.5 text-muted-foreground">{a.kind}</td>
                  <td className="py-3.5 text-right font-medium">{inr(s?.fee ?? 800)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!done.loading && recent.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No completed visits yet.</p>}
        </div>
      </section>
    </div>
  )
}