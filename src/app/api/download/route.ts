import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token tidak valid' }, { status: 400 });
  }

  try {
    // 1. Cek Token di Database
    const { data: tokenData, error } = await supabase
      .from('download_tokens')
      .select('*, orders(products(gdrive_link))')
      .eq('token_id', token)
      .single();

    if (error || !tokenData) {
      return NextResponse.json({ error: 'Token tidak ditemukan atau salah' }, { status: 404 });
    }

    // 2. Cek apakah Token sudah dipakai
    if (tokenData.is_used) {
      return NextResponse.json({ error: 'Akses Ditolak: Link ini sudah pernah digunakan sebelumnya.' }, { status: 403 });
    }

    // 3. Cek apakah Token kedaluwarsa
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Akses Ditolak: Link ini sudah kedaluwarsa (berlaku maksimal 24 jam).' }, { status: 403 });
    }

    // 4. Tandai Token sebagai sudah digunakan (Secure 1-time-use)
    await supabase
      .from('download_tokens')
      .update({ is_used: true })
      .eq('token_id', token);

    // 5. Dapatkan Link GDrive
    // @ts-ignore
    const gdriveLink = tokenData.orders?.products?.gdrive_link;

    if (!gdriveLink) {
      return NextResponse.json({ error: 'Link Google Drive tidak ditemukan di database.' }, { status: 404 });
    }

    // 6. Redirect User ke Google Drive
    return NextResponse.redirect(gdriveLink);
    
  } catch (err: any) {
    console.error("Download API Error:", err);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
