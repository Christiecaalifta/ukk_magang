import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signJwt } from '@/lib/jwt'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  // Cari user
// Cari user dulu
const { data: user } = await db
  .from('users')
  .select('*')
  .eq('email', email)
  .single()

// Jika user.role === 'guru', ambil id guru dari tabel guru
let guruId: number | null = null
if(user.role === 'guru') {
  const { data: guru } = await db
    .from('guru')
    .select('id')
    .eq('user_id', user.id)
    .single()
  guruId = guru?.id || null
}

// Buat token
const token = signJwt({
  id: user.role === 'guru' ? guruId : user.id, // gunakan id guru untuk role guru
  name: user.name,
  email: user.email,
  role: user.role,
})


  if (!user) {
    return NextResponse.json(
      { field: 'email', message: 'Email tidak terdaftar' },
      { status: 401 }
    )
  }

  // Cek password
  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return NextResponse.json(
      { field: 'password', message: 'Password salah' },
      { status: 401 }
    )
  }

  // ✅ Buat token
  

  const res = NextResponse.json({
    message: 'Login berhasil',
    role: user.role,
    name: user.name, // kirim juga ke frontend
  })

  // Simpan di cookie
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  })

  

  return res
}
