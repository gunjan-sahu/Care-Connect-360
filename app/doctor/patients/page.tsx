'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { patients } from '@/lib/doctor-data'
import { cn } from '@/lib/utils'

export default function PatientsPage() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(patients[0].id)

  const list = patients.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
  const selected = patients.find((p) => p.id === selectedId) ?? patients[0]

  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <section className="rounded-xl border bg-card">
        <div className="relative border-b p-3">
          <Search className="pointer-events-none absolute top-1/2 left-6 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients"
            aria-label="Search patients"
            className="h-9 w-full rounded-md bg-muted pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <ul className="divide-y">
          {list.length === 0 && <li className="p-4 text-sm text-muted-foreground">No patients found.</li>}
          {list.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={cn(
                  'w-full px-4 py-3 text-left transition-colors hover:bg-muted',
                  selectedId === p.id && 'bg-brand-soft',
                )}
              >
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.age} yrs · {p.condition}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-xl font-semibold tracking-tight">{selected.name}</h2>
        <p className="text-sm text-muted-foreground">
          {selected.age} yrs · {selected.gender}
        </p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            ['Condition', selected.condition],
            ['Last visit', selected.lastVisit],
            ['Allergies', selected.allergies],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-muted p-3">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-1 text-sm font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <h3 className="mt-6 text-sm font-medium">Current medication</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {selected.meds.map((m) => (
            <li key={m} className="rounded-md bg-brand-soft px-2.5 py-1 text-xs font-medium text-accent-foreground">
              {m}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}