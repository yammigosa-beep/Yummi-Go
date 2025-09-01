"use client"

import React from 'react'
import { motion } from 'framer-motion'

export default function Services() {
  const services = [
    "وجبات يومية طازجة ومتنوعة.",
    "اشتراكات مرنة (يومي، أسبوعي، شهري).",
    "توصيل دقيق يراعي مواعيد العمل بالمصانع.",
    "خيارات غذائية تناسب مختلف الأذواق والحميات.",
    "تغليف آمن يحافظ على جودة الطعام وسلامته."
  ]

  return (
    <section id="services" className="py-16 bg-warm-section">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-cairo">
              خدماتنا
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-[1.02] border border-white/20">
                  <div className="flex-shrink-0 w-3 h-3 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-lg text-white/90 font-cairo leading-relaxed text-right flex-1">
                    {service}
                  </p>
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
