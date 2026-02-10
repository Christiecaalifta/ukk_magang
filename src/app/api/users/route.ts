import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // WAJIB service role
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      role,
      password,
      email_verified_at,
      kelas,
      jurusan,
      nis,
      nip,
      alamat,
      telepon,
    } = body

    // 1️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 2️⃣ Insert ke tabel users
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        role,
        password: hashedPassword,
        email_verified_at,
      })
      .select()
      .single()

    if (userError) throw userError

    // 3️⃣ Berdasarkan role → insert tabel lanjutan
    if (role === 'siswa') {
      const { error } = await supabase.from('siswa').insert({
        user_id: user.id,
        kelas,
        jurusan,
        nis,
      })
      if (error) throw error
    }

    if (role === 'guru') {
      const { error } = await supabase.from('guru').insert({
        user_id: user.id,
        nip,
        alamat,
        telepon,
      })
      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { message: err.message || 'Gagal menambah user' },
      { status: 400 }
    )
  }
}
