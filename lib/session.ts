export type Session = {
  id: number
  name: string
  email: string
  role: 'Patient' | 'Doctor'
  profile_id: number | null
}

type Stored = { access: string; refresh: string; user: Session }

const KEY = 'cc360-auth'

function read(): Stored | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Stored) : null
  } catch {
    return null
  }
}

export function getSession(): Session | null {
  return read()?.user ?? null
}

export function getTokens(): { access: string; refresh: string } | null {
  const s = read()
  return s ? { access: s.access, refresh: s.refresh } : null
}

export function saveAuth(data: Stored) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function updateAccess(access: string) {
  const s = read()
  if (s) localStorage.setItem(KEY, JSON.stringify({ ...s, access }))
}

export function clearSession() {
  localStorage.removeItem(KEY)
  localStorage.removeItem('cc360-session')
  sessionStorage.removeItem('cc360-session')
}