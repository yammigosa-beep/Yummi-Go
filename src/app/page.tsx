"use client"

import React from 'react'
import Hero from '../components/Hero'
import useContent from '../hooks/useContent'
import { useLanguage } from '../providers/language-provider'
import About from '../components/About'
import Services from '../components/Services'
import WhyChooseUs from '../components/WhyChooseUs'
import Contact from '../components/Contact'
import Achievements from '../components/Achievements'
import Footer from '../components/Footer'

export default function HomeClient() {
  const { content, loading } = useContent()
  const { lang } = useLanguage()

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-warm-section">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-4 border-white/30 border-t-yummi-accent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className="sr-only">Loading</span>
        </div>
      </main>
    )

  return (
    <main className="font-cairo">
      <Hero />
  <Achievements />
  <About />
  <Services />
  <WhyChooseUs />
      <Contact />
      <Footer />
    </main>
  )
}
