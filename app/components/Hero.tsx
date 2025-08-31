"use client"

import React from 'react'
import useContent from '../hooks/useContent'
import { useLanguage } from '../providers/language-provider'

export default function Hero() {
  const { content } = useContent()
  const { lang } = useLanguage()

  const title = content?.home?.title ? (lang === 'ar' ? content.home.title.ar : content.home.title.en) : '...'
  const desc = content?.home?.description ? (lang === 'ar' ? content.home.description.ar : content.home.description.en) : ''

  return (
    <section className="bg-gradient-to-b from-yellow-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{title}</h1>
        <p className="mt-4 text-gray-600">{desc}</p>
        <div className="mt-8">
          <a href="#contact" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow transition">{lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}</a>
        </div>
      </div>
    </section>
  )
}
