import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { adminProductSchema } from '@/lib/validations'

// GET: List semua produk (termasuk yang tidak published)
export async function GET() {
  const db = getServiceSupabase()
  const { data, error } = await db
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products: data })
}

// POST: Tambah produk baru
export async function POST(req: Request) {
  const body = await req.json()
  const parsed = adminProductSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map(e => e.message).join(', ') },
      { status: 400 }
    )
  }

  const db = getServiceSupabase()
  const { data, error } = await db
    .from('products')
    .insert({
      ...parsed.data,
      preview_url: parsed.data.preview_url || '',
      views: 0,
      sales: 0,
      is_published: true
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}

// PUT: Update produk
export async function PUT(req: Request) {
  const body = await req.json()
  const { id, ...rest } = body

  if (!id) {
    return NextResponse.json({ error: 'ID produk diperlukan.' }, { status: 400 })
  }

  const db = getServiceSupabase()
  const { data, error } = await db
    .from('products')
    .update(rest)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}

// DELETE: Hapus produk
export async function DELETE(req: Request) {
  const body = await req.json()
  const { id } = body

  if (!id) {
    return NextResponse.json({ error: 'ID produk diperlukan.' }, { status: 400 })
  }

  const db = getServiceSupabase()
  const { error } = await db
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
