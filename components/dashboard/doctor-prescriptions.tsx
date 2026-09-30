'use client'

import { useEffect, useState } from 'react'
import { Stethoscope } from 'lucide-react'
import { getSharedRx, type SharedRx } from '@/lib/shared-rx'

export function DoctorPrescriptions() {
  const [items, setItems] = useState<SharedRx[]>([])

  useEffect(() => {
    setItems(getSharedRx())
  }, [])

  if (items.length === 0) return null

  return (
    <section className="mb-3 rounded-[1.75rem] bg-card p-6">
      <div className="flex items-center gap-2">
        <Stethoscope className="size-4 text-brand" aria-hidden="true" />
        <h2 className="font-medium">New from your doctor</h2>
      </div>
      <ul className="mt-4 grid gap-2 md:grid-cols-2">
        {items.map((p) => (
          <li key={p.id} className="rounded-2xl border p-4">
            <p className="font-medium">
              {p.name} <span className="font-normal text-muted-foreground">{p.dosage}</span>
            </p>
            <p className="text-xs text-muted-foreground">{p.frequency}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {p.prescribedBy} · {p.date}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}