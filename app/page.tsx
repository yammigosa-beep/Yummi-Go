"use client"

"use client"

import React from 'react'
import Hero from './components/Hero'
import useContent from './hooks/useContent'
import { useLanguage } from './providers/language-provider'
import About from './components/About'
import Services from './components/Services'
import WhyChooseUs from './components/WhyChooseUs'
import Contact from './components/Contact'

export default function HomeClient() {
  const { content, loading } = useContent()
  const { lang } = useLanguage()

  if (loading) return <main className="p-8">Loading...</main>

  return (
    <main>
      <Hero />
      <About />
      <Services />
      <WhyChooseUs />
      <Contact />
    </main>
  )
}
