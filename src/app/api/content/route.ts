import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'yummi-go-secure-api-2025-v2'
const CONTENT_PATH = path.join(process.cwd(), 'public', 'content.json')

export async function GET() {
  try {
    const fileContent = await fs.readFile(CONTENT_PATH, 'utf8')
    const content = JSON.parse(fileContent)
    
    return NextResponse.json(content)
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

    // Write to file
    await fs.writeFile(CONTENT_PATH, JSON.stringify(body, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Content updated successfully' })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}
