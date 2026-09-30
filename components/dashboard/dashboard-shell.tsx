'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clearSession, getSession, type Session } from '@/lib/session'
import { usePersisted } from '@/lib/persist'
import { prescriptions } from '@/lib/data'
import {
  Bell,
  CalendarDays,
  ChevronsLeft,
  LayoutGrid,
  LogOut,
  Pill,
  Plus,
  Receipt,
  Search,
  Video,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { LogoMark } from '@/components/logo-mark'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BookingDialog } from '@/components/booking-dialog'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutGrid },
  { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/dashboard/consultation', label: 'Video room', icon: Video },
  { href: '/dashboard/prescriptions', label: 'Prescriptions', icon: Pill },
  { href: '/dashboard/billing', label: 'Billing', icon: Receipt },
]

const notifications = [
  { t: 'Dr. Iyer is ready in 15 min', d: 'Video consultation · 14:30', unread: true },
  { t: 'Atorvastatin refill due', d: '4 days of supply left', unread: true },
  { t: 'Invoice INV-2048 issued', d: '₹300.00 after insurance', unread: false },
]

function NavList({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const [rx] = usePersisted('cc360-prescriptions', prescriptions)
  const refillCount = rx.filter((p) => p.status === 'Refill due').length
  return (
    <ul className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(
                'group relative flex h-11 items-center gap-3 rounded-2xl px-3 text-sm transition-all duration-300',
                active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                collapsed && 'justify-center px-0',
              )}
            >
              <Icon className="size-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              <span className={cn('whitespace-nowrap transition-opacity duration-300', collapsed && 'sr-only')}>
                {item.label}
              </span>
              {item.label === 'Prescriptions' && !collapsed && refillCount > 0 && (
                <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-brand text-[10px] text-primary-foreground">
                  {refillCount}
                </span>
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<Session | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const current = nav.find((n) => (n.href === '/dashboard' ? pathname === n.href : pathname.startsWith(n.href)))

  useEffect(() => {
    const s = getSession()
    if (!s) router.replace('/login')
    else if (s.role === 'Doctor') router.replace('/doctor')
    else setUser(s)
  }, [router])

  const name = user?.name ?? 'Gunjan Sahu'
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  function signOut() {
    clearSession()
    router.push('/login')
  }

  if (pathname.startsWith('/dashboard/consultation')) {
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
          {collapsed ? <LogoMark /> : <Logo className="text-xs" />}
        </div>

        <BookingDialog
          trigger={
            <Button className={cn('mt-6 h-11 rounded-2xl bg-brand hover:bg-brand/90', collapsed && 'px-0')} aria-label="New consultation">
              <Plus data-icon={collapsed ? undefined : 'inline-start'} />
              {!collapsed && 'New consultation'}
            </Button>
          }
        />

        <nav aria-label="Dashboard" className="mt-6 flex-1">
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
              <Logo className="px-1 text-xs" />
              <nav aria-label="Dashboard mobile" className="flex-1">
                <NavList onNavigate={() => setMobileOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>

          <h1 className="min-w-0 truncate text-base font-medium tracking-tight sm:text-lg lg:sr-only">
            {current?.label ?? 'Overview'}
          </h1>

          <label className="relative hidden max-w-md flex-1 md:block">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search doctors, records…"
              className="h-10 w-full rounded-full bg-muted pr-4 pl-10 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
            />
          </label>

          <div className="ml-auto flex items-center gap-2">
            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className="relative flex size-10 items-center justify-center rounded-full border transition-colors hover:bg-muted"
                    aria-label="Notifications, 2 unread"
                  />
                }
              >
                <Bell className="size-4" />
                <span className="absolute top-2 right-2.5 size-2 rounded-full bg-brand ring-2 ring-card" />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 rounded-2xl p-2">
                <p className="px-3 pt-2 pb-1 text-sm font-medium">Notifications</p>
                <ul>
                  {notifications.map((n) => (
                    <li key={n.t} className="flex gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted">
                      <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', n.unread ? 'bg-brand' : 'bg-border')} />
                      <span>
                        <span className="block text-sm">{n.t}</span>
                        <span className="block text-xs text-muted-foreground">{n.d}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>

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
                  {initials}
                </span>
                <span className="hidden text-sm sm:block">{name}</span>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 rounded-2xl p-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">Patient · ID 40219</p>
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