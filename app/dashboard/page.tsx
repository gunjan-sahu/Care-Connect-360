import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/dashboard/status-pill'
import { Sparkline } from '@/components/dashboard/sparkline'
import { BalanceCard, MedicationsCard } from '@/components/dashboard/overview-live'
import { appointments, vitals } from '@/lib/data'

export default function OverviewPage() {
  const next = appointments[0]
  const upcoming = appointments.filter((a) => a.status === 'Upcoming')

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
          <p className="text-xs tracking-[0.2em] text-background/60 uppercase">Next consultation</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">Good afternoon, Gunjan.</h2>
          <p className="mt-3 text-background/70">
            {next.doctor} · {next.specialty} · Today at {next.time}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/consultation" />}
              className="h-11 rounded-full bg-brand px-5 text-primary-foreground hover:bg-brand/90"
            >
              <Video data-icon="inline-start" />
              Join waiting room
            </Button>
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

      <BalanceCard />

      {vitals.map((v, i) => (
        <section
          key={v.label}
          className="animate-in rounded-[1.75rem] bg-card p-6 fade-in-0 slide-in-from-bottom-4 fill-mode-both duration-700"
          style={{ animationDelay: `${150 + i * 100}ms` }}
        >
          <p className="text-sm text-muted-foreground">{v.label}</p>
          <p className="mt-2 text-3xl font-medium tracking-tight">
            {v.value} <span className="text-sm font-normal text-muted-foreground">{v.unit}</span>
          </p>
          <Sparkline data={v.trend} className="mt-4 h-12 w-full" />
        </section>
      ))}

      <section className="rounded-[1.75rem] bg-card p-6 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Upcoming</h2>
          <Link href="/dashboard/appointments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            All <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <ul className="mt-4 divide-y">
          {upcoming.map((a) => (
            <li key={a.id} className="flex items-center gap-4 py-3.5">
              <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-muted py-1.5">
                <span className="text-[10px] text-muted-foreground uppercase">{a.date.split(' ')[0]}</span>
                <span className="text-lg leading-none font-medium">{a.date.split(' ')[1]}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{a.doctor}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {a.specialty} · {a.time} · {a.type}
                </p>
              </div>
              <StatusPill status={a.status} />
            </li>
          ))}
        </ul>
      </section>

      <MedicationsCard />
    </div>
  )
}