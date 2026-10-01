'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Download, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StatusPill } from '@/components/dashboard/status-pill'
import { api } from '@/lib/api'
import { inr, shortDate } from '@/lib/format'
import { getSession, type Session } from '@/lib/session'
import { notifyChanged, useApi } from '@/lib/use-api'
import type { Invoice, Paged, PatientProfile } from '@/lib/types'

export function BillingView() {
  const { data, loading, error } = useApi<Paged<Invoice>>('/invoices/')
  const me = useApi<Paged<PatientProfile>>('/patients/')
  const [user, setUser] = useState<Session | null>(null)
  const [paying, setPaying] = useState<Invoice | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => setUser(getSession()), [])

  const items = data?.results ?? []
  const dueItems = items.filter((i) => i.status === 'Due')
  const due = dueItems.reduce((s, i) => s + Number(i.amount_due), 0)
  const covered = items.reduce((s, i) => s + Number(i.covered), 0)
  const total = items.reduce((s, i) => s + Number(i.amount), 0)
  const pct = total > 0 ? Math.round((covered / total) * 100) : 0
  const insurer = me.data?.results[0]?.insurance_provider

  async function pay(e: React.FormEvent) {
    e.preventDefault()
    if (!paying) return
    setSaving(true)
    try {
      await api(`/invoices/${paying.id}/pay/`, { method: 'POST' })
      toast.success(`${paying.code} paid`, { description: `${inr(paying.amount_due)} charged to the demo card.` })
      notifyChanged()
      setPaying(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <section className="rounded-[1.75rem] bg-foreground p-6 text-background">
        <p className="text-sm text-background/60">Balance due</p>
        <p className="mt-2 text-4xl font-medium tracking-tight">{inr(due)}</p>
        <Button
          disabled={due === 0}
          onClick={() => setPaying(dueItems[0] ?? null)}
          className="mt-6 h-11 w-full rounded-full bg-brand text-primary-foreground hover:bg-brand/90"
        >
          {due === 0 ? 'All settled' : 'Pay balance'}
        </Button>
      </section>

      <section className="rounded-[1.75rem] bg-card p-6">
        <p className="text-sm text-muted-foreground">Insurance coverage</p>
        <p className="mt-2 text-4xl font-medium tracking-tight">{pct}%</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-brand transition-[width] duration-1000" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-success" aria-hidden="true" />
          {insurer ? `${insurer} · verified` : 'No insurance on file'}
        </p>
      </section>

      <section className="rounded-[1.75rem] bg-card p-6">
        <p className="text-sm text-muted-foreground">Payment method (demo)</p>
        <div className="mt-3 flex aspect-[1.7] flex-col justify-between rounded-2xl bg-gradient-to-br from-brand to-accent-foreground p-4 text-primary-foreground">
          <CreditCard className="size-5" aria-hidden="true" />
          <div>
            <p className="font-mono tracking-widest">XXXX XXXX 4242</p>
            <p className="text-xs opacity-80">{user?.name ?? ''} · 08/29</p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-card p-5 sm:p-6 lg:col-span-3">
        <h2 className="font-medium">Invoices</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="pb-3 font-normal">Invoice</th>
                <th className="pb-3 font-normal">Service</th>
                <th className="pb-3 font-normal">Date</th>
                <th className="pb-3 text-right font-normal">Total</th>
                <th className="pb-3 text-right font-normal">You owe</th>
                <th className="pb-3 pl-4 font-normal">Status</th>
                <th className="pb-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((i, idx) => (
                <tr
                  key={i.id}
                  className="animate-in transition-colors fade-in-0 fill-mode-both duration-500 hover:bg-muted/50"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <td className="py-3.5 font-mono text-xs">{i.code}</td>
                  <td className="py-3.5">{i.service}</td>
                  <td className="py-3.5 text-muted-foreground">{shortDate(i.date)}, {i.date.slice(0, 4)}</td>
                  <td className="py-3.5 text-right text-muted-foreground">{inr(i.amount)}</td>
                  <td className="py-3.5 text-right font-medium">{inr(i.amount_due)}</td>
                  <td className="py-3.5 pl-4">
                    <StatusPill status={i.status} />
                  </td>
                  <td className="py-3.5 text-right">
                    {i.status === 'Due' ? (
                      <Button size="sm" className="rounded-full" onClick={() => setPaying(i)}>
                        Pay
                      </Button>
                    ) : (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="rounded-full"
                        aria-label={`Download ${i.code}`}
                        onClick={() => toast(`${i.code}.pdf downloaded`)}
                      >
                        <Download />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>}
          {error && <p className="py-8 text-center text-sm text-destructive">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No invoices yet.</p>
          )}
        </div>
      </section>

      <Dialog open={paying !== null} onOpenChange={(o) => !o && !saving && setPaying(null)}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <form onSubmit={pay} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>Pay {paying?.code}</DialogTitle>
              <DialogDescription>{paying?.service}</DialogDescription>
            </DialogHeader>
            {paying && (
              <dl className="flex flex-col gap-2 rounded-2xl bg-muted p-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Visit total</dt>
                  <dd>{inr(paying.amount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Insurance</dt>
                  <dd className="text-success">-{inr(paying.covered)}</dd>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium">
                  <dt>Amount due</dt>
                  <dd>{inr(paying.amount_due)}</dd>
                </div>
              </dl>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="card">Card (demo)</Label>
              <Input id="card" defaultValue="XXXX XXXX XXXX 4242" readOnly className="h-11 rounded-xl font-mono" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving} className="h-11 w-full rounded-full">
                {saving ? 'Processing…' : `Pay ${paying ? inr(paying.amount_due) : ''}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}