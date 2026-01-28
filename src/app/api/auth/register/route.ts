import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

// kalau sudah ada db.ts, tinggal import db
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const { email, password, role } = await req.json();

  if (!email || !password || !role) {
    return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // simpan ke Supabase
  const { data, error } = await db
    .from('user') // <-- nama tabel di Supabase
    .insert({
      email,
      password: hashedPassword,
      role,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'User berhasil dibuat', data });
}
