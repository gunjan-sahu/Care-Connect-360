'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSession, type Session } from '@/lib/session'
import { shortDate, shortTime, inr } from '@/lib/format'
import { useApi } from '@/lib/use-api'
import type { Appointment, DoctorStats, Paged } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function DoctorOverviewPage() {
  const [user, setUser] = useState<Session | null>(null)
  const appts = useApi<Paged<Appointment>>('/appointments/?status=Upcoming')
  const stats = useApi<DoctorStats>('/doctor/stats/')
  useEffect(() => setUser(getSession()), [])

  const queue = (appts.data?.results ?? [])
    .slice()
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const next = queue[0]
  const s = stats.data

  const cards = [
    ['Today', s?.today ?? 0],
    ['Upcoming visits', s?.upcoming ?? 0],
    ['Patients', s?.patients ?? 0],
    ['Completed visits', s?.completed ?? 0],
  ]

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-foreground p-6 text-background sm:p-8 lg:col-span-2">
        <Image
          src="/images/hero-helix.png"
          alt=""
          fill
          sizes="50vw"
          className="animate-float object-contain object-right opacity-70 mix-blend-screen invert hue-rotate-180 brightness-75 contrast-150"
        />
        <div className="relative max-w-md">
          <p className="text-xs tracking-[0.2em] text-background/60 uppercase">Next patient</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">Welcome, {user?.name ?? ''}.</h2>
          <p className="mt-3 text-background/70">
            {next
              ? `${next.patient_name} · ${next.reason || 'Consultation'} · ${shortDate(next.date)} ${shortTime(next.time)}`
              : 'No upcoming patients right now.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {next && (
              <Button
                nativeButton={false}
                render={<Link href={`/doctor/consultation?appointment=${next.id}`} />}
                className="h-11 rounded-full bg-brand px-5 text-primary-foreground hover:bg-brand/90"
              >
                <Video data-icon="inline-start" />
                Start consultation
              </Button>
            )}
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/doctor/schedule" />}
              className="h-11 rounded-full border-background/20 bg-transparent px-5 text-background hover:bg-background/10 hover:text-background"
            >
              View schedule
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-between rounded-[1.75rem] bg-card p-6">
        <p className="text-sm text-muted-foreground">Fee per visit</p>
        <p className="mt-2 text-5xl font-medium tracking-tight">{inr(s?.fee ?? 800)}</p>
        <p className="mt-1 text-sm text-muted-foreground">Estimated, paid on completed visits</p>
      </section>

      {cards.map(([l, v]) => (
        <section key={l} className="rounded-[1.75rem] bg-card p-6">
          <p className="text-sm text-muted-foreground">{l}</p>
          <p className="mt-2 text-3xl font-medium tracking-tight">{v}</p>
        </section>
      ))}

      <section className="rounded-[1.75rem] bg-card p-6 lg:col-span-3">
        <h2 className="font-medium">Upcoming patient queue</h2>
        <ul className="mt-4 divide-y">
          {appts.loading && <li className="py-6 text-sm text-muted-foreground">Loading…</li>}
          {!appts.loading && queue.length === 0 && (
            <li className="py-6 text-sm text-muted-foreground">No upcoming appointments. Patients who book you appear here.</li>
          )}
          {queue.map((q) => (
            <li key={q.id} className="flex flex-wrap items-center gap-4 py-3.5">
              <div className="flex w-20 shrink-0 flex-col items-center rounded-xl bg-muted py-1.5">
                <span className="text-[10px] text-muted-foreground uppercase">{shortDate(q.date)}</span>
                <span className="font-mono text-sm">{shortTime(q.time)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {q.patient_name} <span className="font-normal text-muted-foreground">· {q.patient_age} yrs</span>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {q.reason || q.patient_condition} · {q.kind}
                </p>
              </div>
              <span className={cn('inline-flex rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-accent-foreground')}>
                Upcoming
              </span>
              {q.kind !== 'Chat' && (
                <Button
                  size="sm"
                  nativeButton={false}
                  render={<Link href={`/doctor/consultation?appointment=${q.id}`} />}
                  className="rounded-full bg-brand hover:bg-brand/90"
                >
                  <Video data-icon="inline-start" />
                  Start
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}