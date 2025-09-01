"use client"

import React from 'react'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="w-full bg-warm-section py-16">
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
                <span className="text-yummi-accent font-cairo text-lg mb-4 block">من نحن</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-white font-cairo leading-tight mb-6">
                  نحن منصة Yummi Go، متخصصون في ربط شركات الإعاشة بالمصانع
                </h2>
                <p className="text-white/90 font-cairo text-lg leading-relaxed mb-8">
                  مهمتنا تسهيل وصول وجبات يومية طازجة ومتوازنة للعاملين، عبر مطابخ معتمدة وشركاء موثوقين، 
                  وباشتراكات مرنة تناسب احتياجات كل مصنع. نحرص على الجودة، الالتزام بالمواعيد، 
                  وتقديم خدمة موثوقة تُخفف عبء الإعاشة عن إدارتكم.
                </p>
                <button className="bg-yummi-accent hover:bg-yummi-hover text-white px-8 py-3 rounded-full font-cairo font-semibold transition-all duration-300 shadow-lg hover:scale-105">
                  اشترك معنا
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
                    src="/Hero/2.jpeg" 
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
  )
}

