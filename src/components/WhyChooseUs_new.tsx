"use client"

import React from 'react'
import { motion } from 'framer-motion'
import useContent from '../hooks/useContent'

export default function WhyChooseUs() {
  const { content, lang } = useContent()

  const title = content?.whyChooseUs?.title ? (lang === 'ar' ? content.whyChooseUs.title.ar : content.whyChooseUs.title.en) : 'لماذا تختارنا؟'
  const reasons = content?.whyChooseUs?.items || [
    {
      title: { ar: "شبكة واسعة", en: "Wide Network" },
      description: { ar: "شبكة واسعة من المطابخ ومزوّدي الإعاشة الموثوقين.", en: "Extensive network of trusted kitchens and catering providers." }
    },
    {
      title: { ar: "أسعار تنافسية", en: "Competitive Prices" },
      description: { ar: "أسعار تنافسية نتيجة الربط المباشر وتقليل التكاليف.", en: "Competitive prices through direct connection and cost reduction." }
    },
    {
      title: { ar: "معايير الجودة", en: "Quality Standards" },
      description: { ar: "التزام كامل بمعايير الجودة والنظافة.", en: "Full commitment to quality and cleanliness standards." }
    },
    {
      title: { ar: "توفير الوقت", en: "Time & Effort Saving" },
      description: { ar: "توفير الوقت والجهد على إدارة المصانع.", en: "Save time and effort for factory management." }
    },
    {
      title: { ar: "خدمة مستمرة", en: "Seamless Experience" },
      description: { ar: "تجربة سلسة وخدمة عملاء مستمرة.", en: "Smooth experience and continuous customer service." }
    }
  ]

  const getIcon = (index: number) => {
    const icons = [
      (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
      (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
        </svg>
      ),
      (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9l-5 4.87 1.18 6.88L12 17.5l-6.18 3.25L7 13.87 2 9l6.91-1.74L12 2z"/>
        </svg>
      ),
      (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
      ),
      (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      )
    ]
    return icons[index] || icons[0]
  }

  return (
    <section id="why" className="py-16 bg-warm-section">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-cairo">
              {title}
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative group h-full">
                  {/* Card Background with Image Effect */}
                  <div
                    className="relative bg-white/6 backdrop-blur-sm rounded-lg overflow-hidden h-full min-h-[280px] border border-white/20 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    {/* Gradient overlay for better readability */}
                    <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-all duration-300"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 p-6 flex flex-col justify-center items-center h-full text-center">
                      {/* Icon */}
                      <div className="text-orange-500 mb-4 group-hover:text-orange-400 transition-colors duration-300">
                        {getIcon(index)}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 font-cairo">
                        {lang === 'ar' ? reason.title.ar : reason.title.en}
                      </h3>

                      {/* Description */}
                      <p className="text-white/90 font-cairo leading-relaxed text-sm">
                        {lang === 'ar' ? reason.description.ar : reason.description.en}
                      </p>
                    </div>

                    {/* Decorative gradient border */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/20 via-transparent to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Separator */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative z-10 w-full px-4">
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center w-full">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yummi-accent/50 to-yummi-accent"></div>
              <div className="mx-4 relative">
                <div className="w-3 h-3 bg-yummi-accent rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-yummi-accent/30 rounded-full animate-ping"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-yummi-accent/50 to-yummi-accent"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
