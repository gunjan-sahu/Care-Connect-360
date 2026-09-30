'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FilePlus2, Lock, MessageSquare, Mic, MicOff, MonitorUp, PhoneOff, Send, User, Video, VideoOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { addSharedRx } from '@/lib/shared-rx'
import { cn } from '@/lib/utils'

type Message = { from: 'patient' | 'me'; text: string }
type Rx = { drug: string; dosage: string; frequency: string }

const quickReplies = [
  'Hello',
  'How are you feeling?',
  'Any dizziness or headache?',
  'Are you taking your medicines?',
  'Thank you',
  'I will prescribe something',
]

function pick(options: string[]) {
  return options[Math.floor(Math.random() * options.length)]
}

function patientReply(text: string): string {
  const t = text.toLowerCase()
  if (/^(hi|hello|hey)\b/.test(t)) return pick(['Hello doctor!', 'Hi doctor, good afternoon.'])
  if (t.includes('feeling')) return pick(['Better overall, a bit tired in the afternoons.', 'A little tired, but okay.'])
  if (t.includes('dizz') || t.includes('headache')) return pick(['Sometimes a mild headache in the evening.', 'No dizziness, just tired.'])
  if (t.includes('medicine')) return pick(['Yes, every day on time.', 'I missed one dose last week.'])
  if (t.includes('thank')) return pick(['Thank you, doctor!', 'Thanks a lot.'])
  if (t.includes('prescribe')) return pick(['Okay, thank you doctor.', 'Sure, I will collect it.'])
  return pick(['Okay, understood.', 'Alright doctor.', 'Yes, I see.'])
}

export default function DoctorConsultationPage() {
  const router = useRouter()
  const [mic, setMic] = useState(true)
  const [cam, setCam] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)
  const [endOpen, setEndOpen] = useState(false)
  const [rxOpen, setRxOpen] = useState(false)
  const [rxList, setRxList] = useState<Rx[]>([])
  const [rxDraft, setRxDraft] = useState<Rx>({ drug: '', dosage: '', frequency: '' })
  const [seconds, setSeconds] = useState(0)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    { from: 'me', text: 'Hi Gunjan, I can see your recent BP readings. How have you been feeling?' },
    { from: 'patient', text: 'Better overall, a bit tired in the afternoons.' },
  ])

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  function send(text: string) {
    const t = text.trim()
    if (!t) return
    setMessages((m) => [...m, { from: 'me', text: t }])
    setDraft('')
    setTyping(true)
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'patient', text: patientReply(t) }])
      setTyping(false)
    }, 1200)
  }

  function addRx(e: React.FormEvent) {
    e.preventDefault()
    if (!rxDraft.drug.trim()) return
    setRxList((prev) => [...prev, rxDraft])
    setRxDraft({ drug: '', dosage: '', frequency: '' })
    setRxOpen(false)
    toast.success('Prescription added')
  }

  function endCall() {
    setEndOpen(false)
    addSharedRx(
      rxList.map((r, i) => ({
        id: `doc-${Date.now()}-${i}`,
        name: r.drug,
        dosage: r.dosage,
        frequency: r.frequency,
        prescribedBy: 'Dr. Ananya Iyer',
        date: new Date().toLocaleDateString('en-IN'),
      })),
    )
    toast.success('Consultation ended', { description: `Duration ${time}. Visit saved.` })
    router.push('/doctor')
  }

  const controls = [
    { on: mic, toggle: () => setMic((v) => !v), On: Mic, Off: MicOff, label: mic ? 'Mute microphone' : 'Unmute microphone' },
    { on: cam, toggle: () => setCam((v) => !v), On: Video, Off: VideoOff, label: cam ? 'Turn camera off' : 'Turn camera on' },
  ]

  return (
    <div className="grid min-h-svh gap-3 p-3 lg:grid-cols-[1fr_auto]">
      <section className="relative min-h-[70svh] overflow-hidden rounded-[1.75rem] bg-foreground lg:min-h-[calc(100svh-1.5rem)]">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute -top-24 -left-24 size-96 rounded-full bg-brand/40 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-success/30 blur-3xl" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          <div className="relative flex size-40 items-center justify-center sm:size-52">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand/40" />
            <span className="absolute inset-4 rounded-full border border-background/20" />
            <span className="relative flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent-foreground text-4xl font-medium text-primary-foreground shadow-2xl sm:size-36 sm:text-5xl">
              GS
            </span>
            <span className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full bg-background text-brand shadow-lg">
              <User className="size-5" aria-hidden="true" />
            </span>
          </div>
          <div className="text-center text-background">
            <p className="text-lg font-medium">Gunjan Sahu</p>
            <p className="text-sm text-background/60">34 yrs · BP follow-up</p>
          </div>
        </div>

        <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-card/85 px-3 py-1.5 text-xs backdrop-blur-md">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success" />
            <span className="relative size-2 rounded-full bg-success" />
          </span>
          <span className="font-mono">{time}</span>
          <Lock className="size-3 text-muted-foreground" aria-hidden="true" />
          <span className="hidden sm:inline">End-to-end encrypted</span>
        </div>

        <div className="absolute right-4 bottom-24 h-32 w-24 overflow-hidden rounded-2xl border-2 border-card bg-gradient-to-br from-brand-soft to-muted shadow-xl sm:h-40 sm:w-56">
          {cam ? (
            <div className="flex h-full items-center justify-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-brand text-lg font-medium text-primary-foreground">
                AI
              </span>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 bg-foreground text-background">
              <VideoOff className="size-5" aria-hidden="true" />
              <span className="text-xs">Camera off</span>
            </div>
          )}
          <span className="absolute bottom-2 left-2 rounded-full bg-card/85 px-2 py-0.5 text-[10px]">You</span>
          {!mic && (
            <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-primary-foreground">
              <MicOff className="size-3" aria-hidden="true" />
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-card/85 p-2 backdrop-blur-xl">
            {controls.map(({ on, toggle, On, Off, label }) => (
              <button
                key={label}
                type="button"
                onClick={toggle}
                aria-label={label}
                aria-pressed={!on}
                className={cn(
                  'flex size-12 items-center justify-center rounded-full transition-all duration-300 hover:scale-105',
                  on ? 'bg-muted' : 'bg-foreground text-background',
                )}
              >
                {on ? <On className="size-5" /> : <Off className="size-5" />}
              </button>
            ))}
            <button
              type="button"
              onClick={() => toast('Screen sharing started')}
              aria-label="Share screen"
              className="hidden size-12 items-center justify-center rounded-full bg-muted transition-transform hover:scale-105 sm:flex"
            >
              <MonitorUp className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setRxOpen(true)}
              aria-label="Write prescription"
              className="relative flex size-12 items-center justify-center rounded-full bg-muted transition-transform hover:scale-105"
            >
              <FilePlus2 className="size-5" />
              {rxList.length > 0 && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-brand text-[10px] text-primary-foreground">
                  {rxList.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setChatOpen((v) => !v)}
              aria-label="Toggle chat"
              aria-pressed={chatOpen}
              className={cn(
                'flex size-12 items-center justify-center rounded-full transition-all duration-300 hover:scale-105',
                chatOpen ? 'bg-brand text-primary-foreground' : 'bg-muted',
              )}
            >
              <MessageSquare className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setEndOpen(true)}
              aria-label="End call"
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-destructive px-5 text-sm text-primary-foreground transition-transform hover:scale-105"
            >
              <PhoneOff className="size-5" />
              <span className="hidden sm:inline">End</span>
            </button>
          </div>
        </div>
      </section>

      <aside
        aria-label="Consultation chat"
        className={cn(
          'flex flex-col overflow-hidden rounded-[1.75rem] bg-card transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          chatOpen ? 'max-h-[640px] opacity-100 lg:max-h-none lg:w-80' : 'max-h-0 opacity-0 lg:w-0',
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col lg:w-80">
          <div className="border-b p-4">
            <p className="font-medium">Consultation chat</p>
            <p className="text-xs text-muted-foreground">Messages are saved to the visit notes</p>
          </div>

          <ul ref={listRef} className="flex min-h-48 flex-1 flex-col gap-2 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <li
                key={i}
                className={cn(
                  'max-w-[85%] animate-in rounded-2xl px-3.5 py-2.5 text-sm fade-in-0 slide-in-from-bottom-2 duration-300',
                  m.from === 'me' ? 'self-end rounded-br-md bg-foreground text-background' : 'self-start rounded-bl-md bg-muted',
                )}
              >
                {m.text}
              </li>
            ))}
            {typing && (
              <li className="self-start rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
                Gunjan is typing…
              </li>
            )}
          </ul>

          <div className="border-t px-3 pt-3">
            <p className="mb-2 text-xs text-muted-foreground">Quick replies</p>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors hover:border-brand hover:bg-brand-soft"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <form
            className="flex gap-2 p-3"
            onSubmit={(e) => {
              e.preventDefault()
              send(draft)
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Message
            </label>
            <input
              id="chat-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message"
              className="h-10 flex-1 rounded-full bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex size-10 items-center justify-center rounded-full bg-brand text-primary-foreground transition-transform hover:scale-105"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </aside>

      <Dialog open={rxOpen} onOpenChange={setRxOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <form onSubmit={addRx} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>New prescription</DialogTitle>
              <DialogDescription>For Gunjan Sahu</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="drug">Medicine</Label>
              <Input id="drug" required className="h-11 rounded-xl" value={rxDraft.drug} onChange={(e) => setRxDraft({ ...rxDraft, drug: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" placeholder="e.g. 10 mg" className="h-11 rounded-xl" value={rxDraft.dosage} onChange={(e) => setRxDraft({ ...rxDraft, dosage: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="freq">How often</Label>
              <Input id="freq" placeholder="e.g. Once daily" className="h-11 rounded-xl" value={rxDraft.frequency} onChange={(e) => setRxDraft({ ...rxDraft, frequency: e.target.value })} />
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="ghost" className="rounded-full" />}>Cancel</DialogClose>
              <Button type="submit" className="rounded-full">
                Add prescription
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={endOpen} onOpenChange={setEndOpen}>
        <DialogContent className="rounded-3xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>End consultation?</DialogTitle>
            <DialogDescription>
              Your notes and {rxList.length} prescription(s) will be saved to the patient&apos;s record.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" className="rounded-full" />}>Stay</DialogClose>
            <Button
              className="rounded-full bg-destructive text-primary-foreground hover:bg-destructive/90"
              onClick={endCall}
            >
              End call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}