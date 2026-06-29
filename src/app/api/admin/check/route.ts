import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function GET() {
  try {
    const adminPw = process.env.ADMIN_PASSWORD

    if (!adminPw) {
      return NextResponse.json({ authorized: false })
    }

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value
    const expectedToken = crypto.createHash('sha256').update(adminPw).digest('hex')

    if (sessionToken && sessionToken === expectedToken) {
      return NextResponse.json({ authorized: true })
    }

    return NextResponse.json({ authorized: false })
  } catch (error: any) {
    console.error('Check auth error:', error)
    return NextResponse.json({ authorized: false })
  }
}
