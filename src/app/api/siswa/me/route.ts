// app/api/siswa/me/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const token = cookies().get('token')?.value
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload: any = verifyJwt(token)

    if (payload.role !== 'siswa') {
      return NextResponse.json(
        { message: 'Bukan siswa' },
        { status: 403 }
      )
    }

    // 🔑 PENTING: return users.id
    return NextResponse.json({
      id: payload.id, // ← INI users.id (INT)
      role: payload.role,
    })

  } catch (err) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    )
  }
}
