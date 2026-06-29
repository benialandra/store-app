import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { password } = body

    const adminPw = process.env.ADMIN_PASSWORD

    if (!adminPw) {
      return NextResponse.json(
        { error: 'Admin password belum dikonfigurasi di server.' },
        { status: 500 }
      )
    }

    if (password === adminPw) {
      // Buat session token unik (hash sha256 dari password admin)
      const sessionToken = crypto.createHash('sha256').update(adminPw).digest('hex')
      
      const cookieStore = await cookies()
      cookieStore.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 hari
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Password salah!' }, { status: 401 })
  } catch (error: any) {
    console.error('Login API error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan internal server.' }, { status: 500 })
  }
}
