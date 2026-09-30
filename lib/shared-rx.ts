export type SharedRx = {
  id: string
  name: string
  dosage: string
  frequency: string
  prescribedBy: string
  date: string
}

const KEY = 'cc360-doctor-rx'

export function getSharedRx(): SharedRx[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addSharedRx(items: SharedRx[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...items, ...getSharedRx()]))
  } catch {}
}