'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function ContactForm() {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        e.currentTarget.reset()
        toast.success('Message sent', { description: 'We will reply within one business day.' })
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" required className="h-11 rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required className="h-11 rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="msg">Message</Label>
        <Textarea id="msg" required className="min-h-32 rounded-xl" />
      </div>
      <Button type="submit" className="h-11 rounded-full">Send message</Button>
    </form>
  )
}