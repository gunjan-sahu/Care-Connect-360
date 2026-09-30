'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FilePlus2, Lock, MessageSquare, Mic, MicOff, MonitorUp, PhoneOff, Send, Video, VideoOff } from 'lucide-react'
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
import { doctorProfile } from '@/lib/doctor-data'
import { addSharedRx } from '@/lib/shared-rx'
import { cn } from '@/lib/utils'

type Message = { from: 'patient' | 'me'; text: string }
type Rx = { drug: string; dosage: string; frequency: string }

const quickReplies = [
  'Hello, how are you feeling today?',
  'Any dizziness or headaches?',
  'Are you taking your medicines on time?',
  'Let me check your readings',
  'I will prescribe something for this',
  'Please rest and drink plenty of water',
  'Thank you, take care',
]

function pick(options: string[]) {
  return options[Math.floor(Math.random() * options.length)]
}

// The "patient" answers based on what the doctor said
function patientReply(text: string): string {
  const t = text.toLowerCase()

  if (/^(hi|hello|hey)\b/.test(t) || t.includes('how are you') || t.includes('feeling'))
    return pick([
      'Hello doctor. I am feeling better overall, but a bit tired in the afternoons.',
      'Hi doctor. Mostly fine, just some tiredness after lunch.',
      'Hello. Better than last week, though I still get a mild headache sometimes.',
    ])

  if (t.includes('dizz') || t.includes('headache'))
    return pick([
      'Yes, a mild headache in the evenings, mostly when I skip water.',
      'A little dizziness when I stand up quickly, otherwise fine.',
      'No dizziness this week, only a light headache twice.',
    ])

  if (t.includes('medicine') || t.includes('tablet') || t.includes('on time'))
    return pick([
      'Yes, I take them every morning. I missed one dose last Sunday.',
      'Mostly on time. I sometimes forget the evening one.',
      'Yes doctor, I set an alarm so I do not miss them.',
    ])

  if (t.includes('reading') || t.includes('bp') || t.includes('pressure'))
    return pick([
      'Sure. My last reading this morning was 118 over 76.',
      'It has been around 120 over 78 this week.',
      'I have been noting it daily. It looks stable to me.',
    ])

  if (t.includes('prescribe') || t.includes('prescription'))
    return pick([
      'Okay doctor. Should I take it before or after food?',
      'Thank you. Will there be any side effects I should watch for?',
      'Alright. For how many days should I continue it?',
    ])

  if (t.includes('rest') || t.includes('water') || t.includes('sleep') || t.includes('diet'))
    return pick([
      'I will try. I usually sleep around 6 hours, I will improve that.',
      'Understood doctor. I will drink more water and take breaks.',
      'Okay, I will follow that. Should I avoid salty food too?',
    ])

  if (t.includes('thank') || t.includes('take care') || t.includes('bye'))
    return pick([
      'Thank you so much doctor. Have a good day.',
      'Thanks doctor. I will follow your advice.',
      'Thank you. I will message you if anything changes.',
    ])

  return pick([
    'I understand, doctor. Could you explain a little more?',
    'Okay doctor. What should I do next?',
    'Alright. Is there anything else I should keep in mind?',
  ])
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
    }, 1300)
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
        prescribedBy: doctorProfile.name,
        date: new Date().toLocaleDateString('en-IN'),
      })),
    )
    toast.success('Consultation ended', { description: `Duration ${time}. Visit saved.` })
    router.push('/doctor')
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
      <section className="relative min-h-[60svh] overflow-hidden rounded-[1.75rem] bg-foreground lg:min-h-[calc(100svh-9rem)]">
        <Image
          src="/images/consult-call.jpg"
          alt="Video consultation with Gunjan Sahu"
          fill
          priority
          sizes="70vw"
          className="object-cover"
        />

        {!cam && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-foreground/80 text-background backdrop-blur-sm">
            <VideoOff className="size-8" aria-hidden="true" />
            <p className="text-sm">Your camera is off</p>
          </div>
        )}

        <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-card/85 px-3 py-1.5 text-xs backdrop-blur-md">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success" />
            <span className="relative size-2 rounded-full bg-success" />
          </span>
          <span className="font-mono">{time}</span>
          <Lock className="size-3 text-muted-foreground" aria-hidden="true" />
          <span className="hidden sm:inline">End-to-end encrypted</span>
        </div>

        <div className="absolute top-4 right-4 rounded-2xl bg-card/85 px-4 py-2.5 backdrop-blur-md">
          <p className="text-sm font-medium">Gunjan Sahu</p>
          <p className="text-xs text-muted-foreground">20 yrs · BP follow-up</p>
        </div>

        {!mic && (
          <span className="absolute bottom-24 left-4 flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1 text-xs text-primary-foreground">
            <MicOff className="size-3" aria-hidden="true" />
            Muted
          </span>
        )}

        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-card/85 p-2 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setMic(!mic)}
              aria-label={mic ? 'Mute microphone' : 'Unmute microphone'}
              aria-pressed={!mic}
              className={cn(
                'flex size-12 items-center justify-center rounded-full transition-all duration-300 hover:scale-105',
                mic ? 'bg-muted' : 'bg-foreground text-background',
              )}
            >
              {mic ? <Mic className="size-5" /> : <MicOff className="size-5" />}
            </button>
            <button
              type="button"
              onClick={() => setCam(!cam)}
              aria-label={cam ? 'Turn camera off' : 'Turn camera on'}
              aria-pressed={!cam}
              className={cn(
                'flex size-12 items-center justify-center rounded-full transition-all duration-300 hover:scale-105',
                cam ? 'bg-muted' : 'bg-foreground text-background',
              )}
            >
              {cam ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            </button>
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
          chatOpen ? 'max-h-[680px] opacity-100 lg:max-h-none lg:w-80' : 'max-h-0 opacity-0 lg:w-0',
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
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:max-h-32 lg:flex-wrap lg:overflow-y-auto lg:overflow-x-hidden">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="shrink-0 rounded-full border px-3 py-1.5 text-left text-xs transition-colors hover:border-brand hover:bg-brand-soft"
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
              <Input id="drug" required value={rxDraft.drug} onChange={(e) => setRxDraft({ ...rxDraft, drug: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" placeholder="e.g. 10 mg" value={rxDraft.dosage} onChange={(e) => setRxDraft({ ...rxDraft, dosage: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="freq">How often</Label>
              <Input id="freq" placeholder="e.g. Once daily" value={rxDraft.frequency} onChange={(e) => setRxDraft({ ...rxDraft, frequency: e.target.value })} />
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
            <Button className="rounded-full bg-destructive text-primary-foreground hover:bg-destructive/90" onClick={endCall}>
              End call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}