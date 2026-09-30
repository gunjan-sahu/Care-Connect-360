import Link from 'next/link'
import { HeartPulse } from 'lucide-react'

export function LogoMark({ href = '/' }: { href?: string }) {
  return (
    <Link
      href={href}
      aria-label="CareConnect home"
      className="flex size-10 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-transform duration-300 hover:scale-105"
    >
      <HeartPulse className="size-5" aria-hidden="true" />
    </Link>
  )
}