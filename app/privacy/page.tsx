import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'

export const metadata: Metadata = { title: 'Privacy | CareConnect360' }

const sections = [
  ['What we collect', 'Your name, contact details, appointment history and the health information you share with your doctor.'],
  ['How we use it', 'Only to run your consultations, prescriptions and billing. We never sell your data.'],
  ['Video calls', 'Calls are end-to-end encrypted and are never recorded without your consent.'],
  ['Your control', 'You can request a copy or deletion of your data at any time from the Contact page.'],
]

export default function PrivacyPage() {
  return (
    <PageShell title="Privacy">
      <dl className="flex flex-col gap-6">
        {sections.map(([h, b]) => (
          <div key={h}>
            <dt className="font-medium">{h}</dt>
            <dd className="mt-1 leading-relaxed text-muted-foreground">{b}</dd>
          </div>
        ))}
      </dl>
    </PageShell>
  )
}