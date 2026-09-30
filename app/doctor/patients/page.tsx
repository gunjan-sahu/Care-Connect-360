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
    <div className="grid gap-3 lg:grid-cols-[22rem_1fr]">
      <section className="rounded-[1.75rem] bg-card p-3">
        <label className="relative block p-2">
          <span className="sr-only">Search patients</span>
          <Search className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients"
            className="h-10 w-full rounded-full bg-muted pr-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        </label>
        <ul className="mt-1 flex flex-col gap-1">
          {list.length === 0 && <li className="p-4 text-sm text-muted-foreground">No patients found.</li>}
          {list.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={cn(
                  'w-full rounded-2xl px-4 py-3 text-left transition-colors hover:bg-muted',
                  selectedId === p.id && 'bg-brand-soft hover:bg-brand-soft',
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

      <section className="rounded-[1.75rem] bg-card p-6">
        <h2 className="text-2xl font-medium tracking-tight">{selected.name}</h2>
        <p className="text-sm text-muted-foreground">
          {selected.age} yrs · {selected.gender}
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ['Condition', selected.condition],
            ['Last visit', selected.lastVisit],
            ['Allergies', selected.allergies],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-muted p-4">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-1 text-sm font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <h3 className="mt-8 text-sm font-medium">Current medication</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {selected.meds.map((m) => (
            <li key={m} className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-medium text-accent-foreground">
              {m}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}