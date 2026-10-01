'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Video } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { BookingDialog } from '@/components/booking-dialog'
import { StatusPill } from '@/components/dashboard/status-pill'
import { api } from '@/lib/api'
import { initialsOf, shortDate, shortTime } from '@/lib/format'
import { notifyChanged, useApi } from '@/lib/use-api'
import type { Appointment, Paged } from '@/lib/types'
import { cn } from '@/lib/utils'

const tabs = ['Upcoming', 'Completed', 'Cancelled'] as const

export function AppointmentsView() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Upcoming')
  const { data, loading, error } = useApi<Paged<Appointment>>('/appointments/')
  const items = data?.results ?? []
  const list = items
    .filter((a) => a.status === tab)
    .sort((a, b) => (tab === 'Upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)))

  const team = Array.from(new Map(items.map((a) => [a.doctor, a])).values())

  async function cancel(id: number) {
    try {
      await api(`/appointments/${id}/cancel/`, { method: 'POST' })
      toast('Appointment cancelled')
      notifyChanged()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not cancel.')
    }
  }

  return (
    <div className="grid gap-3 xl:grid-cols-3">
      <section className="rounded-[1.75rem] bg-card p-5 sm:p-6 xl:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Appointment status" className="flex rounded-full bg-muted p-1 text-sm">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  'rounded-full px-4 py-1.5 transition-all duration-300',
                  tab === t ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t}
                <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                  {items.filter((a) => a.status === t).length}
                </span>
              </button>
            ))}
          </div>
          <BookingDialog
            trigger={
              <Button className="h-10 rounded-full px-4">
                <Plus data-icon="inline-start" />
                Book
              </Button>
            }
          />
        </div>

        <ul key={tab} className="mt-6 flex flex-col gap-2">
          {loading && <li className="p-10 text-center text-sm text-muted-foreground">Loading…</li>}
          {error && <li className="p-10 text-center text-sm text-destructive">{error}</li>}
          {!loading && !error && list.length === 0 && (
            <li className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              No {tab.toLowerCase()} appointments.
            </li>
          )}
          {list.map((a, i) => (
            <li
              key={a.id}
              className="flex animate-in flex-col gap-4 rounded-2xl border p-4 fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-500 sm:flex-row sm:items-center"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-muted py-2">
                  <span className="text-[10px] text-muted-foreground uppercase">{shortDate(a.date).split(' ')[0]}</span>
                  <span className="text-xl leading-none font-medium">{shortDate(a.date).split(' ')[1]}</span>
                  <span className="mt-1 font-mono text-[10px] text-muted-foreground">{shortTime(a.time)}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{a.doctor_name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {a.specialty} · {a.kind}
                    {a.reason ? ` · ${a.reason}` : ''}
                  </p>
                  <div className="mt-2">
                    <StatusPill status={a.status} />
                  </div>
                </div>
              </div>
              {a.status === 'Upcoming' && (
                <div className="flex gap-2">
                  <Button variant="ghost" className="rounded-full" onClick={() => cancel(a.id)}>
                    Cancel
                  </Button>
                  <Button
                    nativeButton={false}
                    render={<Link href={`/dashboard/consultation?appointment=${a.id}`} />}
                    className="rounded-full bg-brand hover:bg-brand/90"
                  >
                    <Video data-icon="inline-start" />
                    Join
                  </Button>
                </div>
              )}
              {a.status === 'Completed' && (
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() =>
                    toast(`Test result: ${a.test_results || 'Not recorded'}`, {
                      description: `Room ${a.room_number ?? '—'} · discharged ${a.discharge_date ?? '—'}`,
                    })
                  }
                >
                  Visit details
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[1.75rem] bg-card p-5 sm:p-6">
        <h2 className="font-medium">Your care team</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {team.length === 0 && <li className="p-2 text-sm text-muted-foreground">Doctors you book will appear here.</li>}
          {team.map((a) => (
            <li key={a.doctor} className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-muted">
              <span className="flex size-11 items-center justify-center rounded-full bg-brand-soft text-sm font-medium text-accent-foreground transition-transform duration-300 group-hover:scale-105">
                {initialsOf(a.doctor_name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{a.doctor_name}</p>
                <p className="truncate text-xs text-muted-foreground">{a.specialty}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}