"use client"

import { useEffect, useState } from 'react'
import { useLanguage } from '../providers/language-provider'
import { processContentImages } from '../lib/content-utils'

type Content = any

export default function useContent() {
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const { lang } = useLanguage()

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    // Fetch from API endpoint which now gets data from Supabase Storage
    fetch('/api/content', { cache: 'no-store' })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error('Network response not ok')))
      .then((data) => {
        if (cancelled) return
        // Process images to convert relative paths to Supabase URLs
        const processedData = processContentImages(data)
        setContent(processedData)
        try {
          localStorage.setItem('content', JSON.stringify(processedData))
        } catch {}
      })
      .catch(() => {
        // On failure, fallback to cached localStorage to keep app usable offline/dev
        const stored = typeof window !== 'undefined' ? localStorage.getItem('content') : null
        if (stored) {
          try {
            const parsedStored = JSON.parse(stored)
            const processedStored = processContentImages(parsedStored)
            setContent(processedStored)
          } catch {}
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { content, loading, lang }
}
