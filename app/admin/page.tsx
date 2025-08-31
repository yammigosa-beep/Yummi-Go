"use client"

import React, { useEffect, useState } from 'react'

const PASSWORD = 'admin123'

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [pw, setPw] = useState('')
  const [contentText, setContentText] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        setContentText(JSON.stringify(data, null, 2))
      })
  }, [])

  function doLogin(e: React.FormEvent) {
    e.preventDefault()
    if (pw === PASSWORD) setLoggedIn(true)
    else setStatus('Incorrect password')
  }

  async function save() {
    setStatus('Saving...')
    try {
      const parsed = JSON.parse(contentText)
      // save to localStorage
      localStorage.setItem('content', JSON.stringify(parsed))

      // POST to API
      const res = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed) })
      if (!res.ok) throw new Error('Save failed')
      const j = await res.json()
      setStatus('Saved successfully')
    } catch (err: any) {
      setStatus('Error: ' + (err.message || 'Invalid JSON'))
    }
  }

  if (!loggedIn) {
    return (
      <main className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={doLogin} className="flex flex-col gap-2">
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className="p-2 border rounded" />
          <button className="p-2 bg-blue-600 text-white rounded" type="submit">Login</button>
        </form>
        <p className="mt-2 text-sm text-red-600">{status}</p>
      </main>
    )
  }

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Content Editor</h1>
        <textarea rows={20} className="w-full p-4 border rounded font-mono text-sm" value={contentText} onChange={(e) => setContentText(e.target.value)} />
        <div className="mt-4 flex gap-2">
          <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
          <button onClick={() => { localStorage.removeItem('content'); setStatus('Local cache cleared') }} className="px-4 py-2 bg-gray-200 rounded">Clear Local</button>
        </div>
        <p className="mt-2 text-sm">{status}</p>
      </div>
    </main>
  )
}
