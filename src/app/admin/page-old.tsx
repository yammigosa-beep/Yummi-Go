"use client"

import React, { useEffect, useState } from 'react'

const PASSWORD = 'admin123'
const ADMIN_KEY = 'yummi-admin-2024'

interface ContentData {
  hero: {
    title: { ar: string; en: string }
    description: { ar: string; en: string }
    cta: { ar: string; en: string }
  }
  about: {
    title: { ar: string; en: string }
    subtitle: { ar: string; en: string }
    heading: { ar: string; en: string }
    text: { ar: string; en: string }
    cta: { ar: string; en: string }
  }
  services: {
    title: { ar: string; en: string }
    items: Array<{ ar: string; en: string }>
  }
  whyChooseUs: {
    title: { ar: string; en: string }
    items: Array<{
      title: { ar: string; en: string }
      description: { ar: string; en: string }
    }>
  }
  achievements: {
    title: { ar: string; en: string }
    items: Array<{
      value: number
      label: { ar: string; en: string }
    }>
  }
  contact: {
    title: { ar: string; en: string }
    subtitle: { ar: string; en: string }
    description: { ar: string; en: string }
    phone: {
      title: { ar: string; en: string }
      value: string
    }
    email: {
      title: { ar: string; en: string }
      value: string
    }
    cta: { ar: string; en: string }
  }
  footer: {
    sections: Array<{
      title: { ar: string; en: string }
      links: Array<{
        name: { ar: string; en: string } | string
        href: string
        icon?: string
      }>
    }>
    socialLinks: Array<{
      name: { ar: string; en: string }
      href: string
    }>
    copyright: { ar: string; en: string }
    company: { ar: string; en: string }
  }
  menu: {
    home: { ar: string; en: string }
    about: { ar: string; en: string }
    services: { ar: string; en: string }
    why: { ar: string; en: string }
    contact: { ar: string; en: string }
  }
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [pw, setPw] = useState('')
  const [content, setContent] = useState<ContentData | null>(null)
  const [editMode, setEditMode] = useState<'sections' | 'raw'>('sections')
  const [rawContent, setRawContent] = useState('')
  const [status, setStatus] = useState('')
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        setContent(data)
        setRawContent(JSON.stringify(data, null, 2))
      })
      .catch(() => setStatus('Failed to load content'))
  }, [])

  function doLogin(e: React.FormEvent) {
    e.preventDefault()
    if (pw === PASSWORD) {
      setLoggedIn(true)
      setStatus('')
    } else {
      setStatus('Incorrect password')
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
          'x-admin-key': ADMIN_KEY
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

  const updateNestedValue = (section: string, field: string, lang: 'ar' | 'en', value: string) => {
    if (!content) return
    
    setContent(prev => {
      if (!prev) return prev
      const updated = { ...prev }
      
      // Handle nested updates
      if (section === 'hero' || section === 'about' || section === 'contact') {
        if (field.includes('.')) {
          const [parentField, childField] = field.split('.')
          ;(updated[section as keyof ContentData] as any)[parentField][childField][lang] = value
        } else {
          ;(updated[section as keyof ContentData] as any)[field][lang] = value
        }
      } else if (section === 'services' && field.startsWith('items.')) {
        const index = parseInt(field.split('.')[1])
        ;(updated.services.items[index] as any)[lang] = value
      } else if (section === 'whyChooseUs' && field.startsWith('items.')) {
        const [, index, subField] = field.split('.')
        ;(updated.whyChooseUs.items[parseInt(index)][subField as keyof typeof updated.whyChooseUs.items[0]] as any)[lang] = value
      } else if (section === 'achievements' && field.startsWith('items.')) {
        const [, index, subField] = field.split('.')
        if (subField === 'value') {
          updated.achievements.items[parseInt(index)].value = parseInt(value) || 0
        } else {
          ;(updated.achievements.items[parseInt(index)].label as any)[lang] = value
        }
      }
      
      return updated
    })
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
              Section Editor
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
                  
                  {content && <SectionEditor 
                    section={activeSection}
                    data={content[activeSection as keyof ContentData]}
                    onUpdate={updateNestedValue}
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
    </main>
  )
}

// Section Editor Component
function SectionEditor({ section, data, onUpdate }: {
  section: string
  data: any
  onUpdate: (section: string, field: string, lang: 'ar' | 'en', value: string) => void
}) {
  const renderField = (fieldPath: string, value: any, label: string) => {
    if (typeof value === 'object' && value.ar && value.en) {
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
                onChange={(e) => onUpdate(section, fieldPath, 'ar', e.target.value)}
                placeholder="Arabic text..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">English</label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={value.en}
                onChange={(e) => onUpdate(section, fieldPath, 'en', e.target.value)}
                placeholder="English text..."
              />
            </div>
          </div>
        </div>
      )
    }
    
    if (typeof value === 'string') {
      return (
        <div key={fieldPath} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value}
            onChange={(e) => onUpdate(section, fieldPath, 'en', e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        </div>
      )
    }
    
    if (typeof value === 'number') {
      return (
        <div key={fieldPath} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value}
            onChange={(e) => onUpdate(section, fieldPath, 'en', e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        </div>
      )
    }
    
    return null
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Item {index + 1}</h4>
            {Object.entries(item).map(([key, value]) => 
              renderField(`items.${index}.${key}`, value, key.charAt(0).toUpperCase() + key.slice(1))
            )}
          </div>
        ))}
      </div>
    )
  }

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
