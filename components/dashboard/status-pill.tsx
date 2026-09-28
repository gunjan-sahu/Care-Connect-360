import { cn } from '@/lib/utils'

const tones: Record<string, string> = {
  Upcoming: 'bg-brand-soft text-accent-foreground',
  Active: 'bg-success/15 text-success',
  Paid: 'bg-success/15 text-success',
  Completed: 'bg-muted text-muted-foreground',
  Processing: 'bg-muted text-muted-foreground',
  'Refill due': 'bg-brand text-primary-foreground',
  Due: 'bg-foreground text-background',
  Cancelled: 'bg-destructive/10 text-destructive',
  Expired: 'bg-destructive/10 text-destructive',
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap', tones[status])}>
      {status}
    </span>
  )
}
