import type { Metadata } from 'next'
import { Logo } from '@/components/logo'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = { title: 'Sign in | CareConnect360' }

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-3">
      <Logo />
      <AuthForm />
    </div>
  )
}