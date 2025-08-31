"use client"

import React from 'react'
import useContent from '../hooks/useContent'
import { useLanguage } from '../providers/language-provider'
import { motion } from 'framer-motion'

export default function About() {
  const { content } = useContent()
  const { lang } = useLanguage()

  const title = content?.about?.title ? (lang === 'ar' ? content.about.title.ar : content.about.title.en) : '...'
  const desc = content?.about?.description ? (lang === 'ar' ? content.about.description.ar : content.about.description.en) : ''

  return (
    <section id="about" className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-3 text-gray-600">{desc}</p>
      </motion.div>
    </section>
  )
}
