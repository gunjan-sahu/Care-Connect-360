'use client'

import { useState } from 'react'
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
import type { Invoice } from '@/lib/data'
import { usePersisted } from '@/lib/persist'

const usd = (n: number) => `₹${n.toFixed(2)}`

export function BillingView({ invoices }: { invoices: Invoice[] }) {
  const [items, setItems] = usePersisted('cc360-invoices', invoices)
  const [paying, setPaying] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(false)

  const dueItems = items.filter((item) => item.status === 'Due')
  const due = dueItems.reduce((sum, item) => sum + item.amount - item.covered, 0)
  const covered = items.reduce((sum, item) => sum + item.covered, 0)
  const total = items.reduce((sum, item) => sum + item.amount, 0)

  function pay(e: React.FormEvent) {
    e.preventDefault()
    if (!paying) return
    setLoading(true)
    setTimeout(() => {
      setItems((prev) => prev.map((i) => (i.id === paying.id ? { ...i, status: 'Paid' } : i)))
      toast.success(`${paying.id} paid`, { description: `${usd(paying.amount - paying.covered)} charged to card XXXX XXXX 42422` })
      setLoading(false)
      setPaying(null)
    }, 1200)
  }

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <section className="rounded-[1.75rem] bg-foreground p-6 text-background">
        <p className="text-sm text-background/60">Balance due</p>
        <p className="mt-2 text-5xl font-medium tracking-tight">{usd(due)}</p>
        <Button
          disabled={due === 0}
          onClick={() => setPaying(items.find((i) => i.status === 'Due') ?? null)}
          className="mt-6 h-11 w-full rounded-full bg-brand text-primary-foreground hover:bg-brand/90"
        >
          {due === 0 ? 'All settled' : 'Pay balance'}
        </Button>
      </section>

      <section className="rounded-[1.75rem] bg-card p-6">
        <p className="text-sm text-muted-foreground">Insurance coverage</p>
        <p className="mt-2 text-4xl font-medium tracking-tight">{Math.round((covered / total) * 100)}%</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-brand transition-[width] duration-1000" style={{ width: `${(covered / total) * 100}%` }} />
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-success" aria-hidden="true" />
          BlueShield PPO · verified
        </p>
      </section>

      <section className="rounded-[1.75rem] bg-card p-6">
        <p className="text-sm text-muted-foreground">Payment method</p>
        <div className="mt-3 flex aspect-[1.7] flex-col justify-between rounded-2xl bg-gradient-to-br from-brand to-accent-foreground p-4 text-primary-foreground">
          <CreditCard className="size-5" aria-hidden="true" />
          <div>
            <p className="font-mono tracking-widest">XXXX XXXX 4242</p>
            <p className="text-xs opacity-80"> Gunjan Sahu · 08/29</p>
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
                  <td className="py-3.5 font-mono text-xs">{i.id}</td>
                  <td className="py-3.5">{i.service}</td>
                  <td className="py-3.5 text-muted-foreground">{i.date}</td>
                  <td className="py-3.5 text-right text-muted-foreground">{usd(i.amount)}</td>
                  <td className="py-3.5 text-right font-medium">{usd(i.amount - i.covered)}</td>
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
                        aria-label={`Download ${i.id}`}
                        onClick={() => toast(`${i.id}.pdf downloaded`)}
                      >
                        <Download />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={paying !== null} onOpenChange={(o) => !o && !loading && setPaying(null)}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <form onSubmit={pay} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>Pay {paying?.id}</DialogTitle>
              <DialogDescription>{paying?.service}</DialogDescription>
            </DialogHeader>
            {paying && (
              <dl className="flex flex-col gap-2 rounded-2xl bg-muted p-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Visit total</dt>
                  <dd>{usd(paying.amount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Insurance</dt>
                  <dd className="text-success">-{usd(paying.covered)}</dd>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium">
                  <dt>Amount due</dt>
                  <dd>{usd(paying.amount - paying.covered)}</dd>
                </div>
              </dl>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="card">Card</Label>
              <Input id="card" defaultValue="XXXX XXXX XXXX 42422" readOnly className="h-11 rounded-xl font-mono" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading} className="h-11 w-full rounded-full">
                {loading ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-background/30 border-t-background" aria-hidden="true" />
                ) : null}
                {loading ? 'Processing…' : `Pay ${paying ? usd(paying.amount - paying.covered) : ''}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
