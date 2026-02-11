import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signJwt } from '@/lib/jwt'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  // 1. Cari user
  const { data: user } = await db
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  // 2. Kalau user tidak ada
  if (!user) {
    return NextResponse.json(
      { field: 'email', message: 'Email tidak terdaftar' },
      { status: 401 }
    )
  }

  // 3. Cek password
  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return NextResponse.json(
      { field: 'password', message: 'Password salah' },
      { status: 401 }
    )
  }
  let siswaId: number | null = null

if (user.role === 'siswa') {
  const { data: siswa } = await db
    .from('siswa')
    .select('id')
    .eq('user_id', user.id)
    .single()

  siswaId = siswa?.id || null
}

  // 4. Kalau role guru → ambil id guru
  let guruId: number | null = null

  if (user.role === 'guru') {
    const { data: guru } = await db
      .from('guru')
      .select('id')
      .eq('user_id', user.id)
      .single()

    guruId = guru?.id || null
  }

  // 5. Buat token
  // 5. Buat token (Simpan userId asli dan guruId secara terpisah)
const token = signJwt({
  userId: user.id,      // Gunakan nama 'userId' untuk ID dari tabel users
  id: user.role === 'guru' ? guruId : user.id, // Biarkan 'id' berisi guruId untuk role guru agar Jurnal tetap terbaca
  name: user.name,
  email: user.email,
  role: user.role,
})

  // 6. Response
  const res = NextResponse.json({
    message: 'Login berhasil',
    role: user.role,
    name: user.name,
  })

  // 7. Simpan cookie
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  })

  return res
}
