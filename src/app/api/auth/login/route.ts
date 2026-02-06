import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signJwt } from '@/lib/jwt';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Cari user berdasarkan email
  const { data: user } = await db
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  // ❌ Jika email tidak ada
  if (!user) {
    return NextResponse.json(
      { field: 'email', message: 'Email tidak terdaftar' },
      { status: 401 }
    );
  }

  // Cek password
  const isValid = await bcrypt.compare(password, user.password);

  // ❌ Jika password salah
  if (!isValid) {
    return NextResponse.json(
      { field: 'password', message: 'Password salah' },
      { status: 401 }
    );
  }

  // ✅ Jika sukses
  const role = user.role?.toLowerCase().trim();
  const token = signJwt({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
})

  const res = NextResponse.json({
    message: 'Login berhasil',
    role,
  });

  res.cookies.set('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return res;
}
