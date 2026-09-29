'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Lock, MessageSquare, Mic, MicOff, MonitorUp, PhoneOff, Video, VideoOff, Send } from 'lucide-react'
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

export function VideoRoom() {
  const router = useRouter()
  const [mic, setMic] = useState(true)
  const [cam, setCam] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)
  const [endOpen, setEndOpen] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { from: 'doctor', text: 'Hi Jordan, I can see your recent BP readings. How have you been feeling?' },
    { from: 'me', text: 'Better overall, a bit tired in the afternoons.' },
  ])

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  function send() {
    const text = draft.trim()
    if (!text) return
    setMessages((m) => [...m, { from: 'me', text }])
    setDraft('')
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
      <section className="relative min-h-[60svh] overflow-hidden rounded-[1.75rem] bg-foreground lg:min-h-[calc(100svh-7rem)]">
        <Image src="/images/doctor-call.png" alt="Dr. Amara Okafor on video" fill priority sizes="70vw" className="object-cover" />

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
          <p className="text-sm font-medium">Dr. Amara Okafor</p>
          <p className="text-xs text-muted-foreground">General Practice</p>
        </div>

        <div
          className={cn(
            'absolute right-4 bottom-24 h-32 w-24 overflow-hidden rounded-2xl border-2 border-card bg-muted shadow-xl transition-all duration-500 sm:h-40 sm:w-56 sm:bottom-24',
          )}
        >
          {cam ? (
            <Image src="/images/patient-self.png" alt="Your camera" fill sizes="220px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-sm font-medium text-accent-foreground">
                JM
              </span>
            </div>
          )}
          {!mic && (
            <span className="absolute bottom-2 left-2 flex size-6 items-center justify-center rounded-full bg-destructive text-primary-foreground">
              <MicOff className="size-3" aria-hidden="true" />
            </span>
          )}
        </div>

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
          chatOpen ? 'max-h-[600px] opacity-100 lg:max-h-none lg:w-80' : 'max-h-0 opacity-0 lg:w-0',
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col lg:w-80">
          <div className="border-b p-4">
            <p className="font-medium">Consultation chat</p>
            <p className="text-xs text-muted-foreground">Messages are saved to your visit notes</p>
          </div>
          <ul className="flex min-h-48 flex-1 flex-col gap-2 overflow-y-auto p-4">
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
          </ul>
          <form
            className="flex gap-2 border-t p-3"
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Message
            </label>
            <input
              id="chat-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault()
              }}
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
