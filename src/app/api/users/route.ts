import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔥 WAJIB
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const { error } = await supabase.from('users').insert({
      name,
      email,
      password: hashed,
      role,
    })

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'User berhasil dibuat' })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
