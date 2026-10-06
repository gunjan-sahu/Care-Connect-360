'use client'

import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { ArrowLeft, ArrowRight, Check, Video, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { getSession } from '@/lib/session'
import { notifyChanged } from '@/lib/use-api'
import type { Doctor, Paged } from '@/lib/types'
import { cn } from '@/lib/utils'

const FALLBACK = ['General Practice']
const slots = ['09:00', '10:30', '11:45', '14:30', '16:00', '17:15']

function nextDays() {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return {
      iso,
      dow: d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: String(d.getDate()).padStart(2, '0'),
    }
  })
}

export function BookingDialog({ trigger }: { trigger: ReactElement }) {
  const days = useMemo(nextDays, [])
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [specialties, setSpecialties] = useState<string[]>(FALLBACK)
  const [specialty, setSpecialty] = useState(FALLBACK[0])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctorId, setDoctorId] = useState<number | null>(null)
  const [mode, setMode] = useState<'Video' | 'Chat'>('Video')
  const [day, setDay] = useState(days[0].iso)
  const [slot, setSlot] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [doctorSearch, setDoctorSearch] = useState('')
  const [debounced, setDebounced] = useState('')

  const doctor = doctors.find((d) => d.id === doctorId)
  const dayInfo = days.find((d) => d.iso === day) ?? days[0]

  useEffect(() => {
    if (!open) return
    api<string[]>('/specialties/')
      .then((list) => {
        if (list.length === 0) return
        setSpecialties(list)
        setSpecialty((cur) => (list.includes(cur) ? cur : list[0]))
      })
      .catch(() => {})
  }, [open])

  useEffect(() => {
    const t = setTimeout(() => setDebounced(doctorSearch.trim()), 300)
    return () => clearTimeout(t)
  }, [doctorSearch])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    const query = debounced
      ? `search=${encodeURIComponent(debounced)}`
      : `specialty=${encodeURIComponent(specialty)}`
    api<Paged<Doctor>>(`/doctors/?${query}`)
      .then((r) => {
        if (cancelled) return
        setDoctors(r.results)
        setDoctorId(r.results[0]?.id ?? null)
      })
      .catch(() => {
        if (!cancelled) setDoctors([])
      })
    return () => {
      cancelled = true
    }
  }, [open, specialty, debounced])

  function reset() {
    setStep(0)
    setSlot(null)
    setReason('')
    setDoctorSearch('')
  }

  async function confirm() {
    if (!doctor || !slot) return
    setSaving(true)
    try {
      await api('/appointments/', {
        method: 'POST',
        body: { doctor: doctor.id, date: day, time: slot, kind: mode, reason },
      })
      toast.success('Consultation booked', {
        description: `${doctor.name} · ${dayInfo.dow} ${dayInfo.day} at ${slot} · ${mode}`,
      })
      notifyChanged()
      setOpen(false)
      setTimeout(reset, 300)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not book. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const canContinue = (step === 0 && doctor !== undefined) || (step === 1 && slot !== null) || step === 2

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          const s = getSession()
          if (!s) {
            toast('Please sign in to book a consultation')
            window.location.assign('/login')
            return
          }
          if (s.role === 'Doctor') {
            toast.error('Doctor accounts cannot book consultations.')
            return
          }
        }
        setOpen(next)
        if (!next) setTimeout(reset, 300)
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="gap-6 rounded-3xl p-6 sm:max-w-lg">
        <DialogHeader>
          <p className="font-mono text-xs text-muted-foreground">
            {'STEP 0'}
            {step + 1}
            {' / 03'}
          </p>
          <DialogTitle className="text-2xl font-medium tracking-tight">
            {step === 0 && 'What do you need help with?'}
            {step === 1 && 'Pick a time that suits you'}
            {step === 2 && 'Review & confirm'}
          </DialogTitle>
          <DialogDescription>
            {step === 0 && 'Choose a specialty, a doctor and how you want to meet.'}
            {step === 1 && `Available with ${doctor?.name ?? 'your doctor'}.`}
            {step === 2 && 'This will be saved to your account.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn('h-1 flex-1 rounded-full bg-muted transition-colors duration-500', i <= step && 'bg-brand')}
            />
          ))}
        </div>

        <div key={step} className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium">Specialty</legend>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpecialty(s)}
                      aria-pressed={specialty === s}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 text-sm transition-all duration-300 hover:border-foreground/40',
                        specialty === s && 'border-foreground bg-foreground text-background',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="flex flex-col gap-2">
                <Label htmlFor="doctor-search">Doctor</Label>
                <input
                  id="doctor-search"
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  placeholder="Search by name, e.g. Purvi"
                  className="h-11 rounded-xl border bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
                <select
                  id="doctor"
                  value={doctorId ?? ''}
                  onChange={(e) => setDoctorId(Number(e.target.value))}
                  className="h-11 rounded-xl border bg-transparent px-3 text-sm"
                >
                  {doctors.length === 0 && <option value="">No doctors found</option>}
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} · ★ {d.rating}
                    </option>
                  ))}
                </select>
              </div>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium">Consultation type</legend>
                <div className="grid grid-cols-2 gap-2">
                  {(['Video', 'Chat'] as const).map((m) => {
                    const Icon = m === 'Video' ? Video : MessageSquare
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        aria-pressed={mode === m}
                        className={cn(
                          'flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300 hover:border-foreground/40',
                          mode === m && 'border-brand bg-brand-soft',
                        )}
                      >
                        <Icon className="size-5 text-brand" />
                        <span className="flex flex-col">
                          <span className="text-sm font-medium">{m}</span>
                          <span className="text-xs text-muted-foreground">
                            {m === 'Video' ? 'Encrypted HD call' : 'Async messaging'}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
                {days.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    onClick={() => setDay(d.iso)}
                    aria-pressed={day === d.iso}
                    className={cn(
                      'flex min-w-16 flex-col items-center rounded-2xl border px-3 py-2.5 transition-all duration-300',
                      day === d.iso && 'border-foreground bg-foreground text-background',
                    )}
                  >
                    <span className="text-xs opacity-70">{d.dow}</span>
                    <span className="text-lg font-medium">{d.day}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    aria-pressed={slot === s}
                    className={cn(
                      'rounded-xl border py-2.5 font-mono text-sm transition-all duration-300 hover:border-brand',
                      slot === s && 'border-brand bg-brand text-primary-foreground',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="reason">Reason for visit (optional)</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe your symptoms"
                  className="min-h-20 rounded-xl"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <dl className="divide-y rounded-2xl border">
              {[
                ['Doctor', doctor?.name ?? ''],
                ['Specialty', specialty],
                ['When', `${dayInfo.dow} ${dayInfo.day} · ${slot}`],
                ['Type', mode],
                ['Estimated cost', '₹800 · insurance applied at checkout'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft data-icon="inline-start" />
            Back
          </Button>
          {step < 2 ? (
            <Button className="h-10 rounded-full px-5" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
              Continue
              <ArrowRight data-icon="inline-end" />
            </Button>
          ) : (
            <Button className="h-10 rounded-full bg-brand px-5 hover:bg-brand/90" disabled={saving} onClick={confirm}>
              <Check data-icon="inline-start" />
              {saving ? 'Booking…' : 'Confirm booking'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 