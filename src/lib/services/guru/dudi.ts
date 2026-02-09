import { supabase } from '@/lib/supabase/client'

/* ================= STATS ================= */
export async function getDudiListForGuru(guruId: number, { search = '', limit = 5, page = 1 }: any) {
  // 1️⃣ Ambil siswa bimbingan
  const { data: siswaBimbingan } = await supabase
    .from('siswa')
    .select('id')
    .eq('guru_id', guruId)

  const siswaIds = siswaBimbingan?.map(s => s.id) || []
  if (siswaIds.length === 0) {
    return { data: [], total: 0 }
  }

  // 2️⃣ Ambil DUDI melalui magang siswa bimbingan
  let query = supabase
    .from('magang')
    .select(`
      dudi:dudi_id (
        id,
        nama_perusahaan,
        alamat,
        email,
        telepon,
        penanggung_jawab
      )
    `, { count: 'exact' })
    .in('siswa_id', siswaIds)
    .eq('status', 'berlangsung')

  // 3️⃣ Tambahkan filter pencarian jika ada
  if (search) {
    query = query.ilike('dudi.nama_perusahaan', `%${search}%`)
  }

  // 4️⃣ Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, count: total } = await query

  // 5️⃣ Hapus duplikat DUDI
  const dudiMap = new Map()
  data?.forEach((m: any) => {
    if (m.dudi && !dudiMap.has(m.dudi.id)) {
      dudiMap.set(m.dudi.id, m.dudi)
    }
  })

  return {
    data: Array.from(dudiMap.values()),
    total: total || 0
  }
}
