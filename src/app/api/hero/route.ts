import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tmgbrmkzagzfjdjmtifo.supabase.co'
const SUPABASE_BUCKET = 'Hero'

async function listFromSupabase(): Promise<string[] | null> {
  try {
    const url = `${SUPABASE_URL}/storage/v1/object/list/${encodeURIComponent(SUPABASE_BUCKET)}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
    })

    if (!response.ok) {
      console.error('Supabase API error:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    
    if (!Array.isArray(data)) {
      console.error('Unexpected Supabase response format:', data)
      return null
    }

    // Filter for image files and extract names
    const imageFiles = data
      .filter(file => 
        file.name && 
        /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(file.name) &&
        !file.name.includes('/')
      )
      .map(file => file.name)
      .sort((a, b) => {
        // Sort by filename number if available
        const aNum = parseInt(a.match(/(\d+)/)?.[1] || '999')
        const bNum = parseInt(b.match(/(\d+)/)?.[1] || '999')
        return aNum - bNum
      })

    return imageFiles
  } catch (error) {
    console.error('Error fetching from Supabase:', error)
    return null
  }
}

async function listFromLocal(): Promise<string[]> {
  try {
    const dir = path.join(process.cwd(), 'public', 'Hero')
    const files = await fs.promises.readdir(dir)
    
    return files
      .filter(file => /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(file))
      .sort((a, b) => {
        // Sort by filename number if available
        const aNum = parseInt(a.match(/(\d+)/)?.[1] || '999')
        const bNum = parseInt(b.match(/(\d+)/)?.[1] || '999')
        return aNum - bNum
      })
  } catch (error) {
    console.error('Error reading local Hero directory:', error)
    return []
  }
}

export async function GET() {
  try {
    // Try Supabase first
    const supabaseFiles = await listFromSupabase()
    
    if (supabaseFiles && supabaseFiles.length > 0) {
      return NextResponse.json({
        source: 'supabase',
        images: supabaseFiles,
        baseUrl: `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/`
      })
    }

    // Fallback to local files
    const localFiles = await listFromLocal()
    
    return NextResponse.json({
      source: 'local',
      images: localFiles,
      baseUrl: '/Hero/'
    })
  } catch (error) {
    console.error('Hero API error:', error)
    
    // Final fallback
    return NextResponse.json({
      source: 'fallback',
      images: ['1.jpeg', '2.jpeg', '3.avif', '4.webp', '5.jpeg'],
      baseUrl: '/Hero/'
    })
  }
}
