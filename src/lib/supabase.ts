import { createClient, SupabaseClient } from '@supabase/supabase-js'

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  if (!url) throw new Error('Missing Supabase URL')
  return url
}

function getPublicKey() {
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error('Missing Supabase anon key')
  return key
}

function getServiceKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY
  if (!key) throw new Error('Missing Supabase service key')
  return key
}

function createServerClient(key: string): SupabaseClient {
  return createClient(getSupabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch }
  })
}

export function getPublicSupabaseClient() {
  return createServerClient(getPublicKey())
}

export function getAdminSupabaseClient() {
  return createServerClient(getServiceKey())
}
