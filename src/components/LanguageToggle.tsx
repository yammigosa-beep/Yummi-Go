"use client"

import React from 'react'
import { useLanguage } from '../providers/language-provider'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex gap-1 bg-white/10 rounded-full p-1 backdrop-blur-sm">
      <button
        onClick={() => setLang('ar')}
        className={`px-3 py-1 rounded-full text-sm font-cairo transition-all duration-200 ${
          lang === 'ar' 
            ? 'bg-yummi-accent text-white shadow-md' 
            : 'text-yummi-primary hover:bg-white/10'
        }`}
      >
        العربية
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 rounded-full text-sm font-cairo transition-all duration-200 ${
          lang === 'en' 
            ? 'bg-yummi-accent text-white shadow-md' 
            : 'text-yummi-primary hover:bg-white/10'
        }`}
      >
        English
      </button>
    </div>
  )
}
