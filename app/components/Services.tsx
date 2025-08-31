"use client"

import React from 'react'
import useContent from '../hooks/useContent'
import { useLanguage } from '../providers/language-provider'
import { motion } from 'framer-motion'

export default function Services() {
  const { content } = useContent()
  const { lang } = useLanguage()

  const title = content?.services?.title ? (lang === 'ar' ? content.services.title.ar : content.services.title.en) : '...'
  const desc = content?.services?.description ? (lang === 'ar' ? content.services.description.ar : content.services.description.en) : ''

  return (
    <section id="services" className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="mt-3 text-gray-600">{desc}</p>
        </motion.div>
      </div>
    </section>
  )
}
