"use client"

import React from 'react'
import useContent from '../hooks/useContent'
import { useLanguage } from '../providers/language-provider'
import { motion } from 'framer-motion'

export default function WhyChooseUs() {
  const { content } = useContent()
  const { lang } = useLanguage()

  const title = content?.why?.title ? (lang === 'ar' ? content.why.title.ar : content.why.title.en) : '...'
  const desc = content?.why?.description ? (lang === 'ar' ? content.why.description.ar : content.why.description.en) : ''

  return (
    <section id="why" className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-3 text-gray-600">{desc}</p>
      </motion.div>
    </section>
  )
}
