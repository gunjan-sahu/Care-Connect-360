'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { getSession } from '@/lib/session'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = Array.from({ length: 13 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`)

type Day = { on: boolean; from: string; to: string }
const defaults: Day[] = DAYS.map((_, i) => ({ on: i < 5, from: '09:00', to: '17:00' }))

export default function AvailabilityPage() {
  const [days, setDays] = useState<Day[]>(defaults)
  const [key, setKey] = useState<string | null>(null)

  useEffect(() => {
    const k = `cc360-availability-${getSession()?.id ?? 0}`
    setKey(k)
    try {
      const raw = localStorage.getItem(k)
      if (raw) setDays(JSON.parse(raw))
    } catch {}
  }, [])

  function update(i: number, patch: Partial<Day>) {
    setDays((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)))
  }

  function save() {
    const bad = days.find((d) => d.on && d.to <= d.from)
    if (bad) {
      toast.error('End time must be after start time.')
      return
    }
    try {
      if (key) localStorage.setItem(key, JSON.stringify(days))
    } catch {}
    toast.success('Availability saved')
  }

  return (
    <section className="rounded-[1.75rem] bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-medium">Weekly availability</h2>
          <p className="text-sm text-muted-foreground">Saved on this device only for now.</p>
        </div>
        <Button className="rounded-full" onClick={save}>
          Save changes
        </Button>
      </div>

      <ul className="mt-6 divide-y rounded-2xl border">
        {days.map((d, i) => (
          <li key={DAYS[i]} className="flex flex-wrap items-center gap-4 px-4 py-3.5">
            <Switch checked={d.on} onCheckedChange={(v) => update(i, { on: Boolean(v) })} aria-label={`Available on ${DAYS[i]}`} />
            <span className="w-28 text-sm font-medium">{DAYS[i]}</span>
            {d.on ? (
              <div className="flex items-center gap-2 text-sm">
                <select
                  value={d.from}
                  onChange={(e) => update(i, { from: e.target.value })}
                  className="h-9 rounded-lg border bg-transparent px-2 font-mono"
                  aria-label={`${DAYS[i]} start time`}
                >
                  {HOURS.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
                <span className="text-muted-foreground">to</span>
                <select
                  value={d.to}
                  onChange={(e) => update(i, { to: e.target.value })}
                  className="h-9 rounded-lg border bg-transparent px-2 font-mono"
                  aria-label={`${DAYS[i]} end time`}
                >
                  {HOURS.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Unavailable</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}