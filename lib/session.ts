export type Session = { name: string; email: string; role?: 'Patient' | 'Doctor' }

const SESSION_KEY = 'cc360-session'
const ACCOUNTS_KEY = 'cc360-accounts'

function read(store: Storage, key: string) {
  try {
    const raw = store.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  return read(localStorage, SESSION_KEY) ?? read(sessionStorage, SESSION_KEY)
}

export function saveSession(s: Session, remember: boolean) {
  clearSession()
  const store = remember ? localStorage : sessionStorage
  store.setItem(SESSION_KEY, JSON.stringify(s))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

export function saveAccount(a: Session) {
  const list: Session[] = read(localStorage, ACCOUNTS_KEY) ?? []
  const next = list.filter((x) => x.email !== a.email).concat(a)
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next))
}

export function findAccount(email: string): Session | undefined {
  const list: Session[] = read(localStorage, ACCOUNTS_KEY) ?? []
  return list.find((x) => x.email === email)
}