"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type Lang = 'en' | 'ar'

type LanguageContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar')

  useEffect(() => {
    // keep the root HTML lang attribute for accessibility but avoid changing
    // the root `dir` so the browser scrollbar remains on the right.
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en'
  }, [lang])

  // Apply writing direction to the provider wrapper only so the document
  // root (and scrollbar) stay LTR while content can render RTL when needed.
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
