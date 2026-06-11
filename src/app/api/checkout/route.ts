import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { snap } from '@/lib/midtrans';

export async function POST(req: Request) {
  try {
    const { productId, email, title, price } = await req.json();

    // 1. Simpan order ke Supabase dengan status pending
    // Asumsi: Tabel orders sudah dibuat dan RLS diizinkan untuk insert
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_email: email,
        product_id: productId, // Harus berupa UUID yang valid di database, kita mock sementara jika tidak ada
        amount: price,
        status: 'pending'
      })
      .select()
      .single();

    let orderId = order?.id;

    // Fallback jika database belum disetup (untuk keperluan demo UI)
    if (error || !orderId) {
      console.warn("Supabase insert error (mungkin tabel belum dibuat). Menggunakan mock UUID.", error);
      orderId = 'order-' + Math.random().toString(36).substring(7) + '-' + Date.now();
    }

    // 2. Buat Transaksi di Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price
      },
      customer_details: {
        email: email
      },
      item_details: [{
        id: String(productId),
        price: price,
        quantity: 1,
        name: title.substring(0, 50) // Midtrans limit
      }]
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
