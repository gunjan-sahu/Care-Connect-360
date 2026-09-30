'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { CalendarCheck, ChevronsLeft, ListChecks, Plus, Receipt, Video } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { BookingDialog } from '@/components/booking-dialog'
import { cn } from '@/lib/utils'

const links = [
  { href: '#services', label: 'Services', icon: CalendarCheck },
  { href: '#video', label: 'Secure video', icon: Video },
  { href: '#process', label: 'How it works', icon: ListChecks },
  { href: '#pricing', label: 'Billing', icon: Receipt },
]

export function LandingShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <aside
        aria-label="Site sidebar"
        className={cn(
          'fixed top-3 left-3 z-40 hidden h-[calc(100svh-1.5rem)] flex-col rounded-[1.75rem] bg-card p-4 shadow-sm transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex',
          collapsed ? 'w-[76px]' : 'w-64',
        )}
      >
        <div className={cn('flex h-16 items-center', collapsed ? 'justify-center' : 'px-1')}>
          {collapsed ? (
            <Link
              href="/"
              aria-label="CareConnect360 home"
              className="flex size-6 items-center justify-center rounded-full border border-foreground/80"
            >
              <span className="size-2 rounded-full bg-brand" />
            </Link>
          ) : (
            <Logo className="text-xs" />
          )}
        </div>

        <BookingDialog
          trigger={
            <Button
              className={cn('mt-6 h-11 rounded-2xl bg-brand hover:bg-brand/90', collapsed && 'px-0')}
              aria-label="Book a consultation"
            >
              <Plus data-icon={collapsed ? undefined : 'inline-start'} />
              {!collapsed && 'Book a consultation'}
            </Button>
          }
        />

        <nav aria-label="Page sections" className="mt-6 flex-1">
          <ul className="flex flex-col gap-1">
            {links.map((l) => {
              const Icon = l.icon
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    title={collapsed ? l.label : undefined}
                    className={cn(
                      'group flex h-11 items-center gap-3 rounded-2xl px-3 text-sm text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground',
                      collapsed && 'justify-center px-0',
                    )}
                  >
                    <Icon
                      className="size-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110"
                      aria-hidden="true"
                    />
                    <span className={cn('whitespace-nowrap', collapsed && 'sr-only')}>{l.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          className="mt-3 flex h-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronsLeft className={cn('size-4 transition-transform duration-500', collapsed && 'rotate-180')} />
        </button>
      </aside>

      <div
        style={{ '--sidebar-space': collapsed ? '6.25rem' : '17.5rem' } as React.CSSProperties}
        className={cn(
          'transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          collapsed ? 'lg:pl-[6.25rem]' : 'lg:pl-[17.5rem]',
        )}
      >
        {children}
      </div>
    </>
  )
}