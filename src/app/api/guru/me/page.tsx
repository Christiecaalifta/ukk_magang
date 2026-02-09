import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // 1. Ambil token
    const token = cookies().get('token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Verify token
    const payload: any = verifyJwt(token)

    if (!payload?.id) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

    // 3. Ambil data guru
    const { data: guru, error } = await db
      .from('guru')
      .select('*')
      .eq('user_id', payload.id)
      .single()

    if (error || !guru) {
      return NextResponse.json(
        { message: 'Data guru tidak ditemukan' },
        { status: 404 }
      )
    }

    // 4. Return
    return NextResponse.json(guru)

  } catch (err) {
    console.error('API /guru/me error:', err)

    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    )
  }
}
