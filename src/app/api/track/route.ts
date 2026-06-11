import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { trackOrderSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = trackOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { code } = parsed.data
    const db = getServiceSupabase()

    // Cari order berdasarkan kode akses
    const { data: order, error } = await db
      .from('orders')
      .select('id, order_code, customer_email, amount, status, created_at, products(title, cover_image_url, price)')
      .eq('order_code', code.toUpperCase())
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Kode Akses tidak ditemukan. Pastikan Anda memasukkan kode yang benar.' },
        { status: 404 }
      )
    }

    // Jika status success, cek apakah ada download token yang masih aktif
    let downloadAvailable = false
    let downloadExpired = false

    if (order.status === 'success') {
      const { data: tokens } = await db
        .from('download_tokens')
        .select('token_id, is_used, expires_at')
        .eq('order_id', order.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (tokens && tokens.length > 0) {
        const token = tokens[0]
        if (!token.is_used && new Date(token.expires_at) > new Date()) {
          downloadAvailable = true
        } else {
          downloadExpired = true
        }
      }
    }

    // Sensor email untuk keamanan: j***@gmail.com
    const emailParts = order.customer_email.split('@')
    const maskedEmail = emailParts[0].charAt(0) + '***@' + emailParts[1]

    return NextResponse.json({
      order_code: order.order_code,
      email: maskedEmail,
      product: order.products,
      amount: order.amount,
      status: order.status,
      created_at: order.created_at,
      download_available: downloadAvailable,
      download_expired: downloadExpired,
    })
  } catch (error: any) {
    console.error('Track Order Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem.' },
      { status: 500 }
    )
  }
}
