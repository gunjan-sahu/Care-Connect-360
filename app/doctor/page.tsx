import Link from 'next/link'
import Image from 'next/image'
import { Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { doctorProfile, doctorStats, queue } from '@/lib/doctor-data'
import { cn } from '@/lib/utils'

const statusTone: Record<string, string> = {
  Waiting: 'bg-foreground text-background',
  'In progress': 'bg-brand text-primary-foreground',
  Scheduled: 'bg-muted text-muted-foreground',
  Done: 'bg-success/15 text-success',
}

export default function DoctorOverviewPage() {
  const next = queue.find((q) => q.status === 'Waiting')

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
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">Good afternoon, {doctorProfile.name.replace('Dr. ', 'Dr. ')}.</h2>
          <p className="mt-3 text-background/70">
            {next ? `${next.patient} · ${next.reason} · ${next.time}` : 'No patients waiting right now.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Button
              nativeButton={false}
              render={<Link href="/doctor/consultation" />}
              className="h-11 rounded-full bg-brand px-5 text-primary-foreground hover:bg-brand/90"
            >
              <Video data-icon="inline-start" />
              Start consultation
            </Button>
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
        <p className="text-sm text-muted-foreground">{doctorStats[0].label}</p>
        <p className="mt-2 text-5xl font-medium tracking-tight">{doctorStats[0].value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{doctorProfile.specialty}</p>
      </section>

      {doctorStats.slice(1).map((s, i) => (
        <section
          key={s.label}
          className="animate-in rounded-[1.75rem] bg-card p-6 fade-in-0 slide-in-from-bottom-4 fill-mode-both duration-700"
          style={{ animationDelay: `${150 + i * 100}ms` }}
        >
          <p className="text-sm text-muted-foreground">{s.label}</p>
          <p className="mt-2 text-3xl font-medium tracking-tight">{s.value}</p>
        </section>
      ))}

      <section className="rounded-[1.75rem] bg-card p-6 lg:col-span-3">
        <h2 className="font-medium">Today&apos;s patient queue</h2>
        <ul className="mt-4 divide-y">
          {queue.map((q) => (
            <li key={q.id} className="flex flex-wrap items-center gap-4 py-3.5">
              <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-muted py-1.5">
                <span className="font-mono text-sm">{q.time}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {q.patient} <span className="font-normal text-muted-foreground">· {q.age} yrs</span>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {q.reason} · {q.type}
                </p>
              </div>
              <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap', statusTone[q.status])}>
                {q.status}
              </span>
              {q.status === 'Waiting' && q.type !== 'Chat' && (
                <Button
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/doctor/consultation" />}
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