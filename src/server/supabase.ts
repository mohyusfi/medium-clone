import { createClient } from '@supabase/supabase-js'

export function normalizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return ''
  const trimmed = rawUrl.trim()
  const s3Match = trimmed.match(
    /^https:\/\/([a-z0-9]+)\.storage\.supabase\.co/i,
  )
  if (s3Match) {
    return `https://${s3Match[1]}.supabase.co`
  }
  return trimmed.replace(/\/+$/, '')
}

const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL || '')
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''

export const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || 'untad-chronicle'

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null
