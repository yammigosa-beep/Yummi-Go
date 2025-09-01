"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../providers/language-provider'
import useContent from '../hooks/useContent'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { lang } = useLanguage()
  const { content } = useContent()

  const menu = content?.menu ?? {
    home: { en: 'Home', ar: 'الرئيسية' },
    about: { en: 'About', ar: 'من نحن' },
    services: { en: 'Services', ar: 'خدماتنا' },
    why: { en: 'Why Us', ar: 'لماذا تختارنا' },
    contact: { en: 'Contact', ar: 'تواصل معنا' }
  }

  const keys = Object.keys(menu)

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            {/* larger logo image served from public/LOGO.svg */}
            <img src="/LOGO.svg" alt="Yummi Go" aria-label="Yummi Go logo" className="h-14 md:h-16 w-auto" />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {keys.map((k) => (
            <a key={k} href={`#${k}`} className="text-yummi-primary hover:text-yummi-hover text-lg font-semibold font-cairo transition-colors">
              {lang === 'ar' ? menu[k].ar : menu[k].en}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language toggle hidden for now */}
          <button className="md:hidden p-2 rounded-md bg-bg-off-white hover:bg-bg-light-gray transition-colors" aria-label="Toggle menu" onClick={() => setOpen(v => !v)}>
            <svg className="w-5 h-5 text-text-body" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white shadow-lg">
          <div className="px-4 py-3 flex flex-col gap-2">
            {keys.map((k) => (
              <a key={k} href={`#${k}`} onClick={() => setOpen(false)} className="py-3 px-3 rounded hover:bg-bg-off-white text-right font-cairo text-yummi-primary hover:text-yummi-hover transition-colors">
                {lang === 'ar' ? menu[k].ar : menu[k].en}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
