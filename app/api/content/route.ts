import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CONTENT_FILE = path.join(process.cwd(), 'content.json')

async function readContent() {
  const raw = await fs.readFile(CONTENT_FILE, 'utf8')
  return JSON.parse(raw)
}

export async function GET() {
  try {
    const content = await readContent()
    return NextResponse.json(content)
  } catch (err) {
    return NextResponse.json({ error: 'Could not read content' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // basic validation: must be an object
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    // persist to disk
    await fs.writeFile(CONTENT_FILE, JSON.stringify(body, null, 2), 'utf8')

    // return saved content
    return NextResponse.json(body)
  } catch (err) {
    return NextResponse.json({ error: 'Could not save content' }, { status: 500 })
  }
}
