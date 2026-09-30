'use client'

import { usePersisted } from '@/lib/persist'

export type Membership = { active: boolean; plan: 'monthly' | 'yearly'; since: string }

export function useMembership() {
  return usePersisted<Membership>('cc360-careplus', { active: false, plan: 'monthly', since: '' })
}