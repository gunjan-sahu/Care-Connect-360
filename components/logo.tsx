import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] uppercase', className)}
      aria-label="CareConnect360 home"
    >
      <span className="relative flex size-6 items-center justify-center rounded-full border border-foreground/80">
        <span className="size-2 rounded-full bg-brand transition-transform duration-500 group-hover:scale-150" />
      </span>
      <span>
        CareConnect<span className="text-brand">360</span>
      </span>
    </Link>
  )
}
