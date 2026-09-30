import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Stethoscope } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'

export function CtaFooter() {
  return (
    <>
      <section className="px-3 py-3 sm:px-6">
        <Reveal className="relative mx-auto flex min-h-[460px] max-w-7xl items-end overflow-hidden rounded-[2rem] bg-card">
          <Image
            src="/images/cells.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="relative m-4 flex w-full flex-col gap-6 rounded-3xl bg-card/75 p-6 backdrop-blur-xl sm:m-8 sm:flex-row sm:items-end sm:justify-between sm:p-10">
            <h2 className="max-w-lg text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl">
              Health is the most important thing. Don&apos;t put it off for later.
            </h2>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/login" />}
                className="h-12 rounded-full bg-transparent px-6"
              >
                <Stethoscope data-icon="inline-start" />
                Open doctor portal
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/login" />}
                className="h-12 rounded-full px-6"
              >
                Open patient portal
                <ArrowUpRight data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="px-3 pb-3 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] bg-foreground px-6 py-12 text-background sm:px-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo className="text-background" />
            <p className="mt-4 max-w-xs text-sm text-background/60">
              Virtual consultations, prescriptions, secure video and billing — built for patients and clinicians.
            </p>
          </div>
                    {[
            {
              h: 'Platform',
              l: [
                { t: 'Consultations', href: '/#services' },
                { t: 'Prescriptions', href: '/#services' },
                { t: 'Secure video', href: '/#video' },
                { t: 'Billing', href: '/#pricing' },
              ],
            },
            {
              h: 'Company',
              l: [
                { t: 'How it works', href: '/#process' },
                { t: 'Privacy', href: '/privacy' },
                { t: 'Contact', href: '/contact' },
              ],
            },
          ].map((c) => (
            <nav key={c.h} aria-label={c.h}>
              <p className="text-xs tracking-[0.2em] text-background/50 uppercase">{c.h}</p>
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                {c.l.map((x) => (
                  <li key={x.t}>
                    <Link href={x.href} className="text-background/80 transition-colors hover:text-background">
                      {x.t}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <p className="border-t border-background/10 pt-6 text-xs text-background/50 md:col-span-4">
            {'© 2026 CareConnect360. Not for emergencies — call your local emergency number.'}
          </p>
        </div>
      </footer>
    </>
  )
}