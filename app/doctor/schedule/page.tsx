'use client'

import { shortDate, shortTime } from '@/lib/format'
import { useApi } from '@/lib/use-api'
import type { Appointment, Paged } from '@/lib/types'

export default function SchedulePage() {
  const { data, loading } = useApi<Paged<Appointment>>('/appointments/?status=Upcoming')
  const items = (data?.results ?? []).slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const days = Array.from(new Set(items.map((a) => a.date)))

  return (
    <section className="rounded-[1.75rem] bg-card p-5 sm:p-6">
      <h2 className="font-medium">Upcoming schedule</h2>
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {!loading && items.length === 0 && <p className="mt-4 text-sm text-muted-foreground">Nothing scheduled yet.</p>}
      <div className="mt-4 flex flex-col gap-6">
        {days.map((d) => (
          <div key={d}>
            <p className="mb-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
              {shortDate(d)}, {d.slice(0, 4)}
            </p>
            <ul className="divide-y rounded-2xl border">
              {items
                .filter((a) => a.date === d)
                .map((q) => (
                  <li key={q.id} className="flex gap-4 px-4 py-3">
                    <span className="w-14 shrink-0 pt-0.5 font-mono text-sm text-muted-foreground">{shortTime(q.time)}</span>
                    <div>
                      <p className="text-sm font-medium">{q.patient_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {q.reason || q.patient_condition} · {q.kind}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}