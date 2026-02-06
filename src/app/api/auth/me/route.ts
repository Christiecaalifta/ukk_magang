import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'
import { NextResponse } from 'next/server'

export async function GET() {
  const token = cookies().get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyJwt(token)

  return NextResponse.json({
    id: payload.id,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  })
}
