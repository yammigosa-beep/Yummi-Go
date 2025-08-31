"use client"

import React, { useEffect, useRef, useState } from 'react'
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
  const customers = useCount(1200, active)
  const orders = useCount(5400, active)
  const partners = useCount(85, active)

  return (
    <section id="achievements" ref={ref} className="max-w-5xl mx-auto px-4 py-12">
      <motion.div initial="hidden" animate={controls} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
        <h3 className="text-2xl font-semibold">Achievements</h3>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-white rounded shadow hover:shadow-md transform hover:-translate-y-1 transition">
            <div className="text-3xl font-bold text-orange-500 hover:text-orange-600 transition">{customers}</div>
            <div className="text-sm text-gray-600">Customers</div>
          </div>
          <div className="p-6 bg-white rounded shadow hover:shadow-md transform hover:-translate-y-1 transition">
            <div className="text-3xl font-bold text-orange-500 hover:text-orange-600 transition">{orders}</div>
            <div className="text-sm text-gray-600">Orders</div>
          </div>
          <div className="p-6 bg-white rounded shadow hover:shadow-md transform hover:-translate-y-1 transition">
            <div className="text-3xl font-bold text-orange-500 hover:text-orange-600 transition">{partners}</div>
            <div className="text-sm text-gray-600">Partners</div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
