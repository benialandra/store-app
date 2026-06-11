import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const orderId = body.order_id;
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
      if (fraudStatus == 'challenge') {
        // Handle challenge if needed
      } else if (fraudStatus == 'accept' || transactionStatus == 'settlement') {
        // Pembayaran Sukses
        
        // 1. Update status order menjadi success
        await supabase
          .from('orders')
          .update({ status: 'success' })
          .eq('id', orderId);

        // 2. Ambil detail order dan relasi produk
        const { data: order } = await supabase
          .from('orders')
          .select('*, products(title, price)')
          .eq('id', orderId)
          .single();

        if (order) {
          // 3. Generate Token Download 1x Pakai (24 jam)
          const { data: tokenData } = await supabase
            .from('download_tokens')
            .insert({
              order_id: orderId,
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            })
            .select()
            .single();

          if (tokenData) {
            // 4. Kirim Email Success
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const downloadUrl = `${appUrl}/api/download?token=${tokenData.token_id}`;
            
            // @ts-ignore
            const productTitle = order.products?.title || 'Premium Script';
            
            await sendEmail(
              order.customer_email,
              order.id,
              productTitle,
              order.amount,
              downloadUrl,
              'receipt'
            );
          }
        }
      }
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      // Pembayaran gagal
      await supabase
        .from('orders')
        .update({ status: 'failed' })
        .eq('id', orderId);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
