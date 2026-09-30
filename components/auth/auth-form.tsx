'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { findAccount, getSession, saveAccount, saveSession } from '@/lib/session'

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (getSession()) router.replace('/dashboard')
  }, [router])

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email')).trim().toLowerCase()
    const password = String(f.get('password'))
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    let name = 'Gunjan Sahu'
    if (mode === 'signup') {
      name = String(f.get('name') ?? '').trim() || name
      saveAccount({ name, email })
    } else {
      name = findAccount(email)?.name ?? name
    }
    saveSession({ name, email }, remember)
    toast.success(mode === 'signup' ? 'Account created' : 'Welcome back', { description: name })
    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] bg-card p-6 sm:p-10">
      <div role="tablist" aria-label="Account" className="flex rounded-full bg-muted p-1 text-sm">
        {(['login', 'signup'] as const).map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m)
              setError('')
            }}
            className={cn(
              'flex-1 rounded-full py-2 transition-all',
              mode === m ? 'bg-card shadow-sm' : 'text-muted-foreground',
            )}
          >
            {m === 'login' ? 'Sign in' : 'Create account'}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        {mode === 'signup' && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" required className="h-11 rounded-xl" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="h-11 rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required className="h-11 rounded-xl" />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-4 accent-[var(--brand)]"
          />
          Remember me
        </label>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="h-11 rounded-full">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </Button>
      </form>
    </div>
  )
}