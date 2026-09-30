'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const slots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']

export default function AvailabilityPage() {
  const [day, setDay] = useState(days[0])
  const [open, setOpen] = useState<Record<string, string[]>>({
    Mon: ['09:00', '10:00', '14:00', '15:00'],
    Tue: ['09:00', '10:00', '11:00'],
    Wed: ['14:00', '15:00', '16:00'],
    Thu: ['09:00', '10:00', '14:00'],
    Fri: ['09:00', '10:00', '11:00', '12:00'],
  })

  function toggle(slot: string) {
    setOpen((prev) => {
      const current = prev[day]
      const next = current.includes(slot) ? current.filter((s) => s !== slot) : [...current, slot]
      return { ...prev, [day]: next }
    })
  }

  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-sm font-medium">Set the hours patients can book</h2>
      <p className="mt-1 text-xs text-muted-foreground">Click a time to open or close it.</p>

      <div className="mt-4 flex gap-2">
        {days.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDay(d)}
            aria-pressed={day === d}
            className={cn(
              'rounded-md border px-4 py-1.5 text-sm',
              day === d ? 'border-foreground bg-foreground text-background' : 'hover:border-foreground/40',
            )}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {slots.map((s) => {
          const isOpen = open[day].includes(s)
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              aria-pressed={isOpen}
              className={cn(
                'rounded-md border py-2.5 font-mono text-sm transition-colors',
                isOpen ? 'border-brand bg-brand text-primary-foreground' : 'text-muted-foreground hover:border-brand',
              )}
            >
              {s}
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {open[day].length} open slot(s) on {day}.
      </p>
      <Button className="mt-4" onClick={() => toast.success('Availability saved')}>
        Save availability
      </Button>
    </section>
  )
}