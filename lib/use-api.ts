'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api'

export function notifyChanged() {
  window.dispatchEvent(new Event('cc360-changed'))
}

export function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setData(await api<T>(path))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [path])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    window.addEventListener('cc360-changed', load)
    return () => window.removeEventListener('cc360-changed', load)
  }, [load])

  return { data, loading, error, reload: load }
}