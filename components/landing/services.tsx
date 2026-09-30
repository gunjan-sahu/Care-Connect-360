'use client'

import { useState } from 'react'
import { ArrowUpRight, CalendarCheck, Pill, Receipt, Video, Check } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const services = [
  {
    n: '01',
    tag: 'Consultations',
    title: 'Virtual consultations with licensed specialists',
    body: 'Book same-day appointments across 20+ specialties. Share symptoms, photos and history before the call so your doctor arrives prepared.',
    icon: CalendarCheck,
    points: ['Same-day availability', 'Pre-visit intake forms', 'Visit summaries in your inbox'],
  },
  {
    n: '02',
    tag: 'Prescriptions',
    title: 'Prescriptions that renew themselves',
    body: 'E-prescriptions go straight to your preferred pharmacy. Track supply, get refill reminders and request renewals in a single tap.',
    icon: Pill,
    points: ['E-prescribing to 60k pharmacies', 'Smart refill reminders', 'Interaction checks'],
  },
  {
    n: '03',
    tag: 'Secure video',
    title: 'End-to-end encrypted video visits',
    body: 'HD video that adapts to your connection, with screen share, live notes and a waiting room — no downloads required.',
    icon: Video,
    points: ['End-to-end encryption', 'Adaptive bitrate', 'Works in any browser'],
  },
  {
    n: '04',
    tag: 'Billing',
    title: 'Transparent billing & insurance',
    body: 'See your cost before you book. Insurance is verified automatically and invoices are itemised, downloadable and payable in seconds.',
    icon: Receipt,
    points: ['Real-time eligibility checks', 'Itemised invoices', 'HSA / FSA supported'],
  },
]

export function Services() {
  const [active, setActive] = useState<(typeof services)[number] | null>(null)
  const ActiveIcon = active?.icon

  return (
    <section id="services" className="scroll-mt-24 px-3 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-card px-6 py-16 sm:px-12 sm:py-24 md:px-16">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-xl text-3xl leading-tight font-medium tracking-tight text-balance sm:text-5xl">
            Everything your care needs, <span className="text-brand">in one place.</span>
          </h2>
          <p className="max-w-sm text-muted-foreground">
            Four connected services, one account. Tap a card to see what&apos;s included.
          </p>
        </Reveal>

        <ul className="mt-14 flex flex-col gap-3">
          {services.map((s, i) => {
            return (
              <Reveal as="li" key={s.n} delay={i * 80}>
                <button
                  type="button"
                  onClick={() => setActive(s)}
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-start gap-5 rounded-3xl border bg-background/40 p-5 text-left transition-all duration-500 hover:border-brand/40 hover:bg-brand-soft/60 sm:gap-8 sm:p-8 md:grid-cols-[6rem_1fr_1fr_auto]"
                >
                  <span className="font-mono text-3xl font-light sm:text-5xl">{s.n}</span>
                  <span className="flex flex-col gap-2">
                    <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{s.tag}</span>
                    <span className="text-lg leading-snug font-medium text-balance sm:text-2xl">{s.title}</span>
                  </span>
                  <span className="col-span-3 col-start-1 hidden text-sm leading-relaxed text-muted-foreground md:col-span-1 md:col-start-auto md:block">
                    {s.body}
                  </span>
                  <span className="relative flex size-11 items-center justify-center rounded-full border transition-all duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-primary-foreground">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                    <span className="sr-only">View {s.tag} details</span>
                  </span>
                </button>
              </Reveal>
            )
          })}
        </ul>
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="gap-6 rounded-3xl p-6 sm:max-w-md">
          {active && ActiveIcon && (
            <>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <ActiveIcon className="size-6" aria-hidden="true" />
              </div>
              <DialogHeader>
                <p className="font-mono text-xs text-muted-foreground">
                  {active.n} · {active.tag.toUpperCase()}
                </p>
                <DialogTitle className="text-2xl leading-tight font-medium tracking-tight">{active.title}</DialogTitle>
                <DialogDescription className="leading-relaxed">{active.body}</DialogDescription>
              </DialogHeader>
              <ul className="flex flex-col gap-2">
                {active.points.map((p, i) => (
                  <li
                    key={p}
                    className="flex animate-in items-center gap-3 rounded-xl bg-muted px-4 py-3 text-sm fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-500" 
                    style={{ animationDelay: `${150 + i * 80}ms` }}
                  >
                    <Check className="size-4 text-brand" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
