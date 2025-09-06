"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useContent from '../hooks/useContent'
import { useLanguage } from '../providers/language-provider'

export default function Hero() {
  const { content } = useContent()
  const { lang } = useLanguage()
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAutoSliding, setIsAutoSliding] = useState(true)
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const title = content?.hero?.title ? (lang === 'ar' ? content.hero.title.ar : content.hero.title.en) : ''
  const desc = content?.hero?.description ? (lang === 'ar' ? content.hero.description.ar : content.hero.description.en) : ''
  const ctaText = content?.hero?.cta ? (lang === 'ar' ? content.hero.cta.ar : content.hero.cta.en) : ''
  const ctaLink = content?.hero?.ctaLink || 'https://wa.me/966501234567'
  const welcomeText = content?.hero?.welcome ? (lang === 'ar' ? content.hero.welcome.ar : content.hero.welcome.en) : ''
  const companyName = content?.hero?.companyName || 'Yummi Go'

  // Load hero images from content
  useEffect(() => {
    if (content?.hero?.images) {
      setHeroImages(content.hero.images)
      setLoading(false)
    } else {
      // Fallback images
      setHeroImages([
        '/Hero/1.jpeg',
        '/Hero/2.jpeg', 
        '/Hero/3.avif',
        '/Hero/4.webp',
        '/Hero/5.jpeg'
      ])
      setLoading(false)
    }
  }, [content])

  const icon5 = content?.assets?.decorativeIcons?.icon5 || '/icons/icon (5).svg'
  const heroBackground = content?.assets?.heroBackground || '/sp-hero.png'

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoSliding) return
    
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % heroImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoSliding, heroImages.length])

  const handleImageSelect = (index: number) => {
    setSelectedImage(index)
    setIsAutoSliding(false)
    // Resume auto-sliding after 10 seconds
    setTimeout(() => setIsAutoSliding(true), 10000)
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-warm-section">
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
       {/*  <img src="/icons/icon(3).svg" alt="decoration" className="absolute top-1/4 right-[26%] w-24 h-24 opacity-10 animate-float icon-decorative-filter" /> */}
        <img src={icon5} alt="decoration" className="absolute top-1/4 left-[6%] w-28 h-28 opacity-5 animate-spin-slow icon-decorative-filter" />
        
        {/* New decorative icon(9) - top right (larger, no animation) */}
        <svg
          className="absolute top-4 right-2 w-[200px] h-[200px] opacity-30 pointer-events-none -z-0 transform-gpu"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          fill="#57290f28"
          aria-hidden="true"
          style={{ mixBlendMode: 'multiply' }}
        >
          <path d="m256 471.012c-1.326 0-2.598-.527-3.536-1.465l-35.004-35.008c-1.953-1.952-1.953-5.118 0-7.07l206.476-206.473-27.933-27.933-206.471 206.476c-.938.938-2.209 1.465-3.536 1.465s-2.598-.526-3.536-1.465l-35-35c-1.953-1.952-1.953-5.118 0-7.07l206.472-206.477-27.929-27.929-206.475 206.472c-1.953 1.953-5.119 1.952-7.071.001l-35.004-35c-.938-.938-1.465-2.21-1.465-3.536s.527-2.598 1.464-3.535l206.477-206.477-27.929-27.928-206.476 206.471c-1.953 1.953-5.118 1.953-7.071 0-1.953-1.952-1.953-5.118 0-7.071l210.012-210.007c1.953-1.952 5.119-1.952 7.071 0l35 35c1.953 1.953 1.953 5.119 0 7.071l-206.476 206.476 27.933 27.929 206.477-206.472c1.951-1.952 5.119-1.952 7.07 0l35 35c1.953 1.953 1.953 5.119 0 7.071l-206.473 206.476 27.929 27.929 206.473-206.476c.938-.938 2.209-1.464 3.535-1.464s2.598.527 3.535 1.464l35.004 35.004c.938.938 1.465 2.209 1.465 3.536s-.526 2.598-1.465 3.536l-206.476 206.471 27.933 27.936 206.477-206.48c1.951-1.952 5.119-1.952 7.07 0 1.953 1.953 1.953 5.119 0 7.071l-210.012 210.016c-.937.938-2.209 1.465-3.535 1.465z" />
        </svg>
        {/* Hero Background Image - Bottom Left */}
        <img src={heroBackground} alt="hero background" className="absolute bottom-0 left-14 h-96 w-auto opacity-30 object-contain" />

        {/* Large background decorative icon(8) - bottom left, behind content */}
        <svg
          className="absolute bottom-0 right-55 w-[520px] h-[520px] opacity-60 pointer-events-none -z-0 transform-gpu animate-slow-rotate"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          fill="#451d111a"
          aria-hidden="true"
          style={{ mixBlendMode: 'multiply' }}
        >
          <path d="m10.006 33.432c-.001 12.941 10.485 23.427 23.426 23.431 12.948-.004 23.43-10.489 23.43-23.431 0-12.943-10.487-23.432-23.43-23.428l-23.432.002z"/>
          <path d="m89.99 66.569c.003-12.939-10.485-23.431-23.421-23.431-12.949 0-23.433 10.494-23.433 23.434 0 12.937 10.49 23.428 23.433 23.425h23.431z"/>
          <circle cx="76.667" cy="23.334" r="13.333"/>
          <path d="m33.333 78.333c0 6.442-5.227 11.667-11.67 11.667-6.442 0-11.663-5.225-11.663-11.667 0-6.441 5.221-11.666 11.664-11.666s11.669 5.225 11.669 11.666z"/>
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center py-8 pt-4">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-12 items-center">
            
            {/* Left side - Text Content */}
            <div className={`${lang === 'ar' ? 'order-1 lg:order-1 text-right' : 'order-1 lg:order-1 text-left'} animate-fade-in`}>
              
              {/* Small Label */}
              <div className={`inline-block mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <span className="text-yummi-accent font-cairo text-sm font-medium tracking-wide">
                  {welcomeText}
                </span>
              </div>

              {/* Company Name */}
              <div className={`mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <h2 className="text-2xl md:text-3xl font-bold text-yummi-accent font-cairo">
                  {companyName}
                </h2>
              </div>

              {/* Main Title */}
              <h1 className={`text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6 font-cairo ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                {lang === 'ar' ? (
                  <>
                    <span className="block">{title?.line1 || 'حلقة الوصل بين'}</span>
                    <span className="inline-block text-yummi-accent whitespace-nowrap text-2xl md:text-4xl lg:text-5xl">{title?.line2 || 'المطابخ والمصانع والشركات'}</span>
                  </>
                ) : (
                  <>
                    <span className="block">{title?.line1 || 'Connecting'}</span>
                    <span className="block text-yummi-accent">{title?.line2 || 'Kitchens to Factories'}</span>
                  </>
                )}
              </h1>

              {/* (Description removed per request) keep compact spacing */}
              <div className="mb-6" />

              {/* CTA Button - desktop only (hidden on mobile) */}
              <div className={`${lang === 'ar' ? 'text-right' : 'text-left'} relative hidden lg:block`}>
                <div className="relative inline-block">
                  <a href={ctaLink} target="_blank" rel="noopener noreferrer">
                    <button className="group relative inline-flex items-center justify-center bg-yummi-accent hover:bg-yummi-primary text-white px-12 py-5 rounded-full shadow-2xl font-cairo font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-yummi-accent/25 border-2 border-transparent hover:border-white/20">
                      <span className="relative z-10">{ctaText}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yummi-primary to-yummi-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Right side - Image Gallery */}
            <div className={`${lang === 'ar' ? 'order-2 lg:order-2' : 'order-2 lg:order-2'} animate-fade-in-delayed`}>
              
              {/* Main Image Box */}
              <div className="relative mb-6">
                <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black/20 backdrop-blur-sm">
                  {loading ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yummi-accent border-t-transparent mx-auto mb-4"></div>
                        <p className="text-sm opacity-70">Loading images...</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={heroImages[selectedImage]}
                      alt="Delicious Egyptian Food"
                      className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        const src = img.src;
                        
                        // First attempt: Add cache-busting parameter if not already present
                        if (!src.includes('cb=')) {
                          const sep = src.includes('?') ? '&' : '?';
                          img.src = `${src}${sep}cb=${Date.now()}`;
                          return;
                        }
                        
                        // Final fallback to local default image
                        const fallbackImages = ['/Hero/1.jpeg', '/Hero/2.jpeg', '/Hero/3.avif', '/Hero/4.webp', '/Hero/5.jpeg'];
                        const fallbackImage = fallbackImages[selectedImage] || fallbackImages[0];
                        if (img.src !== fallbackImage) {
                          img.src = fallbackImage;
                        }
                      }}
                    />
                  )}
                  
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={() => handleImageSelect((selectedImage - 1 + heroImages.length) % heroImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
                  >
                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleImageSelect((selectedImage + 1) % heroImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
                  >
                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Image Slider Thumbnails */}
              <div className="relative">
                <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-6">
                  {heroImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`flex-shrink-0 relative w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden border-3 transition-all duration-300 transform hover:scale-105 ${
                        selectedImage === index
                          ? 'border-yummi-accent shadow-lg shadow-yummi-accent/30 scale-105'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Food ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          const src = img.src;
                          
                          // First attempt: Add cache-busting parameter if not already present
                          if (!src.includes('cb=')) {
                            const sep = src.includes('?') ? '&' : '?';
                            img.src = `${src}${sep}cb=${Date.now()}`;
                            return;
                          }
                          
                          // Final fallback to local default image
                          const fallbackImages = ['/Hero/1.jpeg', '/Hero/2.jpeg', '/Hero/3.avif', '/Hero/4.webp', '/Hero/5.jpeg'];
                          const fallbackImage = fallbackImages[index] || fallbackImages[0];
                          if (img.src !== fallbackImage) {
                            img.src = fallbackImage;
                          }
                        }}
                      />
                      
                      {/* Selection indicator */}
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-yummi-accent/20 flex items-center justify-center">
                          <div className="w-3 h-3 bg-yummi-accent rounded-full animate-pulse" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>


                {/* Scroll indicator for thumbnails */}
                <div className="absolute top-full mt-3 left-0 right-0 flex justify-center pointer-events-none">
                  <div className="flex items-center gap-2">
                    {heroImages.map((_, index) => (
                      <div
                        key={index}
                        className={`transition-all duration-300 pointer-events-auto ${
                          selectedImage === index
                            ? 'w-6 h-2 rounded-full bg-yummi-accent shadow-lg ring-2 ring-yummi-accent/20'
                            : 'w-3 h-1.5 rounded-full bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile CTA: show at bottom of section on small screens */}
          <div className="mt-8 lg:hidden flex justify-center px-8">
            <a href={ctaLink} target="_blank" rel="noopener noreferrer">
              <button className="group relative inline-flex items-center justify-center bg-yummi-accent hover:bg-yummi-primary text-white px-8 py-4 rounded-full shadow-2xl font-cairo font-bold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-yummi-accent/25 border-2 border-transparent hover:border-white/20">
                <span className="relative z-10">{ctaText}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yummi-primary to-yummi-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              </button>
            </a>
          </div>
        </div>

  {/* Scroll indicator - hidden on small screens (mobile) */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}