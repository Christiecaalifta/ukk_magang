import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyJwt } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  try {
    const token = cookies().get('token')?.value
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const payload: any = verifyJwt(token)
    
    // 1. Ambil ID Siswa yang asli dari tabel siswa berdasarkan user_id auth
    // Jika di payload.id sudah merupakan ID Siswa, kamu bisa lewati langkah ini
    const { data: siswa } = await supabaseAdmin
      .from('siswa')
      .select('id')
      .eq('user_id', payload.id) // Asumsi payload.id adalah auth.uid()
      .single()

    const targetId = siswa ? siswa.id : payload.id

    // 2. Hitung jumlah pendaftaran yang sudah dilakukan
    const { data, error, count } = await supabaseAdmin
      .from('magang')
      .select('*', { count: 'exact', head: true })
      .eq('siswa_id', targetId)

    if (error) throw error

    const totalKuota = 3
    const terpakai = count || 0
    const sisa = Math.max(0, totalKuota - terpakai)

    return Response.json({ 
      totalKuota, 
      terpakai, 
      sisa 
    })
  } catch (err) {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}