import { queue } from '@/lib/doctor-data'
import { cn } from '@/lib/utils'

const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

export default function SchedulePage() {
  return (
    <section className="rounded-[1.75rem] bg-card p-5 sm:p-6">
      <h2 className="font-medium">Today&apos;s schedule</h2>
      <ul className="mt-4 divide-y">
        {hours.map((h) => {
          const hour = h.slice(0, 2)
          const items = queue.filter((q) => q.time.startsWith(hour))
          return (
            <li key={h} className="flex min-h-14 gap-4 py-2.5">
              <span className="w-14 shrink-0 pt-1 font-mono text-sm text-muted-foreground">{h}</span>
              <div className="flex flex-1 flex-col gap-2">
                {items.length === 0 && <span className="pt-1 text-xs text-muted-foreground/60">Free</span>}
                {items.map((q) => (
                  <div
                    key={q.id}
                    className={cn(
                      'rounded-2xl px-4 py-3',
                      q.status === 'Done' ? 'bg-success/10' : 'bg-brand-soft',
                    )}
                  >
                    <p className="text-sm font-medium">
                      {q.time} · {q.patient}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {q.reason} · {q.type}
                    </p>
                  </div>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}