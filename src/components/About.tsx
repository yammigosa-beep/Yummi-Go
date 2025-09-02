"use client"

import React from 'react'
import { motion } from 'framer-motion'
import useContent from '../hooks/useContent'

export default function About() {
  const { content, lang } = useContent()

  const subtitle = content?.about?.subtitle ? (lang === 'ar' ? content.about.subtitle.ar : content.about.subtitle.en) : 'من نحن'
  const heading = content?.about?.heading ? (lang === 'ar' ? content.about.heading.ar : content.about.heading.en) : 'نحن منصة Yummi Go، متخصصون في ربط شركات الإعاشة بالمصانع'
  const text = content?.about?.text ? (lang === 'ar' ? content.about.text.ar : content.about.text.en) : 'مهمتنا تسهيل وصول وجبات يومية طازجة ومتوازنة للعاملين'
  const ctaText = content?.about?.cta ? (lang === 'ar' ? content.about.cta.ar : content.about.cta.en) : 'اشترك معنا'

  return (<>
    <section id="about" className="relative w-full bg-warm-section py-16">
      {/* Top-right background decorative icon(10) */}
      <img
        src="/icons/icon(10).svg"
        alt="decorative background"
        className="absolute top-0 right-0 w-[420px] h-[420px] opacity-30 pointer-events-none -z-0 animate-about-float"
        style={{ filter: 'brightness(0.5) sepia(1) hue-rotate(-10deg) saturate(4)', mixBlendMode: 'multiply' }}
      />

      {/* Small top-left decorative icon(11) */}
      <img
        src="/icons/icon(11).svg"
        alt="decorative small"
        className="absolute left-[5rem] top-[calc(50%-6rem)] transform -translate-y-1/2 w-24 h-24 opacity-25 pointer-events-none -z-0"
        style={{ filter: 'brightness(0.5) sepia(1) hue-rotate(-10deg) saturate(4)', mixBlendMode: 'multiply' }}
      />
      <div className="max-w-7xl mx-auto px-4">
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          dir="rtl"
        >
          {/* Text Content - Right Side */}
          <div className="order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }}
            >
              <div className="text-center lg:text-right">
                <span className="text-yummi-accent font-cairo text-lg mb-4 block">{subtitle}</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-white font-cairo leading-tight mb-6">
                  {heading}
                </h2>
                <p className="text-white/90 font-cairo text-lg leading-relaxed mb-8">
                  {text}
                </p>
                <button className="bg-yummi-accent hover:bg-yummi-hover text-white px-8 py-3 rounded-full font-cairo font-semibold transition-all duration-300 shadow-lg hover:scale-105">
                  {ctaText}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Image - Left Side */}
          <div className="order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/About/1.jpeg" 
                    alt="Yummi Go Food Service" 
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yummi-accent/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yummi-hover/20 rounded-full blur-lg"></div>
              </div>
            </motion.div>
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
    <style jsx>{`
      @keyframes about-float {
        0% { transform: translateY(0) rotate(-2deg); }
        50% { transform: translateY(-14px) rotate(2deg); }
        100% { transform: translateY(0) rotate(-2deg); }
      }

      @keyframes about-slow-rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .animate-about-float {
        animation: about-float 6s ease-in-out infinite;
        transform-origin: center;
      }
    `}</style>
    </>
  )
}

