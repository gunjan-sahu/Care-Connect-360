import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = { title: 'Contact | CareConnect360' }

export default function ContactPage() {
  return (
    <PageShell title="Contact">
      <p className="mb-6 text-muted-foreground">Questions or data requests? Send us a message.</p>
      <ContactForm />
    </PageShell>
  )
}