import type { Metadata } from 'next'
import { DoctorShell } from '@/components/doctor/doctor-shell'

export const metadata: Metadata = {
  title: 'Doctor workspace | CareConnect360',
}

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <DoctorShell>{children}</DoctorShell>
}