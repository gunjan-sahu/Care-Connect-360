import Image from 'next/image'
import { Lock, Mic, PhoneOff, Video, Heart } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function VideoShowcase() {
  return (
    <section id="video" className="scroll-mt-24 px-3 py-3 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-3 lg:grid-cols-5">
        <Reveal className="flex flex-col justify-between gap-10 rounded-[2rem] bg-card p-8 sm:p-12 lg:col-span-2">
          <div>
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Secure video</p>
            <h2 className="mt-4 text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl">
              A clinic visit, without the <span className="text-brand">waiting room.</span>
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Every call is end-to-end encrypted and never recorded without consent. Your doctor sees your chart, vitals and history side by side.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-4 border-t pt-6">
            {[
              ['256-bit', 'Encryption'],
              ['< 2 min', 'Avg. wait'],
              ['99.98%', 'Uptime'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-xs text-muted-foreground">{l}</dt>
                <dd className="mt-1 text-xl font-medium tracking-tight sm:text-2xl">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={120} className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-card lg:col-span-3">
          <Image
  src="/images/video-consultation.png.png"
  alt="Online doctor consultation"
  fill
  sizes="(min-width: 1024px) 60vw, 100vw"
  className="object-cover transition-transform duration-[2s] hover:scale-105"
/>
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-card/80 px-3 py-1.5 text-xs backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success" />
              <span className="relative size-2 rounded-full bg-success" />
            </span>
            Live · 12:48
            <Lock className="size-3 text-muted-foreground" aria-hidden="true" />
          </div>

          <div className="absolute top-3 right-3 animate-float rounded-xl bg-card/85 px-3 py-2 backdrop-blur-md">
  <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
    <Heart className="size-3 text-brand" aria-hidden="true" />
    Heart rate
  </p>

  <p className="mt-0.5 text-xl font-medium tracking-tight">
    72 <span className="text-[10px] font-normal text-muted-foreground">bpm</span>
  </p>
</div>

          
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-card/85 p-1.5 backdrop-blur-md" aria-hidden="true">
            <span className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Mic className="size-4" />
            </span>
            <span className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Video className="size-4" />
            </span>
            <span className="flex size-10 items-center justify-center rounded-full bg-destructive text-primary-foreground">
              <PhoneOff className="size-4" />
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
