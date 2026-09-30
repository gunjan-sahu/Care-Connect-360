import { doctorStats, queue } from '@/lib/doctor-data'
import { cn } from '@/lib/utils'

const statusTone: Record<string, string> = {
  Waiting: 'bg-amber-100 text-amber-800',
  'In progress': 'bg-brand text-primary-foreground',
  Scheduled: 'bg-muted text-muted-foreground',
  Done: 'bg-success/15 text-success',
}

export default function DoctorOverviewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {doctorStats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="text-sm font-medium">Today&apos;s patient queue</h2>
        </div>
        <ul className="divide-y">
          {queue.map((q) => (
            <li key={q.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="w-14 font-mono text-sm">{q.time}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {q.patient} <span className="font-normal text-muted-foreground">· {q.age} yrs</span>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {q.reason} · {q.type}
                </p>
              </div>
              <span className={cn('rounded-md px-2 py-1 text-xs font-medium', statusTone[q.status])}>{q.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}