import { clearSession, getTokens, updateAccess, type Session } from '@/lib/session'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api'

export type AuthResponse = { access: string; refresh: string; user: Session }

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function readMessage(data: unknown): string {
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (typeof d.detail === 'string') return d.detail
    const first = Object.values(d)[0]
    if (Array.isArray(first) && typeof first[0] === 'string') return first[0]
    if (typeof first === 'string') return first
  }
  return 'Something went wrong. Please try again.'
}

async function refreshAccess(): Promise<string | null> {
  const tokens = getTokens()
  if (!tokens) return null
  try {
    const res = await fetch(`${BASE}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: tokens.refresh }),
    })
    if (!res.ok) return null
    const data = await res.json()
    updateAccess(data.access)
    return data.access as string
  } catch {
    return null
  }
}

type Options = { method?: string; body?: unknown; auth?: boolean }

export async function api<T>(path: string, { method = 'GET', body, auth = true }: Options = {}): Promise<T> {
  const send = (token?: string) =>
    fetch(`${BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })

  let res: Response
  try {
    res = await send(auth ? getTokens()?.access : undefined)
    if (res.status === 401 && auth) {
      const fresh = await refreshAccess()
      if (fresh) {
        res = await send(fresh)
      } else {
        clearSession()
        window.location.assign('/login')
      }
    }
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0)
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(readMessage(data), res.status)
  return data as T
}