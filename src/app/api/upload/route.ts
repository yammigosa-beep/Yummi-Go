import { NextRequest, NextResponse } from 'next/server'

// Supabase configuration - prefer environment variables, fallback to provided values
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tmgbrmkzagzfjdjmtifo.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtZ2JybWt6YWd6Zmpkam10aWZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg0MzEzNiwiZXhwIjoyMDcyNDE5MTM2fQ._6I04Cc_nJA2Pikth_InLlVzQNzURjA6_J1UJWzMM-A'

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'yummi-go-secure-api-2025-v2'

// Helper to call Supabase Storage REST
async function supabaseList(bucket: string) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${bucket}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      apikey: SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      limit: 100,
      offset: 0,
      prefix: ''
    })
  })
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Failed to list objects: ${res.status} ${errorText}`)
  }
  const data = await res.json()
  // data is an array of objects with name
  const files = (data as any[])
    .filter(item => item.name && !item.name.startsWith('.')) // Filter out placeholder files
    .map((item) => ({
      filename: item.name,
      url: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${item.name}`,
      size: item.metadata?.size || 0,
      created: item.created_at || item.updated_at || null
    }))
  return files
}

async function supabaseUpload(bucket: string, filename: string, buffer: Buffer, contentType: string, upsert = false) {
  const url = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filename}`
  const headers: any = {
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    apikey: SUPABASE_SERVICE_KEY,
    'Content-Type': contentType
  }
  if (upsert) headers['x-upsert'] = 'true'

  const res = await fetch(url, {
    method: 'POST',
    headers,
    // fetch in edge runtime wants ArrayBuffer/TypedArray for binary body
    body: new Uint8Array(buffer)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed: ${res.status} ${text}`)
  }

  return {
    success: true,
    url: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`,
    filename
  }
}

async function supabaseDelete(bucket: string, path: string) {
  const url = `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      apikey: SUPABASE_SERVICE_KEY
    }
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Delete failed: ${res.status} ${text}`)
  }
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Check admin key
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = (formData.get('bucket') as string) || 'Hero'
    const overwrite = (formData.get('overwrite') as string) === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Special handling: About bucket should overwrite a single file named 'about{ext}'
    let filename = `${Date.now()}_${file.name}`
    let upsert = false
    if (bucket.toLowerCase() === 'about' || overwrite) {
      const ext = file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')) : ''
      filename = `about${ext}`
      upsert = true
    }

    const result = await supabaseUpload(bucket, filename, buffer, file.type, upsert)

    return NextResponse.json({ success: true, url: result.url, filename: result.filename, size: file.size, type: file.type })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const bucket = (request.nextUrl.searchParams.get('bucket') as string) || 'Hero'
    const files = await supabaseList(bucket)
    return NextResponse.json({ files })
  } catch (error: any) {
    console.error('Error listing files:', error)
    return NextResponse.json({ error: error.message || 'Failed to list files' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const bucket = body.bucket || 'Hero'
    const pathToDelete = body.path
    if (!pathToDelete) return NextResponse.json({ error: 'No path provided' }, { status: 400 })
    await supabaseDelete(bucket, pathToDelete)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 })
  }
}
