import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    // 1. Ambil token
    const token = cookies().get('token')?.value
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // 2. Decode JWT
    const payload: any = verifyJwt(token)

    if (payload.role !== 'siswa') {
      return NextResponse.json(
        { message: 'Hanya siswa yang boleh mendaftar' },
        { status: 403 }
      )
    }

    const { dudi_id } = await req.json()

    // 3. Panggil FUNCTION di database
    const { data, error } = await db.rpc('daftar_magang', {
    p_user_id: payload.id,   // users.id dari JWT
    p_dudi_id: dudi_id,
    })


    if (error) {
      console.error(error)
      return NextResponse.json(
        { message: 'Gagal memproses pendaftaran' },
        { status: 500 }
      )
    }

    // 4. Interpretasi hasil FUNCTION
    if (data.startsWith('GAGAL')) {
      return NextResponse.json(
        { message: data },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: data, // "BERHASIL: Pendaftaran magang diajukan"
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
