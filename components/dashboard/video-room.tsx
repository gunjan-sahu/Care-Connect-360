'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, MessageSquare, Mic, MicOff, MonitorUp, PhoneOff, Send, Stethoscope, Video, VideoOff } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Message = { from: 'doctor' | 'me'; text: string }

const quickReplies = [
  'Hi',
  'Hello',
  'Hey',
  'Thank you',
  'Yes',
  'No',
  'Can you repeat that?',
  "I'll get back to you later",
]
function pick(options: string[]) {
  return options[Math.floor(Math.random() * options.length)]
}

function doctorReply(text: string): string {
  const t = text.toLowerCase().trim()

  if (/^(hi|hello|hey)\b/.test(t))
    return pick([
      'Hello Gunjan! Good to see you. How are you feeling today?',
      'Hi Gunjan, thanks for joining. How has your week been?',
      'Hey Gunjan! Glad you could make it. Any changes since your last visit?',
    ])

  if (t.includes('thank'))
    return pick([
      "You're welcome. Let me know if you have any other questions.",
      'Happy to help, Gunjan. Anything else on your mind?',
      'Anytime. Take care of yourself.',
    ])

  if (t.includes('later'))
    return pick([
      'No problem. Take your time, I will be here.',
      'Sure, message me whenever you are ready.',
      'That is fine. You can reach me here anytime today.',
    ])

  if (t.includes('repeat'))
    return pick([
      'Of course. I asked how you have been feeling since your last visit.',
      'Sure. Have you noticed any changes in how you feel lately?',
      'No worries. I was checking how your recent readings compare with how you feel.',
    ])

  if (t === 'yes')
    return pick([
      'Good to hear. Have you noticed any dizziness or headaches?',
      'Okay. Is it happening every day or only sometimes?',
      'Thanks for confirming. Are you sleeping well at night?',
    ])

  if (t === 'no')
    return pick([
      'Alright, noted. Are you taking your medicines on time?',
      'Okay, that is good. Have you been drinking enough water?',
      'Understood. Any other symptoms I should know about?',
    ])

  if (t.includes('tired') || t.includes('pain') || t.includes('headache'))
    return pick([
      'Thank you for telling me. How long have you felt this way?',
      'I see. On a scale of 1 to 10, how strong is it?',
      'Noted. Does it get worse at a particular time of day?',
    ])

  return pick([
    'I understand. Please tell me a little more so I can help.',
    'Thanks for sharing. Can you describe it in a bit more detail?',
    'Got it. When did you first notice this?',
  ])
}

export function VideoRoom() {
  const router = useRouter()
  const [mic, setMic] = useState(true)
  const [cam, setCam] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)
  const [endOpen, setEndOpen] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    { from: 'doctor', text: 'Hi Gunjan, I can see your recent BP readings. How have you been feeling?' },
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
      setMessages((m) => [...m, { from: 'doctor', text: doctorReply(t) }])
      setTyping(false)
    }, 1200)
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
              AI
            </span>
            <span className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full bg-background text-brand shadow-lg">
              <Stethoscope className="size-5" aria-hidden="true" />
            </span>
          </div>
          <div className="text-center text-background">
            <p className="text-lg font-medium">Dr. Ananya Iyer</p>
            <p className="text-sm text-background/60">General Practice</p>
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
                GS
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
            <p className="text-xs text-muted-foreground">Messages are saved to your visit notes</p>
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
                Dr. Iyer is typing…
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

      <Dialog open={endOpen} onOpenChange={setEndOpen}>
        <DialogContent className="rounded-3xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>End consultation?</DialogTitle>
            <DialogDescription>
              Your visit summary and any prescriptions will appear in your portal within a few minutes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" className="rounded-full" />}>Stay</DialogClose>
            <Button
              className="rounded-full bg-destructive text-primary-foreground hover:bg-destructive/90"
              onClick={() => {
                setEndOpen(false)
                toast.success('Consultation ended', { description: `Duration ${time}. Summary on its way.` })
                router.push('/dashboard')
              }}
            >
              End call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}