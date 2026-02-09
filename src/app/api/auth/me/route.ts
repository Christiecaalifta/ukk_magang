import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const token = cookies().get('token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload: any = verifyJwt(token)

    // Ambil user dari DB
    const { data: user } = await db
      .from('users')
      .select('*')
      .eq('email', payload.email)
      .single()

    if (!user) {
      return NextResponse.json(
        { message: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Kalau guru → ambil data guru
    let guru = null

    if (user.role === 'guru') {
      const { data: g } = await db
        .from('guru')
        .select('*')
        .eq('user_id', user.id)
        .single()

      guru = g
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      guru,
    })

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    )
  }
}
