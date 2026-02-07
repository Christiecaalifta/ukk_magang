import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({
    message: 'Logout berhasil',
  })

  // Hapus cookie token
  res.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })

  return res
}
