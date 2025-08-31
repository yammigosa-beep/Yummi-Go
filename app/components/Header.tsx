"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import LanguageToggle from './LanguageToggle'
import { useLanguage } from '../providers/language-provider'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { lang } = useLanguage()

  const { content } = require('../hooks/useContent').default()
  const nav = content?.menu

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold">YummiGo</div>
          <div className="text-sm text-gray-500 hidden md:block">{lang === 'ar' ? 'حلول توصيل الطعام' : 'Kitchen & Factory Connector'}</div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {nav && Object.keys(nav).map((key) => (
            <a key={key} href={`#${key}`} className="text-sm text-gray-700 hover:text-blue-600">
              {lang === 'ar' ? nav[key].ar : nav[key].en}
            </a>
          ))}
          <a href="/admin" className="text-sm text-red-600">Admin</a>
          <LanguageToggle />
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle />
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded-md bg-gray-100"
          >
            <span className="sr-only">Menu</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t">
          <div className="px-4 py-3 flex flex-col gap-2">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="py-2 px-2 rounded hover:bg-gray-50">
                {lang === 'ar' ? n.ar : n.en}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
