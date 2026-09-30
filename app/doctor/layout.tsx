import type { Metadata } from 'next'
import { DoctorShell } from '@/components/doctor/doctor-shell'

export const metadata: Metadata = {
  title: 'Doctor workspace — CareConnect360',
}

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="doctor-theme min-h-svh bg-background text-foreground">
      <DoctorShell>{children}</DoctorShell>
    </div>
  )
}