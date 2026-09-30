'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Crown } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { getSession, type Session } from '@/lib/session'
import { useMembership } from '@/lib/membership'
import { cn } from '@/lib/utils'

export function ProfileView() {
  const [user, setUser] = useState<Session | null>(null)
  const [member, setMember] = useMembership()

  useEffect(() => {
    setUser(getSession())
  }, [])

  const name = user?.name ?? 'Gunjan Sahu'
  const initials = name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <section className="flex flex-col items-center rounded-[1.75rem] bg-card p-8 text-center">
        <span
          className={cn(
            'flex size-24 items-center justify-center rounded-full bg-brand-soft text-2xl font-medium text-accent-foreground',
            member.active && 'ring-2 ring-amber-400/80 ring-offset-4 ring-offset-card',
          )}
        >
          {initials}
        </span>
        <h2 className="mt-5 text-xl font-medium">{name}</h2>
        <p className="text-sm text-muted-foreground">{user?.email ?? 'Patient · ID 40219'}</p>
        {member.active && (
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            <Crown className="size-3.5" aria-hidden="true" />
            Care+ member
          </span>
        )}
      </section>

      <section className="rounded-[1.75rem] bg-card p-6 lg:col-span-2">
        <h2 className="font-medium">Membership</h2>
        {member.active ? (
          <>
            <dl className="mt-4 divide-y rounded-2xl border text-sm">
              {[
                ['Status', 'Active'],
                ['Plan', member.plan === 'yearly' ? 'Care+ Yearly' : 'Care+ Monthly'],
                ['Member since', new Date(member.since).toLocaleDateString('en-IN', { dateStyle: 'medium' })],
                ['Visit price', '₹25'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <Button
              variant="outline"
              className="mt-5 rounded-full"
              onClick={() => {
                setMember({ active: false, plan: 'monthly', since: '' })
                toast('Care+ cancelled')
              }}
            >
              Cancel Care+
            </Button>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              You are on Pay per visit. Join Care+ for priority slots and ₹25 visits.
            </p>
            <Button nativeButton={false} render={<Link href="/#pricing" />} className="mt-5 h-11 rounded-full">
              View Care+ plans
            </Button>
          </>
        )}
      </section>
    </div>
  )
}