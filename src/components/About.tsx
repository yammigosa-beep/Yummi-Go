"use client"

import React from 'react'
import { motion } from 'framer-motion'
import useContent from '../hooks/useContent'
import useSupabaseImages from '../hooks/useSupabaseImages'

export default function About() {
  const { content, lang } = useContent()
  const { imagesByBucket, loading: imagesLoading, getImageByName } = useSupabaseImages(['About'])

  const subtitle = content?.about?.subtitle ? (lang === 'ar' ? content.about.subtitle.ar : content.about.subtitle.en) : ''
  const heading = content?.about?.heading ? (lang === 'ar' ? content.about.heading.ar : content.about.heading.en) : ''
  const text = content?.about?.text ? (lang === 'ar' ? content.about.text.ar : content.about.text.en) : ''
  const ctaText = content?.about?.cta ? (lang === 'ar' ? content.about.cta.ar : content.about.cta.en) : ''
  const ctaLink = content?.about?.ctaLink || '#services'
  
  // Get About image with proper priority: content.json > Supabase > fallback
  const [aboutImage, setAboutImage] = React.useState<string>('/About/1.jpeg')
  const [imageLoading, setImageLoading] = React.useState(true)

  React.useEffect(() => {
    // Priority 1: Use content.json image if available
    if (content?.about?.image) {
      setAboutImage(content.about.image)
      setImageLoading(true)
      return
    }

    // Priority 2: If Supabase is still loading, keep current image
    if (imagesLoading) return

    // Priority 3: Try to find a Supabase-provided About image using candidate names
    if (imagesByBucket.About) {
      let supabaseImage = getImageByName('about.jpeg', 'About')
      if (!supabaseImage) supabaseImage = getImageByName('1.jpeg', 'About')
      if (!supabaseImage) supabaseImage = getImageByName('about.png', 'About')
      if (!supabaseImage && imagesByBucket.About.length > 0) {
        supabaseImage = imagesByBucket.About[0].url
      }

      if (supabaseImage) {
        setAboutImage(supabaseImage)
        setImageLoading(true)
        return
      }
    }

    // Priority 4: Fallback to local public image
    setAboutImage('/About/1.jpeg')
    setImageLoading(true)
  }, [content?.about?.image, imagesByBucket, imagesLoading, getImageByName])
                     
  const icon10 = content?.assets?.decorativeIcons?.icon10 || '/icons/icon(10).svg'
  const icon11 = content?.assets?.decorativeIcons?.icon11 || '/icons/icon(11).svg'

  return (<>
    <section id="about" className="relative w-full bg-warm-section py-16">
      {/* Top-right background decorative icon(10) */}
      <img
        src={icon10}
        alt="decorative background"
        className="absolute top-0 right-0 w-[420px] h-[420px] opacity-30 pointer-events-none -z-0 animate-about-float icon-decorative-filter"
      />

      {/* Small top-left decorative icon(11) */}
      <img
        src={icon11}
        alt="decorative small"
        className="absolute left-[5rem] top-[calc(50%-6rem)] transform -translate-y-1/2 w-24 h-24 opacity-25 pointer-events-none -z-0 icon-decorative-filter"
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
                <a href={ctaLink}>
                  <button className="bg-yummi-accent hover:bg-yummi-hover text-white px-8 py-3 rounded-full font-cairo font-semibold transition-all duration-300 shadow-lg hover:scale-105">
                    {ctaText}
                  </button>
                </a>
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
                    src={aboutImage} 
                    alt="Yummi Go Food Service" 
                    className={`w-full h-[400px] lg:h-[500px] object-cover transition-opacity duration-300 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setImageLoading(false)}
                    onError={(e) => {
                      // Fallback to local image if the Supabase URL fails
                      const target = e.target as HTMLImageElement
                      if (target.src !== '/About/1.jpeg') {
                        target.src = '/About/1.jpeg'
                      }
                      setImageLoading(false)
                    }}
                  />
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
                      <div className="text-gray-400">Loading...</div>
                    </div>
                  )}
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
    </>
  )
}

