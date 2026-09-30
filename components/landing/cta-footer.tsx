import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'

const columns = [
  {
    h: 'Platform',
    l: [
      { label: 'Services', href: '/#services' },
      { label: 'Secure video', href: '/#video' },
      { label: 'How it works', href: '/#process' },
      { label: 'Billing', href: '/#pricing' },
    ],
  },
  {
    h: 'Account',
    l: [
      { label: 'Patient portal', href: '/dashboard' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
]

export function CtaFooter() {
  return (
    <>
      <section className="px-3 py-3 sm:px-6">
        <Reveal className="relative mx-auto flex min-h-[420px] max-w-7xl items-end overflow-hidden rounded-[2rem] bg-card">
          <Image src="/images/cells.png" alt="" fill sizes="100vw" className="object-cover" />
          <div className="relative m-4 flex w-full flex-col gap-6 rounded-3xl bg-card/75 p-6 backdrop-blur-xl sm:m-8 sm:flex-row sm:items-end sm:justify-between sm:p-10">
            <h2 className="max-w-lg text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl">
              Health is the most important thing. Don&apos;t put it off for later.
            </h2>
            <Button
              nativeButton={false}
              render={<Link href="/dashboard" />}
              className="h-12 shrink-0 rounded-full px-6"
            >
              Open patient portal
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </div>
        </Reveal>
      </section>

      <footer className="px-3 pb-3 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-foreground px-6 py-10 text-background sm:px-12">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr]">
            <div>
              <Logo className="text-background [&>span:first-child]:border-background/80" />
              <p className="mt-4 max-w-xs text-sm text-background/60">
                Virtual consultations, prescriptions, secure video and billing for patients and doctors.
              </p>
            </div>
            {columns.map((c) => (
              <nav key={c.h} aria-label={c.h}>
                <p className="text-xs tracking-[0.2em] text-background/50 uppercase">{c.h}</p>
                <ul className="mt-4 flex flex-col gap-2 text-sm">
                  {c.l.map((x) => (
                    <li key={x.label}>
                      <Link href={x.href} className="text-background/80 transition-colors hover:text-background">
                        {x.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <p className="mt-8 border-t border-background/10 pt-5 text-xs text-background/50">
            © 2026 Gunjan Sahu · CareConnect360 · Not for emergencies. Call your local emergency number.
          </p>
        </div>
      </footer>
    </>
  )
}