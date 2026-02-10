import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyJwt } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  try {
    const token = cookies().get('token')?.value

    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload: any = verifyJwt(token)
    
    // Debug untuk memastikan ID bukan lagi 22, tapi ID Siswa
    console.log("Payload yang digunakan untuk query:", payload)

    if (payload.role !== 'siswa') {
      return Response.json({ error: 'Bukan akses siswa' }, { status: 403 })
    }

    // Query ke tabel magang menggunakan ID Siswa
    const { data, error } = await supabaseAdmin
      .from('magang')
      .select('id')
      .eq('siswa_id', payload.id) // payload.id sekarang adalah ID Siswa

    if (error) {
      console.error("Database Error:", error.message)
      return Response.json({ error: error.message }, { status: 500 })
    }

    const totalKuota = 3
    const terpakai = data?.length || 0
    const sisa = Math.max(0, totalKuota - terpakai)

    return Response.json({ 
      totalKuota, 
      terpakai, 
      sisa,
      debug_id_yang_dicari: payload.id 
    })
  } catch (err) {
    return Response.json({ error: 'Token tidak valid' }, { status: 401 })
  }
}