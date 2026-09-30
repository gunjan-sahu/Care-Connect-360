'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { invoices, prescriptions } from '@/lib/data'
import { usePersisted } from '@/lib/persist'

export function BalanceCard() {
  const [items] = usePersisted('cc360-invoices', invoices)
  const pending = items.filter((i) => i.status === 'Due')
  const due = pending.reduce((s, i) => s + i.amount - i.covered, 0)

  return (
    <section className="flex flex-col justify-between rounded-[1.75rem] bg-card p-6">
      <p className="text-sm text-muted-foreground">Balance due</p>
      <p className="mt-2 text-5xl font-medium tracking-tight">₹{due.toFixed(2)}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {due === 0 ? 'All invoices paid' : `After insurance · ${pending.length} invoice${pending.length === 1 ? '' : 's'}`}
      </p>
      <Button nativeButton={false} render={<Link href="/dashboard/billing" />} className="mt-6 h-11 rounded-full">
        {due === 0 ? 'View billing' : 'Pay now'}
      </Button>
    </section>
  )
}

export function MedicationsCard() {
  const [items] = usePersisted('cc360-prescriptions', prescriptions)

  return (
    <section className="rounded-[1.75rem] bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Medications</h2>
        <Link href="/dashboard/prescriptions" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          All <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
      <ul className="mt-4 flex flex-col gap-4">
        {items
          .filter((p) => p.status !== 'Expired')
          .map((p) => (
            <li key={p.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {p.name} <span className="font-normal text-muted-foreground">{p.dosage}</span>
                </span>
                <span className="font-mono text-xs text-muted-foreground">{p.supplyDays}d</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={p.status === 'Refill due' ? 'h-full rounded-full bg-brand' : 'h-full rounded-full bg-foreground'}
                  style={{ width: `${(p.supplyDays / p.supplyTotal) * 100}%` }}
                />
              </div>
            </li>
          ))}
      </ul>
    </section>
  )
}