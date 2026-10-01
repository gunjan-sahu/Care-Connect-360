'use client'

import { useState } from 'react'
import { MapPin, Pill, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StatusPill } from '@/components/dashboard/status-pill'
import { api } from '@/lib/api'
import { notifyChanged, useApi } from '@/lib/use-api'
import type { Paged, Prescription } from '@/lib/types'
import { cn } from '@/lib/utils'

const pharmacies = ['CityCare Pharmacy · 0.4 mi', 'Wellness Rx · 1.2 mi', 'Home delivery · 2 days']

export function PrescriptionsView() {
  const { data, loading, error } = useApi<Paged<Prescription>>('/prescriptions/')
  const items = data?.results ?? []
  const [refill, setRefill] = useState<Prescription | null>(null)
  const [pharmacy, setPharmacy] = useState(pharmacies[0])
  const [saving, setSaving] = useState(false)

  async function confirmRefill() {
    if (!refill) return
    setSaving(true)
    try {
      await api(`/prescriptions/${refill.id}/refill/`, { method: 'POST' })
      toast.success(`${refill.name} refill requested`, { description: `Sending to ${pharmacy.split(' · ')[0]}.` })
      notifyChanged()
      setRefill(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not request refill.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['Active', items.filter((p) => p.status !== 'Expired').length],
          ['Refills due', items.filter((p) => p.status === 'Refill due').length],
          ['Refills remaining', items.reduce((s, p) => s + p.refills_left, 0)],
        ].map(([l, v]) => (
          <div key={l} className="rounded-[1.75rem] bg-card p-6">
            <p className="text-sm text-muted-foreground">{l}</p>
            <p className="mt-2 text-4xl font-medium tracking-tight">{v}</p>
          </div>
        ))}
      </div>

      {loading && <p className="mt-3 rounded-[1.75rem] bg-card p-10 text-center text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="mt-3 rounded-[1.75rem] bg-card p-10 text-center text-sm text-destructive">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="mt-3 rounded-[1.75rem] bg-card p-10 text-center text-sm text-muted-foreground">
          No prescriptions yet. Your doctor will add them after a consultation.
        </p>
      )}

      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {items.map((p, i) => {
          const pct = p.supply_total ? (p.supply_days / p.supply_total) * 100 : 0
          return (
            <li
              key={p.id}
              className={cn(
                'group flex animate-in flex-col rounded-[1.75rem] bg-card p-6 fade-in-0 slide-in-from-bottom-3 fill-mode-both duration-700 transition-transform hover:-translate-y-1',
                p.status === 'Expired' && 'opacity-60',
              )}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-transform duration-500 group-hover:rotate-12">
                    <Pill className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-medium">
                      {p.name} <span className="font-normal text-muted-foreground">{p.dosage}</span>
                    </h2>
                    <p className="text-xs text-muted-foreground">{p.frequency}</p>
                  </div>
                </div>
                <StatusPill status={p.status} />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Supply</span>
                  <span className="font-mono">
                    {p.supply_days}/{p.supply_total} days
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full transition-[width] duration-1000', p.status === 'Refill due' ? 'bg-brand' : 'bg-foreground')}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  {p.doctor_name} · {p.refills_left} refills left
                </p>
                <Button
                  size="sm"
                  variant={p.status === 'Refill due' ? 'default' : 'outline'}
                  onClick={() =>
                    p.refills_left === 0
                      ? toast.success('Request sent', { description: `${p.doctor_name} will review a renewal for ${p.name}.` })
                      : setRefill(p)
                  }
                  className={cn('rounded-full', p.status === 'Refill due' && 'bg-brand hover:bg-brand/90')}
                >
                  <RefreshCw data-icon="inline-start" />
                  {p.refills_left === 0 ? 'Ask doctor' : 'Refill'}
                </Button>
              </div>
            </li>
          )
        })}
      </ul>

      <Dialog open={refill !== null} onOpenChange={(o) => !o && setRefill(null)}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Refill {refill?.name}</DialogTitle>
            <DialogDescription>
              {refill?.dosage} · {refill?.frequency}. Choose where to pick it up.
            </DialogDescription>
          </DialogHeader>
          <fieldset className="flex flex-col gap-2">
            <legend className="sr-only">Pharmacy</legend>
            {pharmacies.map((ph) => (
              <label
                key={ph}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-sm transition-all',
                  pharmacy === ph ? 'border-brand bg-brand-soft/50' : 'hover:bg-muted',
                )}
              >
                <input
                  type="radio"
                  name="pharmacy"
                  value={ph}
                  checked={pharmacy === ph}
                  onChange={() => setPharmacy(ph)}
                  className="accent-[var(--brand)]"
                />
                <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
                {ph}
              </label>
            ))}
          </fieldset>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" className="rounded-full" />}>Cancel</DialogClose>
            <Button className="rounded-full bg-brand hover:bg-brand/90" disabled={saving} onClick={confirmRefill}>
              {saving ? 'Requesting…' : 'Request refill'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}