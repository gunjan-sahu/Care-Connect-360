import Image from 'next/image'
import { ArrowDown, ShieldCheck, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingDialog } from '@/components/booking-dialog'

export function Hero() {
  return (
    <section className="px-3 pt-3 sm:px-6">
      <div className="relative mx-auto min-h-[92svh] max-w-7xl overflow-hidden rounded-[2rem] bg-card">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-3/5"
        >
          <Image
            src="/images/hero-helix.png"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className="animate-float object-contain object-right opacity-40 mix-blend-multiply md:opacity-100"
          />
        </div>

        <div className="relative flex min-h-[92svh] flex-col justify-between px-6 pt-28 pb-8 sm:px-12 md:px-16">
          <div className="max-w-xl">
            <p className="animate-in fade-in-0 slide-in-from-bottom-4 fill-mode-both text-xs font-medium tracking-[0.2em] uppercase duration-700">
              Virtual care platform
            </p>
            <h1 className="mt-6 animate-in fade-in-0 slide-in-from-bottom-6 fill-mode-both text-5xl leading-[1.02] font-medium tracking-tight text-balance delay-100 duration-1000 sm:text-6xl lg:text-7xl">
              Your doctor, <span className="text-brand">one tap</span> away.
            </h1>
            <p className="mt-6 max-w-sm animate-in fade-in-0 slide-in-from-bottom-6 fill-mode-both leading-relaxed text-muted-foreground delay-200 duration-1000">
              Consult licensed physicians over secure video, manage prescriptions and settle bills, all in one calm, private space.
            </p>
            <div className="mt-10 flex animate-in flex-wrap items-center gap-3 fade-in-0 slide-in-from-bottom-6 fill-mode-both delay-300 duration-1000">
              <BookingDialog
                trigger={
                  <Button className="h-12 rounded-full px-6 text-sm tracking-wide uppercase">
                    Book a consultation
                  </Button>
                }
              />
              <Button
                variant="outline"
                nativeButton={false}
                render={<a href="#services" />}
                className="h-12 rounded-full bg-transparent px-6 text-sm tracking-wide uppercase"
              >
                Explore services
              </Button>
            </div>
          </div>

          <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="flex animate-in items-center gap-4 rounded-2xl bg-background/70 p-3 pr-5 backdrop-blur-md fade-in-0 fill-mode-both delay-500 duration-1000">
              <div className="flex -space-x-2" aria-hidden="true">
                {['AO', 'LW', 'PR'].map((i) => (
                  <span
                    key={i}
                    className="flex size-9 items-center justify-center rounded-full border-2 border-card bg-brand-soft text-xs font-medium text-accent-foreground"
                  >
                    {i}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <p className="flex items-center gap-1 font-medium">
                  <Star className="size-3.5 fill-brand text-brand" aria-hidden="true" />
                  {'4.9 · 12k+ reviews'}
                </p>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  HIPAA & GDPR compliant
                </p>
              </div>
            </div>
            <a
              href="#services"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs text-background transition-transform hover:scale-105"
            >
              <ArrowDown className="size-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              Scroll for more
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
