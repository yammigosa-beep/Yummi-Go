"use client"

import React, { useEffect, useState } from 'react'
import { ImageManager } from '../../components/ImageManager'

interface ContentData {
  [key: string]: any
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [pw, setPw] = useState('')
  const [adminApiKey, setAdminApiKey] = useState('')
  const [content, setContent] = useState<ContentData | null>(null)
  const [editMode, setEditMode] = useState<'sections' | 'raw'>('sections')
  const [rawContent, setRawContent] = useState('')
  const [status, setStatus] = useState('')
  const [activeSection, setActiveSection] = useState('hero')
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
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      })

      if (res.ok) {
        const { apiKey } = await res.json()
        setAdminApiKey(apiKey)
        setLoggedIn(true)
        setStatus('')
        setPw('')
      } else {
        setStatus('Incorrect password')
      }
    } catch (err) {
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

      // POST to API with admin key (retrieved after login)
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

      setStatus('✅ Saved successfully')
      setTimeout(() => setStatus(''), 3000)
    } catch (err: any) {
      setStatus('❌ Error: ' + (err.message || 'Invalid JSON'))
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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Yummi Go Content Management</p>
          </div>
          <form onSubmit={doLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Enter admin password"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Login
            </button>
          </form>
          {status && (
            <p className="mt-4 text-sm text-center text-red-600 bg-red-50 p-2 rounded">
              {status}
            </p>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Content Management System</h1>
            <button
              onClick={() => {
                setLoggedIn(false)
                setPw('')
                setStatus('')
              }}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setEditMode('sections')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                editMode === 'sections'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Visual Editor
            </button>
            <button
              onClick={() => setEditMode('raw')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                editMode === 'raw'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Raw JSON Editor
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={save}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              💾 Save Changes
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('content')
                setStatus('🗑️ Local cache cleared')
                setTimeout(() => setStatus(''), 3000)
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Clear Cache
            </button>
          </div>

          {/* Status */}
          {status && (
            <p className={`mt-4 p-3 rounded-md text-sm font-medium ${
              status.includes('✅') ? 'bg-green-50 text-green-800' :
              status.includes('❌') ? 'bg-red-50 text-red-800' :
              status.includes('🗑️') ? 'bg-blue-50 text-blue-800' :
              'bg-yellow-50 text-yellow-800'
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
                <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                  <h3 className="font-bold text-gray-900 mb-4">Sections</h3>
                  <nav className="space-y-2">
                    {Object.keys(content || {}).map((section) => (
                      <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors capitalize ${
                          activeSection === section
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
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
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
                    {activeSection.replace(/([A-Z])/g, ' $1').trim()} Section
                  </h2>
                  
                  {content && <AdvancedSectionEditor 
                    section={activeSection}
                    data={content[activeSection]}
                    onUpdate={updateValue}
                    onImageFieldClick={(field, index) => setActiveImageField({ section: activeSection, field, index })}
                  />}
                </div>
              </div>
            </>
          ) : (
            /* Raw JSON Editor */
            <div className="col-span-12">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Raw JSON Editor</h2>
                <textarea
                  rows={25}
                  className="w-full p-4 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
  onImageFieldClick 
}: {
  section: string
  data: any
  onUpdate: (path: string, value: any) => void
  onImageFieldClick: (field: string, index?: number) => void
}) {
  const renderField = (fieldPath: string, value: any, label: string): React.ReactNode => {
    const fullPath = section + '.' + fieldPath

    // Handle image fields
    if (fieldPath.includes('image') || fieldPath.includes('icon') || fieldPath.includes('logo')) {
      return (
        <div key={fieldPath} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <div className="flex items-center gap-4">
            {value && (
              <img
                src={value}
                alt={label}
                className="w-20 h-20 object-cover rounded-lg border"
              />
            )}
            <button
              onClick={() => onImageFieldClick(fieldPath)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              {value ? 'Change Image' : 'Select Image'}
            </button>
          </div>
          {value && (
            <input
              type="text"
              className="mt-2 w-full p-2 text-xs border border-gray-300 rounded bg-gray-50"
              value={value}
              onChange={(e) => onUpdate(fullPath, e.target.value)}
              placeholder="Image URL"
            />
          )}
        </div>
      )
    }

    // Handle bilingual text fields
    if (typeof value === 'object' && value && value.ar && value.en) {
      return (
        <div key={fieldPath} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Arabic</label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={value.ar}
                onChange={(e) => onUpdate(fullPath + '.ar', e.target.value)}
                placeholder="Arabic text..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">English</label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div key={fieldPath} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div key={fieldPath} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Item {index + 1}</h4>
            {Object.entries(item).map(([key, value]) => {
              if (key.includes('image') || key.includes('icon') || key === 'slides') {
                if (Array.isArray(value)) {
                  return (
                    <div key={key} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {value.map((imageUrl, imgIndex) => (
                          <div key={imgIndex} className="relative">
                            <img
                              src={imageUrl}
                              alt={`${key} ${imgIndex + 1}`}
                              className="w-full h-24 object-cover rounded border cursor-pointer"
                              onClick={() => onImageFieldClick(`items[${index}].${key}`, imgIndex)}
                            />
                            <button
                              onClick={() => onImageFieldClick(`items[${index}].${key}`, imgIndex)}
                              className="absolute inset-0 bg-black bg-opacity-50 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
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
    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => 
          renderField(key, value, key.charAt(0).toUpperCase() + key.slice(1))
        )}
      </div>
    )
  }

  return <p className="text-gray-500">No editable content found for this section.</p>
}
