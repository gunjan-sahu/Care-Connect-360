'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { findAccount, saveAccount, saveSession } from '@/lib/session'
import { cn } from '@/lib/utils'

const modes = ['Sign in', 'Create account'] as const
const roles = ['Patient', 'Doctor'] as const

export function AuthForm() {
  const [mode, setMode] = useState<(typeof modes)[number]>('Sign in')
  const [role, setRole] = useState<(typeof roles)[number]>('Patient')
  const [loading, setLoading] = useState(false)
  const isSignup = mode === 'Create account'

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = String(data.get('email') ?? '').trim().toLowerCase()
    const typedName = String(data.get('name') ?? '').trim()

    setLoading(true)

    let name = typedName || email.split('@')[0]
    if (isSignup) {
      saveAccount({ name, email, role })
    } else {
      const found = findAccount(email)
      if (found) name = found.name
    }
    saveSession({ name, email, role }, true)

    setTimeout(() => {
      toast.success(isSignup ? 'Account created' : 'Welcome back')
      window.location.assign(role === 'Doctor' ? '/doctor' : '/dashboard')
    }, 600)
  }

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Account" className="flex rounded-full bg-muted p-1 text-sm">
        {modes.map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              'flex-1 rounded-full py-2 transition-all duration-300',
              mode === m ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div>
        <h1 className="text-2xl font-medium tracking-tight">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {role === 'Doctor'
            ? 'Sign in to open your doctor workspace.'
            : isSignup
              ? 'Start your first virtual consultation in minutes.'
              : 'Sign in to open your patient portal.'}
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">I am a</legend>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              onClick={() => setRole(r)}
              className={cn(
                'rounded-xl border py-2.5 text-sm transition-all',
                role === r ? 'border-foreground bg-foreground text-background' : 'hover:border-foreground/40',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </fieldset>

      <form onSubmit={submit} className="flex flex-col gap-4">
        {isSignup && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" autoComplete="name" required className="h-11 rounded-xl" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required className="h-11 rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            minLength={8}
            required
            className="h-11 rounded-xl"
          />
          {isSignup && <p className="text-xs text-muted-foreground">At least 8 characters.</p>}
        </div>
        <Button type="submit" disabled={loading} className="mt-2 h-12 w-full rounded-full">
          {loading ? 'Please wait…' : mode}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Demo only: no real security. Accounts are stored in your browser.
      </p>
    </div>
  )
}