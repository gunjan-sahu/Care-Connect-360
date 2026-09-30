'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FilePlus2, Mic, MicOff, PhoneOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Rx = { drug: string; dosage: string; frequency: string }

export default function DoctorConsultationPage() {
  const router = useRouter()
  const [mic, setMic] = useState(true)
  const [notes, setNotes] = useState('')
  const [rxList, setRxList] = useState<Rx[]>([])
  const [rxOpen, setRxOpen] = useState(false)
  const [draft, setDraft] = useState<Rx>({ drug: '', dosage: '', frequency: '' })

  function addRx(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.drug.trim()) return
    setRxList((prev) => [...prev, draft])
    setDraft({ drug: '', dosage: '', frequency: '' })
    setRxOpen(false)
    toast.success('Prescription added')
  }

  function endCall() {
    toast.success('Visit saved', {
      description: `${rxList.length} prescription(s) sent to the patient.`,
    })
    router.push('/doctor')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
      <section className="relative min-h-[50svh] overflow-hidden rounded-xl bg-foreground lg:min-h-[calc(100svh-8rem)]">
        <Image src="/images/patient-self.png" alt="Patient on video" fill sizes="70vw" className="object-cover" />
        <div className="absolute top-3 left-3 rounded-md bg-card/85 px-3 py-2 backdrop-blur">
          <p className="text-sm font-medium">Jordan Miles</p>
          <p className="text-xs text-muted-foreground">34 yrs · BP follow-up</p>
        </div>
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setMic(!mic)}
            aria-label={mic ? 'Mute microphone' : 'Unmute microphone'}
            className="flex size-11 items-center justify-center rounded-md bg-card/90"
          >
            {mic ? <Mic className="size-5" /> : <MicOff className="size-5" />}
          </button>
          <button
            type="button"
            onClick={endCall}
            className="flex h-11 items-center gap-2 rounded-md bg-destructive px-4 text-sm text-primary-foreground"
          >
            <PhoneOff className="size-5" />
            End &amp; save
          </button>
        </div>
      </section>

      <aside className="flex flex-col gap-4">
        <section className="rounded-xl border bg-card p-4">
          <h2 className="text-sm font-medium">Patient summary</h2>
          <p className="mt-2 text-xs text-muted-foreground">Hypertension · Allergies: none</p>
          <p className="mt-1 text-xs text-muted-foreground">Lisinopril 10 mg, Atorvastatin 20 mg</p>
        </section>

        <section className="rounded-xl border bg-card p-4">
          <Label htmlFor="notes" className="text-sm font-medium">
            Visit notes
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type notes while you talk"
            className="mt-2 min-h-32"
          />
        </section>

        <section className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Prescriptions</h2>
            <Button size="sm" onClick={() => setRxOpen(true)}>
              <FilePlus2 data-icon="inline-start" />
              Write prescription
            </Button>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {rxList.length === 0 && <li className="text-xs text-muted-foreground">None yet.</li>}
            {rxList.map((r, i) => (
              <li key={i} className="rounded-md bg-brand-soft px-3 py-2 text-sm">
                <span className="font-medium">{r.drug}</span> {r.dosage}
                <span className="block text-xs text-muted-foreground">{r.frequency}</span>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      <Dialog open={rxOpen} onOpenChange={setRxOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={addRx} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>New prescription</DialogTitle>
              <DialogDescription>For Jordan Miles</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="drug">Medicine</Label>
              <Input id="drug" required value={draft.drug} onChange={(e) => setDraft({ ...draft, drug: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" placeholder="e.g. 10 mg" value={draft.dosage} onChange={(e) => setDraft({ ...draft, dosage: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="freq">How often</Label>
              <Input id="freq" placeholder="e.g. Once daily" value={draft.frequency} onChange={(e) => setDraft({ ...draft, frequency: e.target.value })} />
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="ghost" />}>Cancel</DialogClose>
              <Button type="submit">Add prescription</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}