import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signJwt } from '@/lib/jwt';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // ambil user dari Supabase
  const { data: user, error } = await db
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return NextResponse.json({ message: 'Email atau password salah' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ message: 'Email atau password salah' }, { status: 401 });
  }

  const role = user.role?.toLowerCase().trim();
  console.log('Login successful, role:', role);
  const token = signJwt({ email: user.email, role });

  const res = NextResponse.json({ message: 'Login berhasil', role });

  // set cookie
  res.cookies.set('token', token, {
  httpOnly: true,
  secure: false,       // localhost
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24,
});


  return res;
}
