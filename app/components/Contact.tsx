"use client"

import React from 'react'
import useContent from '../hooks/useContent'
import { useLanguage } from '../providers/language-provider'
import { motion } from 'framer-motion'

export default function Contact() {
  const { content } = useContent()
  const { lang } = useLanguage()

  const title = content?.contact?.title ? (lang === 'ar' ? content.contact.title.ar : content.contact.title.en) : '...'
  const desc = content?.contact?.description ? (lang === 'ar' ? content.contact.description.ar : content.contact.description.en) : ''

  return (
    <section id="contact" className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="mt-3 text-gray-600">{desc}</p>
          <div className="mt-6">
            <a href="#" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow transition">{lang === 'ar' ? 'راسلنا' : 'Contact Us'}</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
