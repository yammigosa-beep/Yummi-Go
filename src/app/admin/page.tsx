"use client"

import React, { useEffect, useState } from 'react'
import { ImageManager } from '../../components/ImageManager'

interface ContentData {
  [key: string]: any
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [pw, setPw] = useState('')
  const [content, setContent] = useState<ContentData | null>(null)
  const [editMode, setEditMode] = useState<'sections' | 'raw'>('sections')
  const [rawContent, setRawContent] = useState('')
  const [status, setStatus] = useState('')
  const [activeSection, setActiveSection] = useState('hero')
  const [adminApiKey, setAdminApiKey] = useState('')
  const [activeImageField, setActiveImageField] = useState<{
    section: string
    field: string
    index?: number
  } | null>(null)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        setContent(data)
        setRawContent(JSON.stringify(data, null, 2))
      })
      .catch(() => setStatus('Failed to load content'))
  }, [])

  async function doLogin(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Logging in...')
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: pw }),
      })
      
      if (response.ok) {
        const { apiKey } = await response.json()
        setAdminApiKey(apiKey)
        setLoggedIn(true)
        setStatus('')
        setPw('')
      } else {
        setStatus('Incorrect password')
      }
    } catch (error) {
      setStatus('Login failed. Please try again.')
    }
  }

  async function save() {
    setStatus('Saving...')
    try {
      let dataToSave: ContentData

      if (editMode === 'raw') {
        dataToSave = JSON.parse(rawContent)
      } else {
        dataToSave = content!
      }

      // Save to localStorage
      localStorage.setItem('content', JSON.stringify(dataToSave))

      // POST to API with admin key
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminApiKey
        },
        body: JSON.stringify(dataToSave)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Save failed')
      }

  setStatus('Saved successfully')
      setTimeout(() => setStatus(''), 3000)
    } catch (err: any) {
  setStatus('Error: ' + (err.message || 'Invalid JSON'))
    }
  }

  const updateValue = (path: string, value: any) => {
    if (!content) return
    
    setContent(prev => {
      if (!prev) return prev
      const updated = { ...prev }
      const keys = path.split('.')
      let current = updated

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (key.includes('[') && key.includes(']')) {
          const [arrayKey, indexStr] = key.split('[')
          const index = parseInt(indexStr.replace(']', ''))
          if (!current[arrayKey]) current[arrayKey] = []
          if (!current[arrayKey][index]) current[arrayKey][index] = {}
          current = current[arrayKey][index]
        } else {
          if (!current[key]) current[key] = {}
          current = current[key]
        }
      }

      const lastKey = keys[keys.length - 1]
      if (lastKey.includes('[') && lastKey.includes(']')) {
        const [arrayKey, indexStr] = lastKey.split('[')
        const index = parseInt(indexStr.replace(']', ''))
        if (!current[arrayKey]) current[arrayKey] = []
        current[arrayKey][index] = value
      } else {
        current[lastKey] = value
      }

      return updated
    })
  }

  const handleImageSelect = (imageUrl: string) => {
    if (activeImageField) {
      const { section, field, index } = activeImageField
      let path: string

      if (typeof index !== 'undefined') {
        path = `${section}.${field}[${index}]`
      } else {
        path = `${section}.${field}`
      }

      updateValue(path, imageUrl)
      setActiveImageField(null)
    }
  }

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-warm-section flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border-2 border-yummi-accent/10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-yummi-primary rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-yummi-primary mb-2 font-cairo">Admin Panel</h1>
            <p className="text-text-body font-cairo">Yummi Go Content Management</p>
          </div>
          <form onSubmit={doLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-yummi-primary mb-2 font-cairo">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Enter admin password"
                className="w-full p-4 border-2 border-bg-light-gray rounded-xl font-cairo focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white text-gray-900 placeholder-gray-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yummi-accent hover:bg-yummi-hover text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yummi-accent/25 font-cairo"
            >
              Login
            </button>
          </form>
          {status && (
            <p className="mt-4 text-sm text-center text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 font-cairo">
              {status}
            </p>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-warm-section">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Main Content Container */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8 border-2 border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 font-cairo">Content Management System</h1>
              <p className="text-gray-600 font-cairo">Manage your Yummi Go platform content</p>
            </div>
            <button
              onClick={() => {
                setLoggedIn(false)
                setPw('')
                setStatus('')
              }}
              className="text-red-500 hover:text-red-700 font-semibold font-cairo bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all duration-300"
            >
              Logout
            </button>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setEditMode('sections')}
              className={`px-6 py-3 rounded-xl font-bold font-cairo transition-all duration-300 ${
                editMode === 'sections'
                  ? 'bg-yummi-accent text-white shadow-lg transform scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-yummi-accent hover:text-white hover:transform hover:scale-105'
              }`}
            >
              Visual Editor
            </button>
            <button
              onClick={() => setEditMode('raw')}
              className={`px-6 py-3 rounded-xl font-bold font-cairo transition-all duration-300 ${
                editMode === 'raw'
                  ? 'bg-yummi-accent text-white shadow-lg transform scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-yummi-accent hover:text-white hover:transform hover:scale-105'
              }`}
            >
              Raw JSON Editor
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={save}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 font-cairo"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('content')
                setStatus('Local cache cleared')
                setTimeout(() => setStatus(''), 3000)
              }}
              className="bg-yummi-primary hover:bg-yummi-hover text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yummi-primary/25 font-cairo"
            >
              Clear Cache
            </button>
          </div>

          {/* Status */}
          {status && (
            <p className={`mt-6 p-4 rounded-xl text-sm font-semibold font-cairo ${
              status.includes('Saved successfully') ? 'bg-green-50 text-green-800 border border-green-200' :
                status.includes('Error:') ? 'bg-red-50 text-red-800 border border-red-200' :
                status.includes('Local cache cleared') ? 'bg-blue-50 text-blue-800 border border-blue-200' :
              'bg-yellow-50 text-yellow-800 border border-yellow-200'
            }`}>
              {status}
            </p>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {editMode === 'sections' ? (
            <>
              {/* Section Navigation */}
              <div className="col-span-3">
                <div className="bg-white rounded-xl shadow-xl p-6 sticky top-4 border-2 border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-6 text-lg font-cairo">Sections</h3>
                  <nav className="space-y-3">
                    {Object.keys(content || {}).map((section) => (
                      <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-semibold font-cairo transition-all duration-300 capitalize ${
                          activeSection === section
                            ? 'bg-yummi-accent text-white shadow-lg transform scale-105'
                            : 'text-gray-700 hover:bg-yummi-accent hover:text-white hover:transform hover:scale-105 bg-gray-50'
                        }`}
                      >
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Section Editor */}
              <div className="col-span-9">
                <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-gray-200">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 capitalize font-cairo">
                    {activeSection.replace(/([A-Z])/g, ' $1').trim()} Section
                  </h2>
                  
                  {content && <AdvancedSectionEditor 
                    section={activeSection}
                    data={content[activeSection]}
                    onUpdate={updateValue}
                    adminApiKey={adminApiKey}
                    setStatus={setStatus}
                    onImageFieldClick={(field, index, bucket, overwrite) => {
                      // set globals so ImageManager knows which supabase bucket to use
                      if (typeof window !== 'undefined') {
                        ;(window as any).__CURRENT_IMAGE_BUCKET = bucket || (activeSection.toLowerCase() === 'about' ? 'About' : 'Hero')
                        ;(window as any).__CURRENT_IMAGE_OVERWRITE = !!overwrite
                      }
                      setActiveImageField({ section: activeSection, field, index })
                    }}
                  />}
                </div>
              </div>
            </>
          ) : (
            /* Raw JSON Editor */
            <div className="col-span-12">
              <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 font-cairo">Raw JSON Editor</h2>
                <textarea
                  rows={25}
                  className="w-full p-6 border-2 border-gray-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-gray-50 text-gray-900"
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  placeholder="Edit the raw JSON content..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Manager Modal */}
      {activeImageField && (
        <ImageManager
          onImageSelect={handleImageSelect}
          currentImage={getNestedValue(content, activeImageField)}
          bucket={activeImageField.section.toLowerCase() === 'about' ? 'About' : 'Hero'}
          onClose={() => setActiveImageField(null)}
          adminApiKey={adminApiKey}
        />
      )}
    </main>
  )
}

// Helper function to get nested values
function getNestedValue(obj: any, field: { section: string, field: string, index?: number }): string {
  if (!obj || !obj[field.section]) return ''
  
  const sectionData = obj[field.section]
  const fieldParts = field.field.split('.')
  let value = sectionData

  for (const part of fieldParts) {
    if (!value) return ''
    value = value[part]
  }

  if (typeof field.index !== 'undefined' && Array.isArray(value)) {
    return value[field.index] || ''
  }

  return value || ''
}

// Advanced Section Editor Component
function AdvancedSectionEditor({ 
  section, 
  data, 
  onUpdate, 
  onImageFieldClick,
  adminApiKey,
  setStatus
}: {
  section: string
  data: any
  onUpdate: (path: string, value: any) => void
  onImageFieldClick: (field: string, index?: number, bucket?: string, overwrite?: boolean) => void
  adminApiKey: string
  setStatus: (status: string) => void
}) {
  const renderField = (fieldPath: string, value: any, label: string): React.ReactNode => {
    const fullPath = section + '.' + fieldPath

    // Handle image fields
    if (fieldPath.includes('image') || fieldPath.includes('icon') || fieldPath.includes('logo') || fieldPath.includes('Background')) {
      return (
        <div key={fieldPath} className="mb-8">
          <label className="block text-sm font-bold text-gray-800 mb-3 font-cairo">{label}</label>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            {value && (
              <img
                src={value}
                alt={label}
                className="w-24 h-24 object-cover rounded-xl border-2 border-yummi-accent/30 shadow-lg"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement
                  img.style.display = 'none'
                }}
              />
            )}
            <div className="flex flex-col gap-3">
              {/* Upload new image for About section */}
              {section === 'about' && (
                <div className="flex gap-2 flex-col">
                  <div className="relative">
                    <p className="text-xs text-gray-600 mb-2 font-cairo">
                      Upload a new image to replace the current About section image
                      <br/>
                      <span className="text-gray-500">Supported: JPEG, PNG, WebP, AVIF (max 5MB)</span>
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        setStatus('Uploading image...')

                        try {
                          const formData = new FormData()
                          formData.append('file', file)
                          formData.append('bucket', 'About')
                          formData.append('overwrite', 'true')

                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            headers: {
                              'x-admin-key': adminApiKey
                            },
                            body: formData
                          })

                          if (response.ok) {
                            const result = await response.json()
                            onUpdate(fullPath, result.url)
                            setStatus('Image uploaded and updated successfully. New URL: ' + result.url)
                            setTimeout(() => setStatus(''), 5000)
                          } else {
                            const error = await response.json()
                            setStatus('Upload failed: ' + (error.error || 'Unknown error'))
                            setTimeout(() => setStatus(''), 5000)
                          }
                        } catch (error: any) {
                          setStatus('Upload failed: ' + error.message)
                          setTimeout(() => setStatus(''), 5000)
                        }

                        // Clear the file input
                        e.target.value = ''
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id={`upload-${fieldPath}`}
                    />
                    <label
                      htmlFor={`upload-${fieldPath}`}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg font-cairo transition-all duration-300 cursor-pointer inline-block border-2 border-purple-600 hover:border-purple-700 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                    >
                      Upload New About Image
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          {value && (
            <div className="mt-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1 font-cairo">Manual URL Edit:</label>
              <input
                type="text"
                className="w-full p-3 text-sm border-2 border-gray-300 rounded-xl bg-white font-cairo focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 text-gray-900"
                value={value}
                onChange={(e) => onUpdate(fullPath, e.target.value)}
                placeholder="https://tmgbrmkzagzfjdjmtifo.supabase.co/storage/v1/object/public/About/about.jpeg"
              />
            </div>
          )}
        </div>
      )
    }

    // Handle bilingual text fields
    if (typeof value === 'object' && value && value.ar && value.en) {
      return (
        <div key={fieldPath} className="mb-8">
          <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">{label}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 font-cairo">Arabic</label>
              <textarea
                rows={4}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                value={value.ar}
                onChange={(e) => onUpdate(fullPath + '.ar', e.target.value)}
                placeholder="النص العربي..."
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 font-cairo">English</label>
              <textarea
                rows={4}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                value={value.en}
                onChange={(e) => onUpdate(fullPath + '.en', e.target.value)}
                placeholder="English text..."
              />
            </div>
          </div>
        </div>
      )
    }
    
    // Handle string fields
    if (typeof value === 'string') {
      return (
        <div key={fieldPath} className="mb-6">
          <label className="block text-sm font-bold text-gray-800 mb-3 font-cairo">{label}</label>
          <input
            type="text"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
            value={value}
            onChange={(e) => onUpdate(fullPath, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        </div>
      )
    }
    
    // Handle number fields
    if (typeof value === 'number') {
      return (
        <div key={fieldPath} className="mb-6">
          <label className="block text-sm font-bold text-gray-800 mb-3 font-cairo">{label}</label>
          <input
            type="number"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
            value={value}
            onChange={(e) => onUpdate(fullPath, parseInt(e.target.value) || 0)}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        </div>
      )
    }
    
    return null
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return (
      <div className="space-y-8">
        {data.map((item, index) => (
          <div key={index} className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50 shadow-lg">
            <h4 className="font-bold text-gray-800 mb-6 text-lg font-cairo">Item {index + 1}</h4>
            {Object.entries(item).map(([key, value]) => {
              if (key.includes('image') || key.includes('icon') || key === 'slides' || key.includes('Background')) {
                if (Array.isArray(value)) {
                  return (
                    <div key={key} className="mb-6">
                      <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {value.map((imageUrl, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`${key} ${imgIndex + 1}`}
                              className="w-full h-28 object-cover rounded-xl border-2 border-yummi-accent/30 cursor-pointer shadow-lg group-hover:shadow-xl transition-all duration-300"
                              onClick={() => onImageFieldClick(`items[${index}].${key}`, imgIndex, section === 'about' ? 'About' : 'Hero', section === 'about')}
                            />
                            <button
                              onClick={() => onImageFieldClick(`items[${index}].${key}`, imgIndex, section === 'about' ? 'About' : 'Hero', section === 'about')}
                              className="absolute inset-0 bg-black bg-opacity-60 text-white text-sm font-bold font-cairo rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                            >
                              Change
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                } else {
                  return renderField(`items[${index}].${key}`, value, key.charAt(0).toUpperCase() + key.slice(1))
                }
              }
              return renderField(`items[${index}].${key}`, value, key.charAt(0).toUpperCase() + key.slice(1))
            })}
          </div>
        ))}
      </div>
    )
  }

  // Handle objects
  if (typeof data === 'object' && data !== null) {
    // Special handling for complex objects like hero.title with nested structure
    if (section === 'hero' && data.title && (data.title as any).en && (data.title as any).en.line1) {
      return (
        <div className="space-y-6">
          {Object.entries(data).map(([key, value]) => {
            if (key === 'title' && typeof value === 'object' && value && (value as any).en && (value as any).en.line1) {
              // Special handling for hero title with line1, line2 structure
              const titleValue = value as { ar?: { line1?: string, line2?: string }, en?: { line1?: string, line2?: string } }
              return (
                <div key={key} className="mb-8">
                  <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">Title Lines</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-xs font-semibold text-gray-700 font-cairo">Arabic</label>
                      <input
                        type="text"
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                        value={titleValue.ar?.line1 || ''}
                        onChange={(e) => onUpdate(`${section}.title.ar.line1`, e.target.value)}
                        placeholder="السطر الأول"
                        dir="rtl"
                      />
                      <input
                        type="text"
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                        value={titleValue.ar?.line2 || ''}
                        onChange={(e) => onUpdate(`${section}.title.ar.line2`, e.target.value)}
                        placeholder="السطر الثاني"
                        dir="rtl"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-semibold text-gray-700 font-cairo">English</label>
                      <input
                        type="text"
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                        value={titleValue.en?.line1 || ''}
                        onChange={(e) => onUpdate(`${section}.title.en.line1`, e.target.value)}
                        placeholder="Line 1"
                      />
                      <input
                        type="text"
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                        value={titleValue.en?.line2 || ''}
                        onChange={(e) => onUpdate(`${section}.title.en.line2`, e.target.value)}
                        placeholder="Line 2"
                      />
                    </div>
                  </div>
                </div>
              )
            }
              // Provide a combined CTA editor (text + link) and skip separate ctaLink rendering
              if (key === 'cta') {
                const ctaVal = value as { ar?: string, en?: string }
                return (
                  <div key={key} className="mb-8">
                    <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">CTA</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700 font-cairo">Arabic</label>
                        <input
                          type="text"
                          className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                          value={ctaVal?.ar || ''}
                          onChange={(e) => onUpdate(`${section}.cta.ar`, e.target.value)}
                          placeholder="نص الزر بالعربية"
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700 font-cairo">English</label>
                        <input
                          type="text"
                          className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                          value={ctaVal?.en || ''}
                          onChange={(e) => onUpdate(`${section}.cta.en`, e.target.value)}
                          placeholder="CTA button text"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-bold text-gray-800 mb-3 font-cairo">CTA Link</label>
                      <input
                        type="text"
                        className="w-full p-3 text-sm border-2 border-gray-300 rounded-xl bg-white font-cairo focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 text-gray-900"
                        value={(data as any).ctaLink || ''}
                        onChange={(e) => onUpdate(`${section}.ctaLink`, e.target.value)}
                        placeholder="https://example.com or https://wa.me/..."
                      />
                    </div>
                  </div>
                )
              }

              // Special handling for Hero Images - create individual fields for each of the 5 images
              if (key === 'images' && Array.isArray(value)) {
                return (
                  <div key={key} className="mb-8">
                    <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">Hero Images (5 Images)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[0, 1, 2, 3, 4].map((imageIndex) => {
                        const imageUrl = value[imageIndex] || ''
                        return (
                          <div key={imageIndex} className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50 shadow-lg">
                            <h4 className="font-bold text-gray-800 text-lg mb-4 font-cairo text-center">
                              Hero Image {imageIndex + 1}
                            </h4>

                            {/* Image Preview */}
                            <div className="mb-4">
                              <div className="w-full h-48 bg-gray-200 rounded-xl overflow-hidden border-2 border-gray-300 flex items-center justify-center">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={`Hero Image ${imageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const img = e.currentTarget as HTMLImageElement
                                      img.src = '/Hero/placeholder.jpg' // Fallback image
                                      img.style.opacity = '0.5'
                                    }}
                                  />
                                ) : (
                                  <div className="text-center text-gray-500">
                                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    <p className="text-sm">No image</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Image URL Input */}
                            <div className="mb-4">
                              <label className="block text-xs font-semibold text-gray-700 mb-2 font-cairo">Image URL:</label>
                              <input
                                type="text"
                                className="w-full p-3 text-sm border-2 border-gray-300 rounded-xl bg-white font-cairo focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 text-gray-900"
                                value={imageUrl}
                                onChange={(e) => {
                                  const newArr = [...value]
                                  while (newArr.length <= imageIndex) {
                                    newArr.push('')
                                  }
                                  newArr[imageIndex] = e.target.value
                                  onUpdate(`${section}.${key}`, newArr)
                                }}
                                placeholder={`https://tmgbrmkzagzfjdjmtifo.supabase.co/storage/v1/object/public/Hero/${imageIndex + 1}.jpeg`}
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                              {/* Upload New Image */}
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,image/avif"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return

                                    setStatus(`Uploading Hero Image ${imageIndex + 1}...`)

                                    try {
                                      const formData = new FormData()
                                      formData.append('file', file)
                                      formData.append('bucket', 'Hero')
                                      formData.append('fileName', `${imageIndex + 1}`)

                                      const response = await fetch('/api/upload', {
                                        method: 'POST',
                                        headers: {
                                          'x-admin-key': adminApiKey
                                        },
                                        body: formData
                                      })

                                      if (response.ok) {
                                        const result = await response.json()
                                        const newArr = [...value]
                                        while (newArr.length <= imageIndex) {
                                          newArr.push('')
                                        }
                                        newArr[imageIndex] = result.url
                                        onUpdate(`${section}.${key}`, newArr)
                                        setStatus(`Hero Image ${imageIndex + 1} uploaded successfully!`)
                                        setTimeout(() => setStatus(''), 3000)
                                      } else {
                                        const error = await response.json()
                                        setStatus('Upload failed: ' + (error.error || 'Unknown error'))
                                        setTimeout(() => setStatus(''), 5000)
                                      }
                                    } catch (error: any) {
                                      setStatus('Upload failed: ' + error.message)
                                      setTimeout(() => setStatus(''), 5000)
                                    }

                                    e.target.value = ''
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  id={`upload-hero-${imageIndex}`}
                                />
                                <label
                                  htmlFor={`upload-hero-${imageIndex}`}
                                  className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-xl font-cairo transition-all duration-300 cursor-pointer inline-block text-center border-2 border-purple-600 hover:border-purple-700 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                                >
                                  Upload Image
                                </label>
                              </div>

                              {/* Quick Set Buttons */}
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => {
                                    const newArr = [...value]
                                    while (newArr.length <= imageIndex) {
                                      newArr.push('')
                                    }
                                    newArr[imageIndex] = `https://tmgbrmkzagzfjdjmtifo.supabase.co/storage/v1/object/public/Hero/${imageIndex + 1}.jpeg`
                                    onUpdate(`${section}.${key}`, newArr)
                                  }}
                                  className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg font-cairo transition-all duration-300"
                                >
                                  Supabase {imageIndex + 1}
                                </button>
                                <button
                                  onClick={() => {
                                    const newArr = [...value]
                                    while (newArr.length <= imageIndex) {
                                      newArr.push('')
                                    }
                                    newArr[imageIndex] = `/Hero/${imageIndex + 1}.jpeg`
                                    onUpdate(`${section}.${key}`, newArr)
                                  }}
                                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg font-cairo transition-all duration-300"
                                >
                                  Local {imageIndex + 1}
                                </button>
                              </div>

                              {/* Clear Image */}
                              {imageUrl && (
                                <button
                                  onClick={() => {
                                    const newArr = [...value]
                                    while (newArr.length <= imageIndex) {
                                      newArr.push('')
                                    }
                                    newArr[imageIndex] = ''
                                    onUpdate(`${section}.${key}`, newArr)
                                  }}
                                  className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-cairo transition-all duration-300"
                                >
                                  Clear Image
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              }

              // Hide hero.description in the visual editor because the Hero component intentionally does not render it
              if (section === 'hero' && key === 'description') {
                return null
              }

              // Hide standalone ctaLink so it doesn't duplicate the combined CTA editor
              if (key === 'ctaLink') {
                return null
              }

            // Skip non-existent fields
            if (value === undefined || value === null) {
              return null
            }

            return renderField(key, value, key.charAt(0).toUpperCase() + key.slice(1))
          }).filter(Boolean)}
        </div>
      )
    }

    // Special handling for contact section to provide a better UX
    if (section === 'contact') {
      return (
        <div className="space-y-6">
          {/* Title */}
          {data.title && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">Title</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 font-cairo">Arabic</label>
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                    value={(data.title as any)?.ar || ''}
                    onChange={(e) => onUpdate(`${section}.title.ar`, e.target.value)}
                    placeholder="عنوان القسم بالعربية"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 font-cairo">English</label>
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                    value={(data.title as any)?.en || ''}
                    onChange={(e) => onUpdate(`${section}.title.en`, e.target.value)}
                    placeholder="Section title in English"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Subtitle */}
          {data.subtitle && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">Subtitle</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 font-cairo">Arabic</label>
                  <textarea
                    rows={3}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                    value={(data.subtitle as any)?.ar || ''}
                    onChange={(e) => onUpdate(`${section}.subtitle.ar`, e.target.value)}
                    placeholder="العنوان الفرعي بالعربية"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 font-cairo">English</label>
                  <textarea
                    rows={3}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                    value={(data.subtitle as any)?.en || ''}
                    onChange={(e) => onUpdate(`${section}.subtitle.en`, e.target.value)}
                    placeholder="Subtitle in English"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {data.description && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">Description</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 font-cairo">Arabic</label>
                  <textarea
                    rows={3}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                    value={(data.description as any)?.ar || ''}
                    onChange={(e) => onUpdate(`${section}.description.ar`, e.target.value)}
                    placeholder="الوصف بالعربية"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 font-cairo">English</label>
                  <textarea
                    rows={3}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                    value={(data.description as any)?.en || ''}
                    onChange={(e) => onUpdate(`${section}.description.en`, e.target.value)}
                    placeholder="Description in English"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Phone Contact */}
          {data.phone && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">Phone / WhatsApp Contact</label>
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 font-cairo">Title - Arabic</label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                      value={(data.phone as any)?.title?.ar || ''}
                      onChange={(e) => onUpdate(`${section}.phone.title.ar`, e.target.value)}
                      placeholder="رقم الهاتف / الواتساب"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 font-cairo">Title - English</label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                      value={(data.phone as any)?.title?.en || ''}
                      onChange={(e) => onUpdate(`${section}.phone.title.en`, e.target.value)}
                      placeholder="Phone / WhatsApp"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 font-cairo mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                    value={(data.phone as any)?.value || ''}
                    onChange={(e) => onUpdate(`${section}.phone.value`, e.target.value)}
                    placeholder="+966 50 123 4567"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email Contact */}
          {data.email && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">Email Contact</label>
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 font-cairo">Title - Arabic</label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                      value={(data.email as any)?.title?.ar || ''}
                      onChange={(e) => onUpdate(`${section}.email.title.ar`, e.target.value)}
                      placeholder="البريد الإلكتروني"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 font-cairo">Title - English</label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                      value={(data.email as any)?.title?.en || ''}
                      onChange={(e) => onUpdate(`${section}.email.title.en`, e.target.value)}
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 font-cairo mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                    value={(data.email as any)?.value || ''}
                    onChange={(e) => onUpdate(`${section}.email.value`, e.target.value)}
                    placeholder="info@yummigo.sa"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CTA Button & WhatsApp Link */}
          {data.cta && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">Call-to-Action Button</label>
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 font-cairo">Button Text - Arabic</label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                      value={(data.cta as any)?.ar || ''}
                      onChange={(e) => onUpdate(`${section}.cta.ar`, e.target.value)}
                      placeholder="تواصل معنا الآن"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 font-cairo">Button Text - English</label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                      value={(data.cta as any)?.en || ''}
                      onChange={(e) => onUpdate(`${section}.cta.en`, e.target.value)}
                      placeholder="Contact Us Now"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 font-cairo mb-2">
                    WhatsApp Link
                    <span className="text-gray-500 text-xs block">This link is used when users click the contact button</span>
                  </label>
                  <input
                    type="url"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                    value={data.ctaLink || ''}
                    onChange={(e) => onUpdate(`${section}.ctaLink`, e.target.value)}
                    placeholder="https://wa.me/966501234567?text=I'm interested in Yummi Go services"
                  />
                  <p className="text-xs text-gray-600 mt-2 font-cairo">
                    Format: https://wa.me/[phone_number]?text=[message]
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }

    // Special handling for footer section to provide a better UX
    if (section === 'footer') {
      return (
        <div className="space-y-6">
          {/* Social Links */}
          {data.socialLinks && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">Social Media Links</label>
              <div className="space-y-4">
                {data.socialLinks.map((social: any, index: number) => (
                  <div key={index} className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-800 text-sm font-cairo">
                        Social Link {index + 1} - {social.icon ? social.icon.charAt(0).toUpperCase() + social.icon.slice(1) : 'Unknown'}
                      </h4>
                      <button
                        onClick={() => {
                          const newArr = [...data.socialLinks]
                          newArr.splice(index, 1)
                          onUpdate(`${section}.socialLinks`, newArr)
                        }}
                        className="text-red-500 bg-red-50 px-3 py-1 rounded-xl text-sm font-semibold hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700 font-cairo">Name - Arabic</label>
                        <input
                          type="text"
                          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                          value={social.name?.ar || ''}
                          onChange={(e) => onUpdate(`${section}.socialLinks[${index}].name.ar`, e.target.value)}
                          placeholder="اسم الشبكة الاجتماعية"
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700 font-cairo">Name - English</label>
                        <input
                          type="text"
                          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                          value={social.name?.en || ''}
                          onChange={(e) => onUpdate(`${section}.socialLinks[${index}].name.en`, e.target.value)}
                          placeholder="Social Network Name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700 font-cairo">Link URL</label>
                        <input
                          type="url"
                          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                          value={social.href || ''}
                          onChange={(e) => onUpdate(`${section}.socialLinks[${index}].href`, e.target.value)}
                          placeholder="https://wa.me/966501234567 or https://twitter.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700 font-cairo">Icon Type</label>
                        <select
                          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                          value={social.icon || ''}
                          onChange={(e) => onUpdate(`${section}.socialLinks[${index}].icon`, e.target.value)}
                        >
                          <option value="">Select Icon</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="twitter">Twitter</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="linkedin">LinkedIn</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const newSocial = {
                      name: { ar: '', en: '' },
                      href: '',
                      icon: 'whatsapp'
                    }
                    const newArr = [...data.socialLinks, newSocial]
                    onUpdate(`${section}.socialLinks`, newArr)
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold font-cairo transition-all duration-300"
                >
                  Add Social Link
                </button>
              </div>
            </div>
          )}

          {/* Footer Sections */}
          {data.sections && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">Footer Sections</label>
              <div className="space-y-6">
                {data.sections.map((section_item: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-800 text-sm font-cairo">Footer Section {index + 1}</h4>
                      <button
                        onClick={() => {
                          const newArr = [...data.sections]
                          newArr.splice(index, 1)
                          onUpdate(`${section}.sections`, newArr)
                        }}
                        className="text-red-500 bg-red-50 px-3 py-1 rounded-xl text-sm font-semibold hover:bg-red-100"
                      >
                        Delete Section
                      </button>
                    </div>

                    {/* Section Title */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 font-cairo mb-2">Section Title</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                          value={section_item.title?.ar || ''}
                          onChange={(e) => onUpdate(`${section}.sections[${index}].title.ar`, e.target.value)}
                          placeholder="عنوان القسم بالعربية"
                          dir="rtl"
                        />
                        <input
                          type="text"
                          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                          value={section_item.title?.en || ''}
                          onChange={(e) => onUpdate(`${section}.sections[${index}].title.en`, e.target.value)}
                          placeholder="Section title in English"
                        />
                      </div>
                    </div>

                    {/* Section Links */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 font-cairo mb-2">Section Links</label>
                      <div className="space-y-3">
                        {section_item.links?.map((link: any, linkIndex: number) => (
                          <div key={linkIndex} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-semibold text-gray-700 text-xs font-cairo">Link {linkIndex + 1}</h5>
                              <button
                                onClick={() => {
                                  const newSections = [...data.sections]
                                  const newLinks = [...newSections[index].links]
                                  newLinks.splice(linkIndex, 1)
                                  newSections[index].links = newLinks
                                  onUpdate(`${section}.sections`, newSections)
                                }}
                                className="text-red-500 bg-red-50 px-2 py-1 rounded text-xs font-semibold hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {/* Link Name */}
                              {typeof link.name === 'object' ? (
                                <>
                                  <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900 text-sm"
                                    value={link.name?.ar || ''}
                                    onChange={(e) => onUpdate(`${section}.sections[${index}].links[${linkIndex}].name.ar`, e.target.value)}
                                    placeholder="اسم الرابط بالعربية"
                                    dir="rtl"
                                  />
                                  <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900 text-sm"
                                    value={link.name?.en || ''}
                                    onChange={(e) => onUpdate(`${section}.sections[${index}].links[${linkIndex}].name.en`, e.target.value)}
                                    placeholder="Link name in English"
                                  />
                                </>
                              ) : (
                                <input
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900 text-sm md:col-span-2"
                                  value={link.name || ''}
                                  onChange={(e) => onUpdate(`${section}.sections[${index}].links[${linkIndex}].name`, e.target.value)}
                                  placeholder="Link name/text"
                                />
                              )}

                              {/* Link URL */}
                              <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900 text-sm"
                                value={link.href || ''}
                                onChange={(e) => onUpdate(`${section}.sections[${index}].links[${linkIndex}].href`, e.target.value)}
                                placeholder="URL or #section-id"
                              />
                            </div>

                            {/* Icon Type (if exists) */}
                            {link.icon && (
                              <div className="mt-3">
                                <label className="block text-xs font-semibold text-gray-600 font-cairo mb-1">Icon Type</label>
                                <select
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900 text-sm"
                                  value={link.icon || ''}
                                  onChange={(e) => onUpdate(`${section}.sections[${index}].links[${linkIndex}].icon`, e.target.value)}
                                >
                                  <option value="">No Icon</option>
                                  <option value="phone">Phone</option>
                                  <option value="email">Email</option>
                                  <option value="whatsapp">WhatsApp</option>
                                </select>
                              </div>
                            )}
                          </div>
                        ))}

                        <button
                          onClick={() => {
                            const newSections = [...data.sections]
                            const newLink = {
                              name: { ar: '', en: '' },
                              href: '',
                              icon: ''
                            }
                            if (!newSections[index].links) newSections[index].links = []
                            newSections[index].links.push(newLink)
                            onUpdate(`${section}.sections`, newSections)
                          }}
                          className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold font-cairo text-xs transition-all duration-300"
                        >
                          Add Link
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const newSection = {
                      title: { ar: '', en: '' },
                      links: []
                    }
                    const newArr = [...data.sections, newSection]
                    onUpdate(`${section}.sections`, newArr)
                  }}
                  className="px-4 py-2 bg-yummi-accent hover:bg-yummi-hover text-white rounded-xl font-bold font-cairo transition-all duration-300"
                >
                  Add Footer Section
                </button>
              </div>
            </div>
          )}

          {/* Copyright & Company */}
          {(data.copyright || data.company) && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">Copyright & Company Info</label>
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                {data.copyright && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-700 font-cairo mb-2">Copyright Text</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                        value={data.copyright?.ar || ''}
                        onChange={(e) => onUpdate(`${section}.copyright.ar`, e.target.value)}
                        placeholder="نص حقوق الطبع والنشر"
                        dir="rtl"
                      />
                      <input
                        type="text"
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                        value={data.copyright?.en || ''}
                        onChange={(e) => onUpdate(`${section}.copyright.en`, e.target.value)}
                        placeholder="Copyright text"
                      />
                    </div>
                  </div>
                )}

                {data.company && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 font-cairo mb-2">Company Name</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                        value={data.company?.ar || ''}
                        onChange={(e) => onUpdate(`${section}.company.ar`, e.target.value)}
                        placeholder="اسم الشركة"
                        dir="rtl"
                      />
                      <input
                        type="text"
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 bg-white font-cairo text-gray-900"
                        value={data.company?.en || ''}
                        onChange={(e) => onUpdate(`${section}.company.en`, e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )
    }
    
    // Regular object handling - skip null/undefined values
    return (
      <div className="space-y-6">
        {Object.entries(data).map(([key, value]) => {
          // Hide standalone ctaLink so it won't duplicate the combined CTA editor
          if (key === 'ctaLink') {
            return null
          }

          // Hide hero.description in the visual editor
          if (section === 'hero' && key === 'description') {
            return null
          }

          // Skip non-existent fields
          if (value === undefined || value === null) {
            return null
          }

          // Special handling for Hero Images - create individual fields for each of the 5 images
          if (section === 'hero' && key === 'images' && Array.isArray(value)) {
            return (
              <div key={key} className="mb-8">
                <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">Hero Images (5 Images)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[0, 1, 2, 3, 4].map((imageIndex) => {
                    const imageUrl = value[imageIndex] || ''
                    return (
                      <div key={imageIndex} className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50 shadow-lg">
                        <h4 className="font-bold text-gray-800 text-lg mb-4 font-cairo text-center">
                          Hero Image {imageIndex + 1}
                        </h4>

                        {/* Image Preview */}
                        <div className="mb-4">
                          <div className="w-full h-48 bg-gray-200 rounded-xl overflow-hidden border-2 border-gray-300 flex items-center justify-center">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={`Hero Image ${imageIndex + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const img = e.currentTarget as HTMLImageElement
                                  img.src = '/Hero/placeholder.jpg' // Fallback image
                                  img.style.opacity = '0.5'
                                }}
                              />
                            ) : (
                              <div className="text-center text-gray-500">
                                <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="text-sm">No image</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Image URL Input */}
                        <div className="mb-4">
                          <label className="block text-xs font-semibold text-gray-700 mb-2 font-cairo">Image URL:</label>
                          <input
                            type="text"
                            className="w-full p-3 text-sm border-2 border-gray-300 rounded-xl bg-white font-cairo focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 text-gray-900"
                            value={imageUrl}
                            onChange={(e) => {
                              const newArr = [...value]
                              while (newArr.length <= imageIndex) {
                                newArr.push('')
                              }
                              newArr[imageIndex] = e.target.value
                              onUpdate(`${section}.${key}`, newArr)
                            }}
                            placeholder={`https://tmgbrmkzagzfjdjmtifo.supabase.co/storage/v1/object/public/Hero/${imageIndex + 1}.jpeg`}
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          {/* Upload New Image */}
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/avif"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return

                                setStatus(`Uploading Hero Image ${imageIndex + 1}...`)

                                try {
                                  const formData = new FormData()
                                  formData.append('file', file)
                                  formData.append('bucket', 'Hero')
                                  formData.append('fileName', `${imageIndex + 1}`)

                                  const response = await fetch('/api/upload', {
                                    method: 'POST',
                                    headers: {
                                      'x-admin-key': adminApiKey
                                    },
                                    body: formData
                                  })

                                  if (response.ok) {
                                    const result = await response.json()
                                    const newArr = [...value]
                                    while (newArr.length <= imageIndex) {
                                      newArr.push('')
                                    }
                                    newArr[imageIndex] = result.url
                                    onUpdate(`${section}.${key}`, newArr)
                                    setStatus(`Hero Image ${imageIndex + 1} uploaded successfully!`)
                                    setTimeout(() => setStatus(''), 3000)
                                  } else {
                                    const error = await response.json()
                                    setStatus('Upload failed: ' + (error.error || 'Unknown error'))
                                    setTimeout(() => setStatus(''), 5000)
                                  }
                                } catch (error: any) {
                                  setStatus('Upload failed: ' + error.message)
                                  setTimeout(() => setStatus(''), 5000)
                                }

                                e.target.value = ''
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              id={`upload-hero-${imageIndex}`}
                            />
                            <label
                              htmlFor={`upload-hero-${imageIndex}`}
                              className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-xl font-cairo transition-all duration-300 cursor-pointer inline-block text-center border-2 border-purple-600 hover:border-purple-700 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                            >
                              Upload Image
                            </label>
                          </div>

                          {/* Quick Set Buttons */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                const newArr = [...value]
                                while (newArr.length <= imageIndex) {
                                  newArr.push('')
                                }
                                newArr[imageIndex] = `https://tmgbrmkzagzfjdjmtifo.supabase.co/storage/v1/object/public/Hero/${imageIndex + 1}.jpeg`
                                onUpdate(`${section}.${key}`, newArr)
                              }}
                              className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg font-cairo transition-all duration-300"
                            >
                              Supabase {imageIndex + 1}
                            </button>
                            <button
                              onClick={() => {
                                const newArr = [...value]
                                while (newArr.length <= imageIndex) {
                                  newArr.push('')
                                }
                                newArr[imageIndex] = `/Hero/${imageIndex + 1}.jpeg`
                                onUpdate(`${section}.${key}`, newArr)
                              }}
                              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg font-cairo transition-all duration-300"
                            >
                              Local {imageIndex + 1}
                            </button>
                          </div>

                          {/* Clear Image */}
                          {imageUrl && (
                            <button
                              onClick={() => {
                                const newArr = [...value]
                                while (newArr.length <= imageIndex) {
                                  newArr.push('')
                                }
                                newArr[imageIndex] = ''
                                onUpdate(`${section}.${key}`, newArr)
                              }}
                              className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-cairo transition-all duration-300"
                            >
                              Clear Image
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }

          // If the field is an array (e.g. services.items), render an editable list with add/delete
          if (Array.isArray(value)) {
            return (
              <div key={key} className="mb-8">
                <label className="block text-sm font-bold text-gray-800 mb-4 font-cairo">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <div className="space-y-4">
                  {value.map((item: any, index: number) => {
                    // Array of image URLs (strings)
                    if (typeof item === 'string') {
                      return (
                        <div key={index} className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50 relative">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-800 text-sm font-cairo">{key.replace(/s$/, '')} {index + 1}</h4>
                            <button
                              onClick={() => {
                                const newArr = [...value]
                                newArr.splice(index, 1)
                                onUpdate(`${section}.${key}`, newArr)
                              }}
                              className="text-red-500 bg-red-50 px-3 py-1 rounded-xl text-sm font-semibold hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            {item && (
                              <img
                                src={item}
                                alt={`${key} ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-xl border-2 border-yummi-accent/30 shadow-lg"
                                onError={(e) => {
                                  const img = e.currentTarget as HTMLImageElement
                                  img.style.display = 'none'
                                }}
                              />
                            )}

                            <div className="flex flex-col gap-3">
                              {/* Quick options for Hero images */}
                              {section === 'hero' && key === 'images' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      const newArr = [...value]
                                      newArr[index] = `https://tmgbrmkzagzfjdjmtifo.supabase.co/storage/v1/object/public/Hero/${index + 1}.jpeg`
                                      onUpdate(`${section}.${key}`, newArr)
                                    }}
                                    className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg font-cairo transition-all duration-300"
                                  >
                                    Supabase {index + 1}
                                  </button>
                                  <button
                                    onClick={() => {
                                      const newArr = [...value]
                                      newArr[index] = `/Hero/${index + 1}.jpeg`
                                      onUpdate(`${section}.${key}`, newArr)
                                    }}
                                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg font-cairo transition-all duration-300"
                                  >
                                    Local {index + 1}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-3">
                            <label className="block text-xs font-semibold text-gray-700 mb-1 font-cairo">Manual URL Edit:</label>
                            <input
                              type="text"
                              className="w-full p-3 text-sm border-2 border-gray-300 rounded-xl bg-white font-cairo focus:ring-2 focus:ring-yummi-accent focus:border-yummi-accent transition-all duration-300 text-gray-900"
                              value={item}
                              onChange={(e) => {
                                const newArr = [...value]
                                newArr[index] = e.target.value
                                onUpdate(`${section}.${key}`, newArr)
                              }}
                              placeholder={`https://tmgbrmkzagzfjdjmtifo.supabase.co/storage/v1/object/public/Hero/${index + 1}.jpeg`}
                            />
                          </div>
                        </div>
                      )
                    }

                    // Array of objects - render nested fields
                    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                      return (
                        <div key={index} className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50 relative">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-800 text-sm font-cairo">{key.replace(/s$/, '')} {index + 1}</h4>
                            <button
                              onClick={() => {
                                const newArr = [...value]
                                newArr.splice(index, 1)
                                onUpdate(`${section}.${key}`, newArr)
                              }}
                              className="text-red-500 bg-red-50 px-3 py-1 rounded-xl text-sm font-semibold hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>

                          {Object.entries(item).map(([subKey, subVal]) => (
                            <div key={subKey} className="mb-4">
                              {renderField(`${key}[${index}].${subKey}`, subVal, subKey.charAt(0).toUpperCase() + subKey.slice(1))}
                            </div>
                          ))}
                        </div>
                      )
                    }

                    // Other primitive types
                    return (
                      <div key={index} className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50 relative">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-gray-800 text-sm font-cairo">{key.replace(/s$/, '')} {index + 1}</h4>
                          <button
                            onClick={() => {
                              const newArr = [...value]
                              newArr.splice(index, 1)
                              onUpdate(`${section}.${key}`, newArr)
                            }}
                            className="text-red-500 bg-red-50 px-3 py-1 rounded-xl text-sm font-semibold hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>

                        {renderField(`${key}[${index}]`, item, key.replace(/s$/, '') + ' ' + (index + 1))}
                      </div>
                    )
                  })}

                  <div>
                    <button
                      onClick={() => {
                        // Build a sensible default new item based on existing items or assume bilingual text
                        let newItem: any = { ar: '', en: '' }
                        if (value.length > 0) {
                          const sample = value[0]
                          if (typeof sample === 'object' && !Array.isArray(sample)) {
                            newItem = Object.keys(sample).reduce((acc: any, k: string) => { acc[k] = ''; return acc }, {})
                          } else if (typeof sample === 'string') {
                            newItem = ''
                          } else {
                            newItem = ''
                          }
                        }
                        const newArr = [...value, newItem]
                        onUpdate(`${section}.${key}`, newArr)
                      }}
                      className="px-4 py-2 bg-yummi-accent hover:bg-yummi-hover text-white rounded-xl font-bold"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>
              </div>
            )
          }

          return renderField(key, value, key.charAt(0).toUpperCase() + key.slice(1))
        }).filter(Boolean)}
      </div>
    )
  }

  return <p className="text-gray-600 font-cairo text-lg">No editable content found for this section.</p>
}
