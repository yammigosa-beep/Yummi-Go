"use client"

import React from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  const contactMethods = [
    {
      title: "رقم الهاتف / الواتساب",
      value: "+966 50 123 4567",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      ),
      link: "tel:+966501234567"
    },
    {
      title: "البريد الإلكتروني", 
      value: "info@yummigo.sa",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      link: "mailto:info@yummigo.sa"
    }
  ]

  return (
    <section id="contact" className="relative py-16 bg-warm-section overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Circle */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yummi-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-yummi-primary/5 rounded-full blur-2xl" />
        
        {/* Food-inspired shapes */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-yummi-accent/10 to-yummi-primary/10 rounded-full blur-xl" />
        <div className="absolute bottom-1/3 left-1/5 w-24 h-24 bg-yummi-accent/8 rounded-full blur-lg" />
        
        {/* Geometric shapes */}
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-yummi-primary/10 rotate-45 rounded-lg blur-sm" />
        <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-yummi-accent/10 rotate-12 rounded-xl blur-md" />
        
        {/* Dotted pattern */}
        <div className="absolute top-20 left-20 opacity-20">
          <div className="grid grid-cols-4 gap-3">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-yummi-accent/30 rounded-full" />
            ))}
          </div>
        </div>

        {/* Custom Icons with animations */}
        <img src="/icons/icon(3).svg" alt="decoration" className="absolute top-1/4 right-[15%] w-24 h-24 text-[#57290F] opacity-10 animate-float" style={{ filter: 'brightness(0.5) sepia(1) hue-rotate(-10deg) saturate(5)' }} />
        <img src="/icons/icon (5).svg" alt="decoration" className="absolute top-1/2 left-[5%] w-28 h-28 text-[#57290F] opacity-5 animate-spin-slow" style={{ filter: 'brightness(0.5) sepia(1) hue-rotate(-10deg) saturate(5)' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-cairo">
              تواصل معنا
            </h2>
            <div className="w-24 h-1 bg-yummi-accent mx-auto mb-6"></div>
            
            <div className="max-w-2xl mx-auto text-center mb-8">
              <p className="text-lg text-white/90 font-cairo leading-relaxed mb-4">
                هل ترغب في توفير وجبات يومية مريحة وصحية لموظفيك؟
              </p>
              <p className="text-lg text-white/90 font-cairo leading-relaxed">
                تواصل معنا الآن ودعنا نصمم لك الحل الأنسب:
              </p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <a
                  href={method.link}
                  className="group block p-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] border border-white/20 hover:border-yummi-accent/50"
                >
                  <div className="text-center">
                    {/* Icon */}
                    <div className="text-yummi-accent mb-4 transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
                      {method.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 font-cairo group-hover:text-yummi-accent transition-colors duration-300">
                      {method.title}
                    </h3>
                    
                    {/* Value */}
                    <p className="text-white/90 font-cairo text-lg font-medium group-hover:text-yummi-accent transition-colors duration-300">
                      {method.value}
                    </p>
                  </div>

                  {/* Subtle bottom border accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yummi-accent to-yummi-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </a>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center">
              <a
                href="https://wa.me/966501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center bg-yummi-accent hover:bg-yummi-primary text-white px-12 py-5 rounded-full shadow-2xl font-cairo font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-yummi-accent/25 border-2 border-transparent hover:border-white/20"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.488"/>
                  </svg>
                  تواصل معنا
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yummi-primary to-yummi-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              </a>
            </div>
          </motion.div>
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
              {/* Left decorative line */}
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yummi-accent/50 to-yummi-accent"></div>
              
              {/* Center decorative element */}
              <div className="mx-4 relative">
                <div className="w-3 h-3 bg-yummi-accent rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-yummi-accent/30 rounded-full animate-ping"></div>
              </div>
              
              {/* Right decorative line */}
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-yummi-accent/50 to-yummi-accent"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
