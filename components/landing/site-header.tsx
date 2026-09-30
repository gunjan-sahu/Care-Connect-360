'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { BookingDialog } from '@/components/booking-dialog'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const links = [
  { href: '#services', label: 'Services' },
  { href: '#video', label: 'Secure video' },
  { href: '#process', label: 'How it works' },
  { href: '#pricing', label: 'Billing' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-30 px-3 pt-3 sm:px-6 lg:left-[var(--sidebar-space)] lg:transition-[left] lg:duration-500 lg:ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between rounded-full bg-card px-4 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.15)] sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-muted sm:inline-flex"
          >
            Sign in
          </Link>
          <BookingDialog
            trigger={
              <Button className="hidden h-9 rounded-full px-4 sm:inline-flex">Book a consultation</Button>
            }
          />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full px-2 py-1.5 text-sm lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <span className="flex w-5 flex-col gap-1" aria-hidden="true">
                <span className="h-px w-full bg-foreground" />
                <span className="h-px w-3/4 bg-foreground" />
              </span>
              Menu
            </SheetTrigger>
            <SheetContent side="top" className="rounded-b-3xl px-6 pt-6 pb-8">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Logo />
              <nav aria-label="Mobile" className="mt-6">
                <ul className="flex flex-col">
                  {links.map((l, i) => (
                    <li
                      key={l.href}
                      className="animate-in fade-in-0 slide-in-from-top-2 fill-mode-both duration-500"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <a
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between border-b py-4 text-2xl font-medium tracking-tight"
                      >
                        {l.label}
                        <ArrowUpRight className="size-5 text-muted-foreground" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <Button
                nativeButton={false}
                render={<Link href="/login" />}
                className="mt-4 h-12 w-full rounded-full text-base"
              >
                Sign in
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}