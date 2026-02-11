// app/auth/callback/route.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { signJwt } from '@/lib/jwt' // Import JWT generator kamu
import { supabaseAdmin } from '@/lib/supabase/admin' // Gunakan service role untuk bypass RLS

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/siswa/dashboard'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      const { user } = data;

      // 1. Cek/Sinkronisasi ke tabel 'users' custom kamu
      let { data: dbUser } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      // 2. Jika user google belum ada di tabel users manual, buatkan
      if (!dbUser) {
        const { data: newUser } = await supabaseAdmin
          .from('users')
          .insert({
            id: user.id, // Gunakan ID dari auth.users
            email: user.email,
            name: user.user_metadata.full_name || 'User Google',
            role: 'siswa', // Default role untuk login google
          })
          .select()
          .single();
        dbUser = newUser;
      }

      // 3. Buat Custom JWT Token (Sama seperti di route login manual kamu)
      const token = signJwt({
        userId: dbUser.id,
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      });

      const res = NextResponse.redirect(`${origin}${next}`);

      // 4. Pasang Cookie Token manual agar middleware kamu tetap jalan
      res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });

      return res;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}