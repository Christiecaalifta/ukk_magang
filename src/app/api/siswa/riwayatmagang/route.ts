import { supabaseAdmin } from '@/lib/supabase/admin'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query

  if (!userId) return res.status(400).json({ error: 'userId dibutuhkan' })

  try {
    // Ambil siswa_id dari tabel siswa
    const { data: siswaData, error: siswaError } = await supabaseAdmin
      .from('siswa')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (siswaError || !siswaData) {
      return res.status(404).json({ error: 'Siswa tidak ditemukan' })
    }

    // Ambil riwayat magang siswa
    const { data: magangData, error: magangError } = await supabaseAdmin
      .from('magang')
      .select('id, tanggal_daftar, dudi_id, dudi(nama)')
      .eq('siswa_id', siswaData.id)
      .order('tanggal_daftar', { ascending: false })

    if (magangError) throw magangError

    res.status(200).json(magangData)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
}
