import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// WAJIB menggunakan named export GET, bukan export default
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId dibutuhkan' }, { status: 400 })
    }

    // 1. Ambil ID Siswa dari tabel 'siswa' berdasarkan 'user_id'
    const { data: siswaData, error: siswaError } = await supabaseAdmin
      .from('siswa')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (siswaError || !siswaData) {
      console.log("Siswa tidak ditemukan untuk userId:", userId)
      return NextResponse.json([], { status: 200 }) // Kembalikan array kosong jika siswa belum ada
    }

    // 2. Ambil data magang dengan join ke tabel dudi
    // Karena 'tanggal_daftar' tidak ada, kita gunakan 'created_at'
    const { data: magangData, error: magangError } = await supabaseAdmin
      .from('magang')
      .select(`
        id, 
        created_at, 
        dudi (
          nama_perusahaan
        )
      `)
      .eq('siswa_id', siswaData.id)
      .order('created_at', { ascending: false })

    if (magangError) {
      console.error("Kesalahan Query Magang:", magangError)
      return NextResponse.json({ error: magangError.message }, { status: 500 })
    }

    // 3. Mapping data agar sesuai dengan interface RiwayatMagang di Frontend
    const formattedData = (magangData || []).map((item: any) => ({
      id: item.id,
      // Jika dudi.nama_perusahaan null, tampilkan fallback
      namaDudi: item.dudi?.nama_perusahaan || 'Perusahaan tidak diketahui',
      tanggalDaftar: item.created_at
    }))

    return NextResponse.json(formattedData)
  } catch (err: any) {
    console.error("Internal Server Error:", err)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}