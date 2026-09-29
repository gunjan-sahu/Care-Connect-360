import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-0 text-sm font-semibold tracking-[0.18em] uppercase', className)}
      aria-label="CareConnect360 home"
    >
      <Image
        src="/images/careconnect-logo.png"
        alt=""
        width={160}
        height={160}
        className="-mr-6 h-16 w-auto shrink-0 object-contain mix-blend-multiply"
      />
      <span>
        CareConnect<span className="text-brand">360</span>
      </span>
    </Link>
  )
}