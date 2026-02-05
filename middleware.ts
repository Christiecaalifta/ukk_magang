import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const payload = verifyJwt(token);
    const role = payload.role;
    console.log('Middleware cookies:', req.cookies.getAll());
    console.log('Token:', req.cookies.get('token')?.value);


    if (!role) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname.startsWith('/guru') && role !== 'guru') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname.startsWith('/siswa') && role !== 'siswa') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}


export const config = {
  matcher: ['/admin/:path*', '/guru/:path*', '/siswa/:path*'],
};
