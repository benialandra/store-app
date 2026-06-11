import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/mailer'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const db = getServiceSupabase()

    const orderId = body.order_id
    const transactionStatus = body.transaction_status
    const fraudStatus = body.fraud_status
    const serverKey = process.env.MIDTRANS_SERVER_KEY || ''

    // 1. Verifikasi Signature (keamanan: pastikan webhook benar dari Midtrans)
    const signatureKey = body.signature_key
    const statusCode = body.status_code
    const grossAmount = body.gross_amount

    if (serverKey && signatureKey) {
      const expectedSignature = crypto
        .createHash('sha512')
        .update(orderId + statusCode + grossAmount + serverKey)
        .digest('hex')

      if (signatureKey !== expectedSignature) {
        console.error('Webhook signature mismatch!')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
      }
    }

    // 2. Proses berdasarkan status
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'accept' || !fraudStatus || transactionStatus === 'settlement') {
        // SUKSES: Update order + generate token + kirim email
        await db
          .from('orders')
          .update({ status: 'success' })
          .eq('id', orderId)

        const { data: order } = await db
          .from('orders')
          .select('*, products(title, price, gdrive_link)')
          .eq('id', orderId)
          .single()

        if (order) {
          // Generate download token (1x pakai, 24 jam)
          const { data: tokenData } = await db
            .from('download_tokens')
            .insert({
              order_id: orderId,
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            })
            .select()
            .single()

          if (tokenData) {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
            const downloadUrl = `${appUrl}/api/download?token=${tokenData.token_id}`
            const productTitle = order.products?.title || 'Premium Script'

            // Increment sales count
            await db.rpc('increment_sales', { product_uuid: order.product_id })
              .then(() => {})
              .catch(() => {
                // Fallback: manual update jika RPC belum ada
                db.from('products')
                  .update({ sales: (order.products as any)?.sales ? (order.products as any).sales + 1 : 1 })
                  .eq('id', order.product_id)
                  .then(() => {})
              })

            await sendEmail(
              order.customer_email,
              order.order_code,
              productTitle,
              order.amount,
              downloadUrl,
              'receipt'
            )
          }
        }
      }
    } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
      await db
        .from('orders')
        .update({ status: transactionStatus === 'expire' ? 'expired' : 'failed' })
        .eq('id', orderId)
    }

    return NextResponse.json({ status: 'success' })
  } catch (error: any) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
