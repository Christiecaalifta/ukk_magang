// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyJwt } from '@/lib/jwt'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const pathname = req.nextUrl.pathname

  // Jika sedang mengakses login, izinkan
  if (pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  // Jika tidak ada token → redirect ke login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const payload = verifyJwt(token)
    const role = payload.role

    // Jika JWT tidak punya role → redirect
    if (!role) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Cek akses berdasarkan path
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (pathname.startsWith('/guru') && role !== 'guru') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (pathname.startsWith('/siswa') && role !== 'siswa') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Semua aman → lanjut
    return NextResponse.next()
  } catch (err) {
    console.error('JWT verification error:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/guru', '/guru/:path*', '/siswa', '/siswa/:path*'],
}

