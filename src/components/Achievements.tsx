"use client"

import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import useContent from '../hooks/useContent'

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
  const { content, lang } = useContent()

  useEffect(() => {
    if (inView) controls.start('visible')
  }, [inView, controls])

  const active = inView
  const achievements = content?.achievements?.items || []
  const backgroundImage = content?.achievements?.backgroundImage || '/Achievements_BG.jpeg'

  // Get count values for each achievement (fixed number of hooks)
  const count1 = useCount(achievements[0]?.value || 0, active)
  const count2 = useCount(achievements[1]?.value || 0, active)
  const count3 = useCount(achievements[2]?.value || 0, active)
  const count4 = useCount(achievements[3]?.value || 0, active)
  
  const counts = [count1, count2, count3, count4]

  return (
    <section 
      id="achievements" 
      ref={ref} 
      dir="rtl" 
      className="w-full py-16 relative"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
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
            {achievements.map((achievement, index) => {
              const value = counts[index] || 0
              const label = lang === 'ar' ? achievement.label.ar : achievement.label.en
              const isLast = index === achievements.length - 1

              return (
                <div key={index} className="text-center relative">
                  <div className="flex flex-col items-center">
                    <span className="text-5xl md:text-6xl font-bold text-white font-cairo mb-2">
                      +{achievement.value === 1000 ? value.toLocaleString() : value}
                    </span>
                    <span className="text-lg text-white font-cairo font-semibold">
                      {label}
                    </span>
                  </div>
                  {/* Vertical separator */}
                  {!isLast && (
                    <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-yummi-accent to-transparent"></div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
