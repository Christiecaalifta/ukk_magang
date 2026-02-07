import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'

export async function GET() {
  try {
    const token = cookies().get('token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = verifyJwt(token)

    return NextResponse.json(user)
  } catch {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    )
  }
}
