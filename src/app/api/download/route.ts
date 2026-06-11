import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token tidak valid.' }, { status: 400 })
  }

  const db = getServiceSupabase()

  try {
    // 1. Cek Token
    const { data: tokenData, error } = await db
      .from('download_tokens')
      .select('*, orders(product_id, products(gdrive_link, title))')
      .eq('token_id', token)
      .single()

    if (error || !tokenData) {
      return NextResponse.json({ error: 'Token tidak ditemukan.' }, { status: 404 })
    }

    // 2. Cek apakah sudah digunakan
    if (tokenData.is_used) {
      return NextResponse.json(
        { error: 'Link ini sudah pernah digunakan. Hubungi admin jika butuh akses ulang.' },
        { status: 403 }
      )
    }

    // 3. Cek kedaluwarsa
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Link ini sudah kedaluwarsa (berlaku 24 jam). Hubungi admin untuk link baru.' },
        { status: 403 }
      )
    }

    // 4. Tandai sebagai sudah digunakan
    await db
      .from('download_tokens')
      .update({ is_used: true })
      .eq('token_id', token)

    // 5. Redirect ke Google Drive
    const gdriveLink = (tokenData.orders as any)?.products?.gdrive_link

    if (!gdriveLink) {
      return NextResponse.json(
        { error: 'Link download tidak ditemukan. Hubungi admin.' },
        { status: 404 }
      )
    }

    return NextResponse.redirect(gdriveLink)
  } catch (err: any) {
    console.error('Download API Error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan sistem.' }, { status: 500 })
  }
}
