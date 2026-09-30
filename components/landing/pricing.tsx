'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { BookingDialog } from '@/components/booking-dialog'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Pay per visit',
    monthly: 0,
    yearly: 0,
    visit: '₹80 / visit',
    features: ['Video or chat consults', 'E-prescriptions', 'Itemised invoices'],
  },
  {
    name: 'Care+',
    monthly: 19,
    yearly: 15,
    visit: '₹25 / visit',
    featured: true,
    features: ['Everything in Pay per visit', 'Priority same-day slots', 'Unlimited chat follow-ups', 'Family profiles (up to 4)'],
  },
  {
    name: 'Clinics',
    monthly: 149,
    yearly: 119,
    visit: 'per provider',
    features: ['Provider scheduling', 'Billing & claims tools', 'EHR integrations', 'Dedicated support'],
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(true)

  return (
    <section id="pricing" className="scroll-mt-24 px-3 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-card px-6 py-16 sm:px-12 sm:py-24 md:px-16">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Billing</p>
            <h2 className="mt-4 max-w-lg text-3xl leading-tight font-medium tracking-tight text-balance sm:text-5xl">
              Honest pricing. <span className="text-brand">No surprises.</span>
            </h2>
          </div>
          <div role="radiogroup" aria-label="Billing period" className="relative flex rounded-full bg-muted p-1 text-sm">
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-card shadow-sm transition-transform duration-500 ease-out',
                yearly ? 'translate-x-full' : 'translate-x-0',
              )}
            />
            {[false, true].map((y) => (
              <button
                key={String(y)}
                role="radio"
                aria-checked={yearly === y}
                onClick={() => setYearly(y)}
                className="relative z-10 w-24 rounded-full py-1.5"
              >
                {y ? 'Yearly' : 'Monthly'}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 grid gap-3 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal
              key={p.name}
              delay={i * 100}
              className={cn(
                'flex flex-col rounded-3xl border p-7 transition-all duration-500 hover:-translate-y-1',
                p.featured && 'border-foreground bg-foreground text-background',
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{p.name}</h3>
                {p.featured && (
                  <span className="rounded-full bg-brand px-2.5 py-1 text-xs text-primary-foreground">Most popular</span>
                )}
              </div>
              <p className="mt-6 flex items-baseline gap-1">
                <span key={String(yearly)} className="animate-in text-5xl font-medium tracking-tight fade-in-0 slide-in-from-bottom-2 duration-500">
                  ₹{yearly ? p.yearly : p.monthly}
                </span>
                <span className={cn('text-sm', p.featured ? 'text-background/60' : 'text-muted-foreground')}>/ mo</span>
              </p>
              <p className={cn('mt-1 text-sm', p.featured ? 'text-background/60' : 'text-muted-foreground')}>{p.visit}</p>
              <ul className="mt-8 flex flex-1 flex-col gap-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className={cn('size-4', p.featured ? 'text-brand-soft' : 'text-brand')} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <BookingDialog
                trigger={
                  <Button
                    variant={p.featured ? 'secondary' : 'outline'}
                    className="mt-8 h-11 rounded-full bg-transparent"
                  >
                    Get started
                  </Button>
                }
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}