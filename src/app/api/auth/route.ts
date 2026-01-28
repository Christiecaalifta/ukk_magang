// import { NextResponse } from 'next/server';
// import { signJwt } from '@/lib/jwt';
// import bcrypt from 'bcryptjs';
// import { db } from '@/lib/db'; // koneksi database

// export async function POST(req: Request) {
//   const { email, password } = await req.json();

//   // 1. Cari user
//   const user = await db.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     return NextResponse.json(
//       { message: 'Email tidak ditemukan' },
//       { status: 401 }
//     );
//   }

//   // 2. Cek password
//   const isValid = await bcrypt.compare(password, user.password);
//   if (!isValid) {
//     return NextResponse.json(
//       { message: 'Password salah' },
//       { status: 401 }
//     );
//   }

//   // 3. Buat JWT
//   const token = signJwt({
//     id: user.id,
//     role: user.role,
//   });

//   // 4. Simpan ke cookie
//   const res = NextResponse.json({
//     message: 'Login berhasil',
//   });

//   res.cookies.set('token', token, {
//     httpOnly: true,
//     path: '/',
//   });

//   return res;
// }
