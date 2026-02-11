import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 })

  try {
    // 1. Ambil ID Siswa terlebih dahulu
    const { data: siswa } = await supabaseAdmin
      .from('siswa').select('id').eq('user_id', userId).single()

    if (!siswa) return NextResponse.json({ approved: 0, rejected: 0 })

    // 2. Ambil ID Magang yang sedang aktif milik siswa tersebut
    // Karena logbook terhubung ke magang_id, bukan siswa_id
    const { data: magang } = await supabaseAdmin
      .from('magang')
      .select('id')
      .eq('siswa_id', siswa.id)
      .in('status', ['berlangsung', 'selesai']) // Ambil magang yang relevan
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!magang) return NextResponse.json({ approved: 0, rejected: 0 })

    // 3. Hitung range 1 bulan terakhir
    const dateLimit = new Date()
    dateLimit.setMonth(dateLimit.getMonth() - 1)

    // 4. Query ke tabel logbook menggunakan magang_id
    const { data: jurnalData, error } = await supabaseAdmin
      .from('logbook')
      .select('status_verifikasi')
      .eq('magang_id', magang.id) // <--- PERBAIKAN: Gunakan magang_id
      .gte('created_at', dateLimit.toISOString())

    if (error) throw error

    // 5. Hitung statistik
    const stats = {
      approved: jurnalData?.filter(j => j.status_verifikasi === 'disetujui').length || 0,
      rejected: jurnalData?.filter(j => j.status_verifikasi === 'ditolak').length || 0,
    }

    return NextResponse.json(stats)
  } catch (err) {
    console.error('[API_PIEJURNAL_ERROR]', err)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}