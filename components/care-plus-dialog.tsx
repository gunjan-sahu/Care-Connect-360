'use client'

import { useState, type ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMembership } from '@/lib/membership'

const perks = ['Priority same-day slots', 'Unlimited chat follow-ups', 'Family profiles (up to 4)', '₹25 per visit']

export function CarePlusDialog({ trigger, yearly }: { trigger: ReactElement; yearly: boolean }) {
  const router = useRouter()
  const [, setMember] = useMembership()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const amount = yearly ? 15 * 12 : 19

  function pay(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setMember({ active: true, plan: yearly ? 'yearly' : 'monthly', since: new Date().toISOString() })
      setLoading(false)
      setOpen(false)
      toast.success('Welcome to Care+', { description: 'Your membership is now active.' })
      router.push('/dashboard/profile')
    }, 1200)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !loading && setOpen(o)}>
      <DialogTrigger render={trigger} />
      <DialogContent className="gap-5 rounded-3xl p-6 sm:max-w-md">
        <form onSubmit={pay} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium tracking-tight">Join Care+</DialogTitle>
            <DialogDescription>
              {yearly ? `₹${amount} billed yearly (₹15 / month)` : `₹${amount} billed monthly`}
            </DialogDescription>
          </DialogHeader>

          <ul className="flex flex-col gap-2">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-xl bg-muted px-4 py-2.5 text-sm">
                <Check className="size-4 text-brand" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cp-card">Card</Label>
            <Input id="cp-card" defaultValue="XXXX XXXX XXXX 4242" readOnly className="h-11 rounded-xl font-mono" />
          </div>

          <Button type="submit" disabled={loading} className="h-11 w-full rounded-full">
            {loading ? 'Processing…' : `Pay ₹${amount}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}