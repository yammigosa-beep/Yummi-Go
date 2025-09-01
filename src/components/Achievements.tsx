"use client"

import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

function useCount(end: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const duration = 1200
    const stepTime = 16
    const steps = Math.ceil(duration / stepTime)
    const increment = end / steps
    const t = setInterval(() => {
      start += increment
      if (start >= end) {
        setValue(end)
        clearInterval(t)
      } else {
        setValue(Math.floor(start))
      }
    }, stepTime)
    return () => clearInterval(t)
  }, [end, active])
  return value
}

export default function Achievements() {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) controls.start('visible')
  }, [inView, controls])

  const active = inView
  const years = useCount(20, active)
  const chefs = useCount(10, active) 
  const dailyMeals = useCount(1000, active)
  const events = useCount(50, active)

  return (
    <section 
      id="achievements" 
      ref={ref} 
      dir="rtl" 
      className="w-full py-16 relative"
      style={{
        backgroundImage: 'url("/Achievements_BG.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Light overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{ 
            hidden: { opacity: 0, y: 30 }, 
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0 max-w-6xl mx-auto">
            {/* Years of Experience */}
            <div className="text-center relative">
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl font-bold text-white font-cairo mb-2">
                  +{years}
                </span>
                <span className="text-lg text-white font-cairo font-semibold">
                  سنوات من الخبرة
                </span>
              </div>
              {/* Vertical separator */}
              <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-orange-400 to-transparent"></div>
            </div>

            {/* Professional Chefs */}
            <div className="text-center relative">
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl font-bold text-white font-cairo mb-2">
                  +{chefs}
                </span>
                <span className="text-lg text-white font-cairo font-semibold">
                  شيفات محترفين
                </span>
              </div>
              {/* Vertical separator */}
              <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-orange-400 to-transparent"></div>
            </div>

            {/* Daily Meals */}
            <div className="text-center relative">
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl font-bold text-white font-cairo mb-2">
                  +{dailyMeals.toLocaleString()}
                </span>
                <span className="text-lg text-white font-cairo font-semibold">
                  وجبة تُحضر يومياً
                </span>
              </div>
              {/* Vertical separator */}
              <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-orange-400 to-transparent"></div>
            </div>

            {/* Successful Events */}
            <div className="text-center relative">
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl font-bold text-white font-cairo mb-2">
                  +{events}
                </span>
                <span className="text-lg text-white font-cairo font-semibold">
                  فعالية ومناسبة ناجحة
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
