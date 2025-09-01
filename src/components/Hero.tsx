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

  const title = content?.home?.title ? (lang === 'ar' ? content.home.title.ar : content.home.title.en) : '...'
  const desc = content?.home?.description ? (lang === 'ar' ? content.home.description.ar : content.home.description.en) : ''
  const ctaText = content?.home?.cta ? (lang === 'ar' ? content.home.cta.ar : content.home.cta.en) : 'تواصل معنا'

  // Hero images array
  const heroImages = [
    '/Hero/1.png',
    '/Hero/2.jpeg',
    '/Hero/3.jpeg',
    '/Hero/4.png',
    '/Hero/5.jpg'
  ]

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
        <img src="/icons/icon(3).svg" alt="decoration" className="absolute top-1/4 right-[35%] w-24 h-24 text-[#57290F] opacity-10 animate-float" style={{ filter: 'brightness(0.5) sepia(1) hue-rotate(-10deg) saturate(5)' }} />
        <img src="/icons/icon (5).svg" alt="decoration" className="absolute top-1/2 left-[5%] w-28 h-28 text-[#57290F] opacity-5 animate-spin-slow" style={{ filter: 'brightness(0.5) sepia(1) hue-rotate(-10deg) saturate(5)' }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center py-8 pt-4">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Text Content */}
            <div className={`${lang === 'ar' ? 'order-2 lg:order-1 text-right' : 'order-2 lg:order-1 text-left'} animate-fade-in`}>
              
              {/* Small Label */}
              <div className={`inline-block mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <span className="text-yummi-accent font-cairo text-sm font-medium tracking-wide">
                  {lang === 'ar' ? 'مرحباً بكم في' : 'Welcome to'}
                </span>
              </div>

              {/* Company Name */}
              <div className={`mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <h2 className="text-2xl md:text-3xl font-bold text-yummi-accent font-cairo">
                  Yummi Go
                </h2>
              </div>

              {/* Main Title */}
              <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6 font-cairo ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                {lang === 'ar' ? (
                  <>
                    <span className="block">حلقة الوصل بين</span>
                    <span className="block text-yummi-accent">المطابخ والمصانع</span>
                  </>
                ) : (
                  <>
                    <span className="block">Connecting</span>
                    <span className="block text-yummi-accent">Kitchens to Factories</span>
                  </>
                )}
              </h1>

              {/* (Description removed per request) keep compact spacing */}
              <div className="mb-6" />

              {/* CTA Button */}
              <div className={`${lang === 'ar' ? 'text-right' : 'text-left'} relative`}>
                <button className="group relative inline-flex items-center justify-center bg-yummi-accent hover:bg-yummi-primary text-white px-12 py-5 rounded-full shadow-2xl font-cairo font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-yummi-accent/25 border-2 border-transparent hover:border-white/20">
                  <span className="relative z-10">{ctaText}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yummi-primary to-yummi-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                </button>
                
                {/* Icon 1 positioned next to CTA button 
                <img 
                  src="/icons/icon(1).svg" 
                  alt="decoration" 
                  className={`absolute top-[0rem] w-28 h-28 text-[#57290F] opacity-20 animate-pulse-slow ${lang === 'ar' ? 'right-[17rem]' : 'left-[17rem]'}`} 
                  style={{ filter: 'brightness(0.5) sepia(1) hue-rotate(-10deg) saturate(5)' }} 
                />*/}
              </div>
            </div>

            {/* Right side - Image Gallery */}
            <div className={`${lang === 'ar' ? 'order-1 lg:order-2' : 'order-1 lg:order-2'} animate-fade-in-delayed`}>
              
              {/* Main Image Box */}
              <div className="relative mb-6">
                <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black/20 backdrop-blur-sm">
                  <img
                    src={heroImages[selectedImage]}
                    alt="Delicious Egyptian Food"
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                  />
                  
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
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-delayed {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.05);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in-delayed 1.2s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </section>
  )
}
