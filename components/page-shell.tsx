import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/logo'

export function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-svh p-3 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-card p-6 sm:p-12">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Home
          </Link>
        </div>
        <h1 className="mt-10 text-3xl font-medium tracking-tight sm:text-4xl">{title}</h1>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}