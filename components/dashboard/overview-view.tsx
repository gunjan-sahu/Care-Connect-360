'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingDialog } from '@/components/booking-dialog'
import { StatusPill } from '@/components/dashboard/status-pill'
import { useApi } from '@/lib/use-api'
import { getSession, type Session } from '@/lib/session'
import { inr, shortDate, shortTime } from '@/lib/format'
import type { Appointment, Invoice, Paged, PatientProfile, Prescription } from '@/lib/types'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export function OverviewView() {
  const [user, setUser] = useState<Session | null>(null)
  const appts = useApi<Paged<Appointment>>('/appointments/')
  const rx = useApi<Paged<Prescription>>('/prescriptions/')
  const inv = useApi<Paged<Invoice>>('/invoices/')
  const me = useApi<Paged<PatientProfile>>('/patients/')

  useEffect(() => setUser(getSession()), [])

  const all = appts.data?.results ?? []
  const upcoming = all.filter((a) => a.status === 'Upcoming')
  const completed = all.filter((a) => a.status === 'Completed')
  const next = upcoming[0]
  const list = upcoming.length > 0 ? upcoming : completed.slice(-3).reverse()
  const latest = completed[completed.length - 1]

  const dueInvoices = (inv.data?.results ?? []).filter((i) => i.status === 'Due')
  const due = dueInvoices.reduce((s, i) => s + Number(i.amount_due), 0)

  const profile = me.data?.results[0]
  const meds = (rx.data?.results ?? []).filter((p) => p.status !== 'Expired')

  const cards = [
    { label: 'Blood type', value: profile?.blood_type || '—', sub: profile ? `${profile.age} yrs · ${profile.gender}` : '' },
    {
      label: 'Medical condition',
      value: profile?.medical_condition || '—',
      sub: latest?.test_results ? `Latest test: ${latest.test_results}` : 'No tests yet',
    },
    {
      label: 'Insurance',
      value: profile?.insurance_provider || '—',
      sub: profile ? `Allergies: ${profile.allergies}` : '',
    },
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
          <p className="text-xs tracking-[0.2em] text-background/60 uppercase">
            {next ? 'Next consultation' : 'No upcoming consultation'}
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            {greeting()}, {user?.name.split(' ')[0] ?? ''}.
          </h2>
          <p className="mt-3 text-background/70">
            {next
              ? `${next.doctor_name} · ${next.specialty} · ${shortDate(next.date)} at ${shortTime(next.time)}`
              : 'Book a consultation to get started.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {next ? (
              <Button
                nativeButton={false}
                render={<Link href={`/dashboard/consultation?appointment=${next.id}`} />}
                className="h-11 rounded-full bg-brand px-5 text-primary-foreground hover:bg-brand/90"
              >
                <Video data-icon="inline-start" />
                Join waiting room
              </Button>
            ) : (
              <BookingDialog
                trigger={<Button className="h-11 rounded-full bg-brand px-5 text-primary-foreground hover:bg-brand/90">Book a consultation</Button>}
              />
            )}
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/dashboard/appointments" />}
              className="h-11 rounded-full border-background/20 bg-transparent px-5 text-background hover:bg-background/10 hover:text-background"
            >
              View schedule
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-between rounded-[1.75rem] bg-card p-6">
        <p className="text-sm text-muted-foreground">Balance due</p>
        <p className="mt-2 text-4xl font-medium tracking-tight">{inr(due)}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {due === 0 ? 'All invoices paid' : `After insurance · ${dueInvoices.length} invoice${dueInvoices.length === 1 ? '' : 's'}`}
        </p>
        <Button nativeButton={false} render={<Link href="/dashboard/billing" />} className="mt-6 h-11 rounded-full">
          {due === 0 ? 'View billing' : 'Pay now'}
        </Button>
      </section>

      {cards.map((c, i) => (
        <section
          key={c.label}
          className="animate-in rounded-[1.75rem] bg-card p-6 fade-in-0 slide-in-from-bottom-4 fill-mode-both duration-700"
          style={{ animationDelay: `${150 + i * 100}ms` }}
        >
          <p className="text-sm text-muted-foreground">{c.label}</p>
          <p className="mt-2 text-3xl font-medium tracking-tight">{c.value}</p>
          <p className="mt-4 text-sm text-muted-foreground">{c.sub}</p>
        </section>
      ))}

      <section className="rounded-[1.75rem] bg-card p-6 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">{upcoming.length > 0 ? 'Upcoming' : 'Recent visits'}</h2>
          <Link href="/dashboard/appointments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            All <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <ul className="mt-4 divide-y">
          {appts.loading && <li className="py-6 text-sm text-muted-foreground">Loading…</li>}
          {!appts.loading && list.length === 0 && (
            <li className="py-6 text-sm text-muted-foreground">No appointments yet. Book your first consultation.</li>
          )}
          {list.map((a) => (
            <li key={a.id} className="flex items-center gap-4 py-3.5">
              <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-muted py-1.5">
                <span className="text-[10px] text-muted-foreground uppercase">{shortDate(a.date).split(' ')[0]}</span>
                <span className="text-lg leading-none font-medium">{shortDate(a.date).split(' ')[1]}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{a.doctor_name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {a.specialty} · {shortTime(a.time)} · {a.kind}
                </p>
              </div>
              <StatusPill status={a.status} />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[1.75rem] bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Medications</h2>
          <Link href="/dashboard/prescriptions" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            All <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <ul className="mt-4 flex flex-col gap-4">
          {!rx.loading && meds.length === 0 && <li className="text-sm text-muted-foreground">No medications yet.</li>}
          {meds.map((p) => (
            <li key={p.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {p.name} <span className="font-normal text-muted-foreground">{p.dosage}</span>
                </span>
                <span className="font-mono text-xs text-muted-foreground">{p.supply_days}d</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={p.status === 'Refill due' ? 'h-full rounded-full bg-brand' : 'h-full rounded-full bg-foreground'}
                  style={{ width: `${p.supply_total ? (p.supply_days / p.supply_total) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}