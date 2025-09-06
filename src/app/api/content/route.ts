import { NextRequest, NextResponse } from 'next/server'

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tmgbrmkzagzfjdjmtifo.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtZ2JybWt6YWd6Zmpkam10aWZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg0MzEzNiwiZXhwIjoyMDcyNDE5MTM2fQ._6I04Cc_nJA2Pikth_InLlVzQNzURjA6_J1UJWzMM-A'
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'yummi-go-secure-api-2025-v2'

const CONTENT_BUCKET = 'content'
const CONTENT_FILE = 'content.json'

export async function GET() {
  try {
    // Try to fetch content from Supabase Storage first
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${CONTENT_BUCKET}/${CONTENT_FILE}`)
    
    if (response.ok) {
      const content = await response.json()
      return NextResponse.json(content)
    }
    
    // If Supabase fails, fallback to local content.json
    console.log('Supabase content not available, using local fallback')
    
    // Read local content.json file
    const fs = require('fs')
    const path = require('path')
    const contentPath = path.join(process.cwd(), 'public', 'content.json')
    
    if (fs.existsSync(contentPath)) {
      const localContent = fs.readFileSync(contentPath, 'utf8')
      const content = JSON.parse(localContent)
      return NextResponse.json(content)
    }
    
    throw new Error('No content source available')
  } catch (error) {
    console.error('Error reading content:', error)
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin key
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate JSON structure
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON structure' }, { status: 400 })
    }

    // Convert content to JSON string
    const contentJson = JSON.stringify(body, null, 2)
    
    // Create a blob from the JSON content
    const blob = new Blob([contentJson], { type: 'application/json' })
    
    // Upload to Supabase Storage
    const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/${CONTENT_BUCKET}/${CONTENT_FILE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: blob
    })

    // If file already exists, try to update it instead
    if (!uploadResponse.ok) {
      const updateResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/${CONTENT_BUCKET}/${CONTENT_FILE}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: blob
      })

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text()
        throw new Error(`Failed to update content in Supabase: ${errorText}`)
      }
    }
    
    return NextResponse.json({ success: true, message: 'Content updated successfully in Supabase Storage' })
  } catch (error) {
    console.error('Error updating content in Supabase:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}
