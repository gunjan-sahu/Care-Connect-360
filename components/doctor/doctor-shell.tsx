'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CalendarDays, ChevronsLeft, Clock, LayoutGrid, LogOut, Users, Video, Wallet } from 'lucide-react'
import { Logo } from '@/components/logo'
import { LogoMark } from '@/components/logo-mark'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { doctorProfile } from '@/lib/doctor-data'
import { clearSession, getSession } from '@/lib/session'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/doctor', label: 'Overview', icon: LayoutGrid },
  { href: '/doctor/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/doctor/patients', label: 'Patients', icon: Users },
  { href: '/doctor/consultation', label: 'Video room', icon: Video },
  { href: '/doctor/availability', label: 'Availability', icon: Clock },
  { href: '/doctor/earnings', label: 'Earnings', icon: Wallet },
]

function isActive(pathname: string, href: string) {
  return href === '/doctor' ? pathname === href : pathname.startsWith(href)
}

function NavList({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <ul className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = isActive(pathname, item.href)
        const Icon = item.icon
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(
                'group flex h-11 items-center gap-3 rounded-2xl px-3 text-sm transition-all duration-300',
                active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                collapsed && 'justify-center px-0',
              )}
            >
              <Icon className="size-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              <span className={cn('whitespace-nowrap', collapsed && 'sr-only')}>{item.label}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function DoctorShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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

  if (pathname.startsWith('/doctor/consultation')) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-svh gap-3 p-3">
      <aside
        className={cn(
          'sticky top-3 hidden h-[calc(100svh-1.5rem)] shrink-0 flex-col rounded-[1.75rem] bg-sidebar p-4 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex',
          collapsed ? 'w-[76px]' : 'w-64',
        )}
      >
        <div className={cn('flex h-16 items-center', collapsed ? 'justify-center' : 'px-1')}>
          {collapsed ? <LogoMark href="/doctor" /> : <Logo className="text-xs" href="/doctor" />}
        </div>

        <p className={cn('mt-4 px-3 text-[10px] tracking-[0.2em] text-muted-foreground uppercase', collapsed && 'sr-only')}>
          Doctor workspace
        </p>

        <nav aria-label="Doctor" className="mt-2 flex-1">
          <NavList collapsed={collapsed} />
        </nav>

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          className="flex h-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronsLeft className={cn('size-4 transition-transform duration-500', collapsed && 'rotate-180')} />
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <header className="sticky top-3 z-30 flex h-16 items-center gap-3 rounded-[1.5rem] bg-card/80 px-3 backdrop-blur-xl sm:px-5">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-full hover:bg-muted lg:hidden"
                  aria-label="Open navigation"
                />
              }
            >
              <span className="flex w-5 flex-col gap-1" aria-hidden="true">
                <span className="h-px w-full bg-foreground" />
                <span className="h-px w-3/4 bg-foreground" />
              </span>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col gap-6 p-4 pt-6">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Logo className="px-1 text-xs" href="/doctor" />
              <nav aria-label="Doctor mobile" className="flex-1">
                <NavList onNavigate={() => setMobileOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>

          <h1 className="min-w-0 truncate text-base font-medium tracking-tight sm:text-lg lg:sr-only">
            {current?.label ?? 'Overview'}
          </h1>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-medium text-accent-foreground sm:flex">
              <span className="size-1.5 rounded-full bg-success" />
              Available
            </span>

            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    aria-label="Account menu"
                    className="flex h-10 items-center gap-2 rounded-full border py-1 pr-1 pl-1 transition-colors hover:bg-muted sm:pr-3"
                  />
                }
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-brand-soft text-xs font-medium text-accent-foreground">
                  {doctorProfile.initials}
                </span>
                <span className="hidden text-sm sm:block">{doctorProfile.name}</span>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 rounded-2xl p-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{doctorProfile.name}</p>
                  <p className="text-xs text-muted-foreground">Doctor · {doctorProfile.specialty}</p>
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign out
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <main key={pathname} className="flex-1 animate-in fade-in-0 slide-in-from-bottom-3 duration-700">
          {children}
        </main>
      </div>
    </div>
  )
}