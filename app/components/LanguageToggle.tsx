"use client"

import React from 'react'
import { useLanguage } from '../providers/language-provider'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 rounded ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
        English
      </button>
      <button
        onClick={() => setLang('ar')}
        className={`px-3 py-1 rounded ${lang === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
        العربية
      </button>
    </div>
  )
}
