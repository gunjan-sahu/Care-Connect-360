'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api, type AuthResponse } from '@/lib/api'
import { saveAuth } from '@/lib/session'
import { cn } from '@/lib/utils'

const modes = ['Sign in', 'Create account'] as const
const roles = ['Patient', 'Doctor'] as const

export function AuthForm() {
  const [mode, setMode] = useState<(typeof modes)[number]>('Sign in')
  const [role, setRole] = useState<(typeof roles)[number]>('Patient')
  const [loading, setLoading] = useState(false)
  const [specialty, setSpecialty] = useState('General Practice')
  const isSignup = mode === 'Create account'

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = String(data.get('email') ?? '').trim().toLowerCase()
    const password = String(data.get('password') ?? '')
    const name = String(data.get('name') ?? '').trim()

    setLoading(true)
    try {
      const res = isSignup
        ? await api<AuthResponse>('/auth/register/', {
            method: 'POST',
            body: { name, email, password, role, specialty },
            auth: false,
          })
        : await api<AuthResponse>('/auth/login/', {
            method: 'POST',
            body: { email, password },
            auth: false,
          })
      saveAuth(res)
      toast.success(isSignup ? 'Account created' : 'Welcome back')
      window.location.assign(res.user.role === 'Doctor' ? '/doctor' : '/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not sign in.')
      setLoading(false)
    }
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
          {isSignup ? 'Start your first virtual consultation in minutes.' : 'Sign in to open your portal.'}
        </p>
      </div>

      {isSignup && (
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
      )}

      <form onSubmit={submit} className="flex flex-col gap-4">
        {isSignup && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" autoComplete="name" required className="h-11 rounded-xl" />
          </div>
        )}
        {isSignup && role === 'Doctor' && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="specialty">Specialty</Label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="h-11 rounded-xl border bg-transparent px-3 text-sm"
            >
              {specialtyOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
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

      {!isSignup && (
        <p className="text-center text-xs text-muted-foreground">
          Demo: patient@careconnect.test or doctor@careconnect.test, password Demo@12345
        </p>
      )}
    </div>
  )
}