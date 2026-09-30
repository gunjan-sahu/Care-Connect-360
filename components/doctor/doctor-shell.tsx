'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CalendarDays, Clock, LayoutGrid, LogOut, Users, Video, Wallet } from 'lucide-react'
import { doctorProfile } from '@/lib/doctor-data'
import { clearSession, getSession } from '@/lib/session'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/doctor', label: 'Overview', icon: LayoutGrid },
  { href: '/doctor/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/doctor/patients', label: 'Patients', icon: Users },
  { href: '/doctor/consultation', label: 'Consultation', icon: Video },
  { href: '/doctor/availability', label: 'Availability', icon: Clock },
  { href: '/doctor/earnings', label: 'Earnings', icon: Wallet },
]

function isActive(pathname: string, href: string) {
  return href === '/doctor' ? pathname === href : pathname.startsWith(href)
}

export function DoctorShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const current = nav.find((n) => isActive(pathname, n.href))

  useEffect(() => {
    const s = getSession()
    if (!s) router.replace('/login')
    else if ((s.role ?? 'Patient') !== 'Doctor') router.replace('/dashboard')
    else setReady(true)
  }, [router])

  function signOut() {
    clearSession()
    router.replace('/login')
  }

  if (!ready) return null

  return (
    <div className="flex min-h-svh">
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col bg-foreground p-4 text-background lg:flex">
        <Link href="/doctor" className="flex items-center gap-2 px-2 py-2 text-sm font-semibold tracking-wide">
          <span className="flex size-7 items-center justify-center rounded-md bg-brand text-xs text-primary-foreground">
            +
          </span>
          CareConnect<span className="text-brand">Pro</span>
        </Link>

        <p className="mt-8 px-2 text-[10px] tracking-[0.2em] text-background/40 uppercase">Workspace</p>
        <nav aria-label="Doctor" className="mt-2 flex-1">
          <ul className="flex flex-col gap-0.5">
            {nav.map((item) => {
              const Icon = item.icon
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex h-10 items-center gap-3 rounded-md border-l-2 px-3 text-sm transition-colors',
                      active
                        ? 'border-brand bg-background/10 text-background'
                        : 'border-transparent text-background/60 hover:bg-background/5 hover:text-background',
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3 rounded-md bg-background/5 p-2.5">
          <span className="flex size-9 items-center justify-center rounded-md bg-brand text-xs font-medium text-primary-foreground">
            {doctorProfile.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{doctorProfile.name}</p>
            <p className="truncate text-xs text-background/50">{doctorProfile.specialty}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            className="rounded p-1.5 text-background/60 hover:text-background"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            <div className="min-w-0">
              <h1 className="truncate text-base font-medium lg:sr-only">{current?.label ?? 'Overview'}</h1>
              <p className="hidden text-sm text-muted-foreground lg:block">Doctor workspace</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 rounded-md bg-brand-soft px-2.5 py-1 text-xs font-medium text-accent-foreground">
                <span className="size-1.5 rounded-full bg-brand" />
                Available
              </span>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs hover:bg-muted lg:hidden"
              >
                <LogOut className="size-3.5" aria-hidden="true" />
                Sign out
              </button>
            </div>
          </div>
          <nav aria-label="Doctor mobile" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm whitespace-nowrap',
                  isActive(pathname, item.href) ? 'bg-foreground text-background' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}