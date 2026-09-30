import { ClipboardList, Video, FileText, Receipt } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const steps = [
  { n: '01', icon: ClipboardList, title: 'Tell us how you feel', body: 'A short, guided intake routes you to the right specialist.' },
  { n: '02', icon: Video, title: 'Meet your doctor', body: 'Join an encrypted video call from any browser or phone.' },
  { n: '03', icon: FileText, title: 'Get your plan', body: 'Receive notes, e-prescriptions and follow-ups instantly.' },
  { n: '04', icon: Receipt, title: 'Pay with clarity', body: 'Insurance applied automatically. One itemised invoice.' },
]

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 px-3 sm:px-6">
      <div className="mx-auto max-w-7xl px-3 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">How it works</p>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-balance sm:text-5xl">
            From first symptom to recovery, in <span className="text-brand">four calm steps.</span>
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal
                as="li"
                key={s.n}
                delay={i * 100}
                className="group relative flex min-h-64 flex-col justify-between overflow-hidden rounded-3xl bg-card p-6 transition-transform duration-500 hover:-translate-y-1.5"
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-10 -bottom-10 size-40 rounded-full bg-brand-soft opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                />
                <span className="relative font-mono text-sm text-muted-foreground">{s.n}</span>
                <span className="relative flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div className="relative">
                  <h3 className="text-xl font-medium tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}