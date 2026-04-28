import { NextRequest, NextResponse } from 'next/server'
import {
  buffetOfferInputSchema,
  buffetOfferSchema,
  buffetOfferUpdateSchema,
  dailyMealInputSchema,
  dailyMealSchema,
  dailyMealUpdateSchema,
  menuCategoryInputSchema,
  menuCategorySchema,
  menuCategoryUpdateSchema,
  menuItemInputSchema,
  menuItemSchema,
  menuItemUpdateSchema
} from '@/lib/menu-schema'
import { getAdminSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

const resourceMap = {
  categories: {
    table: 'menu_categories',
    schema: menuCategorySchema,
    insertSchema: menuCategoryInputSchema,
    updateSchema: menuCategoryUpdateSchema,
    orderBy: 'order'
  },
  items: {
    table: 'menu_items',
    schema: menuItemSchema,
    insertSchema: menuItemInputSchema,
    updateSchema: menuItemUpdateSchema,
    orderBy: 'name_ar'
  },
  'buffet-offers': {
    table: 'buffet_offers',
    schema: buffetOfferSchema,
    insertSchema: buffetOfferInputSchema,
    updateSchema: buffetOfferUpdateSchema,
    orderBy: 'meters_count'
  },
  'daily-meals': {
    table: 'daily_meals',
    schema: dailyMealSchema,
    insertSchema: dailyMealInputSchema,
    updateSchema: dailyMealUpdateSchema,
    orderBy: 'title_ar'
  }
} as const

type ResourceKey = keyof typeof resourceMap

function getResource(resource: string) {
  return resourceMap[resource as ResourceKey]
}

function requireAdmin(request: NextRequest) {
  const adminKey = request.headers.get('x-admin-key')
  const expected = process.env.ADMIN_API_KEY
  if (!expected || adminKey !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

function normalizePayload(payload: Record<string, any>) {
  const cleaned: Record<string, any> = {}
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue
    if (typeof value === 'string') {
      const trimmed = value.trim()
      cleaned[key] = trimmed === '' ? null : trimmed
    } else {
      cleaned[key] = value
    }
  }
  return cleaned
}

export async function GET(_: NextRequest, { params }: { params: { resource: string } }) {
  const resource = getResource(params.resource)
  if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    const supabase = getAdminSupabaseClient()
    const query = supabase.from(resource.table).select('*').order(resource.orderBy, { ascending: true })
    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const parsed = resource.schema.array().parse(data || [])
    return NextResponse.json({ data: parsed })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Request failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { resource: string } }) {
  const resource = getResource(params.resource)
  if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const adminResponse = requireAdmin(request)
  if (adminResponse) return adminResponse

  try {
    const body = await request.json()
    const payload = normalizePayload(resource.insertSchema.parse(body))
    const supabase = getAdminSupabaseClient()
    const { data, error } = await supabase.from(resource.table).insert(payload).select('*').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const parsed = resource.schema.parse(data)
    return NextResponse.json({ data: parsed })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Request failed' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { resource: string } }) {
  const resource = getResource(params.resource)
  if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const adminResponse = requireAdmin(request)
  if (adminResponse) return adminResponse

  try {
    const body = await request.json()
    const parsed = resource.updateSchema.parse(body)
    const { id, ...update } = parsed as { id: string }
    const payload = normalizePayload(update as Record<string, any>)
    const supabase = getAdminSupabaseClient()
    const { data, error } = await supabase.from(resource.table).update(payload).eq('id', id).select('*').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const validated = resource.schema.parse(data)
    return NextResponse.json({ data: validated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Request failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { resource: string } }) {
  const resource = getResource(params.resource)
  if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const adminResponse = requireAdmin(request)
  if (adminResponse) return adminResponse

  try {
    const body = await request.json()
    const { id } = z.object({ id: z.string().min(1) }).parse(body)
    const supabase = getAdminSupabaseClient()
    const { error } = await supabase.from(resource.table).delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Request failed' }, { status: 500 })
  }
}
