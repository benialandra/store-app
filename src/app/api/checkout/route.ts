import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { snap } from '@/lib/midtrans'
import { checkoutSchema } from '@/lib/validations'
import { generateOrderCode } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 1. Validasi input
    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { productId, email, title, price } = parsed.data
    const db = getServiceSupabase()
    const orderCode = generateOrderCode()

    // 2. Verifikasi harga dari database (anti-tamper)
    const { data: product } = await db
      .from('products')
      .select('id, price, title')
      .eq('id', productId)
      .single()

    const verifiedPrice = product?.price || price
    const verifiedTitle = product?.title || title

    // 3. Simpan order ke Supabase
    const { data: order, error: orderError } = await db
      .from('orders')
      .insert({
        order_code: orderCode,
        customer_email: email,
        product_id: productId,
        amount: verifiedPrice,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Order insert error:', orderError)
      return NextResponse.json(
        { error: 'Gagal membuat pesanan. Silakan coba lagi.' },
        { status: 500 }
      )
    }

    // 4. Buat Transaksi Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: verifiedPrice
      },
      customer_details: {
        email: email
      },
      item_details: [{
        id: productId,
        price: verifiedPrice,
        quantity: 1,
        name: verifiedTitle.substring(0, 50)
      }]
    }

    const transaction = await snap.createTransaction(parameter)

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_code: orderCode
    })
  } catch (error: any) {
    console.error('Checkout Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
