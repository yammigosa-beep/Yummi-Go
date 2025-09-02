"use client"

import { useEffect, useState } from 'react'
import { useLanguage } from '../providers/language-provider'

type Content = any

export default function useContent() {
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const { lang } = useLanguage()

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('content') : null
    if (stored) {
      try {
        setContent(JSON.parse(stored))
      } catch {}
    }

    fetch('/content.json')
      .then((r) => r.json())
      .then((data) => {
        setContent(data)
        try {
          localStorage.setItem('content', JSON.stringify(data))
        } catch {}
      })
      .catch(() => {
        // ignore, fallback to stored
      })
      .finally(() => setLoading(false))
  }, [])

  return { content, loading, lang }
}
