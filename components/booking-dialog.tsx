'use client'

import { useState, type ReactElement } from 'react'
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
import { doctors, specialties } from '@/lib/data'
import { cn } from '@/lib/utils'

const days = ['Mon 28', 'Tue 29', 'Wed 30', 'Thu 01', 'Fri 02']
const slots = ['09:00', '10:30', '11:45', '14:30', '16:00', '17:15']

export function BookingDialog({ trigger }: { trigger: ReactElement }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [specialty, setSpecialty] = useState(specialties[0])
  const [mode, setMode] = useState<'Video' | 'Chat'>('Video')
  const [day, setDay] = useState(days[0])
  const [slot, setSlot] = useState<string | null>(null)
  const [reason, setReason] = useState('')

  const doctor = doctors.find((d) => d.specialty === specialty) ?? doctors[0]

  function reset() {
    setStep(0)
    setSlot(null)
    setReason('')
  }

  function confirm() {
    setOpen(false)
    toast.success('Consultation booked', {
      description: `${doctor.name} · ${day} at ${slot} · ${mode}`,
    })
    setTimeout(reset, 300)
  }

  const canContinue = step === 0 || (step === 1 && slot !== null) || step === 2

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
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
            {step === 0 && 'Choose a specialty and how you want to meet.'}
            {step === 1 && `Next available with ${doctor.name}.`}
            {step === 2 && 'You can reschedule up to 2 hours before.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full bg-muted transition-colors duration-500',
                i <= step && 'bg-brand',
              )}
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
                    key={d}
                    type="button"
                    onClick={() => setDay(d)}
                    aria-pressed={day === d}
                    className={cn(
                      'flex min-w-16 flex-col items-center rounded-2xl border px-3 py-2.5 transition-all duration-300',
                      day === d && 'border-foreground bg-foreground text-background',
                    )}
                  >
                    <span className="text-xs opacity-70">{d.split(' ')[0]}</span>
                    <span className="text-lg font-medium">{d.split(' ')[1]}</span>
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
                ['Doctor', doctor.name],
                ['Specialty', specialty],
                ['When', `${day} · ${slot}`],
                ['Type', mode],
                ['Estimated cost', '$80 · insurance applied at checkout'],
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
            <Button
              className="h-10 rounded-full px-5"
              disabled={!canContinue}
              onClick={() => setStep((s) => s + 1)}
            >
              Continue
              <ArrowRight data-icon="inline-end" />
            </Button>
          ) : (
            <Button className="h-10 rounded-full bg-brand px-5 hover:bg-brand/90" onClick={confirm}>
              <Check data-icon="inline-start" />
              Confirm booking
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
