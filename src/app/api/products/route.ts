import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, title, slug, description, price, cover_image_url, preview_url, category, tech, views, sales, is_published, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ products: [], source: 'error' })
    }

    return NextResponse.json({ products: data || [], source: 'supabase' })
  } catch {
    return NextResponse.json({ products: [], source: 'error' })
  }
}
