import { createClient } from '@supabase/supabase-js'

// Client-side Supabase (untuk read publik, digunakan di komponen)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase (untuk operasi write & admin, digunakan di API routes)
// Menggunakan Service Role Key yang bisa bypass RLS
export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY belum diset. Menggunakan anon key sebagai fallback.')
    return supabase
  }
  return createClient(supabaseUrl, serviceKey)
}
