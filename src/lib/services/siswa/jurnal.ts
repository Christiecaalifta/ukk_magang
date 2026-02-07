import { createSupabaseServerClient } from '@/lib/supabase/server'

/* ================= STATS ================= */
export async function getLogbookStats(magangId: number) {
  const supabase = createSupabaseServerClient()

  // Total
  const { count: total } = await supabase
    .from('logbook')
    .select('*', { count: 'exact', head: true })
    .eq('magang_id', magangId)

  // Approved
  const { count: approved } = await supabase
    .from('logbook')
    .select('*', { count: 'exact', head: true })
    .eq('magang_id', magangId)
    .eq('status_verifikasi', 'disetujui')

  // Pending
  const { count: pending } = await supabase
    .from('logbook')
    .select('*', { count: 'exact', head: true })
    .eq('magang_id', magangId)
    .eq('status_verifikasi', 'pending')

  // Rejected
  const { count: rejected } = await supabase
    .from('logbook')
    .select('*', { count: 'exact', head: true })
    .eq('magang_id', magangId)
    .eq('status_verifikasi', 'ditolak')

  

  return { total: total ?? 0, approved: approved ?? 0, pending: pending ?? 0, rejected: rejected ?? 0 }
}


/* ================= LIST ================= */
export async function getLogbookList({
  magangId,
  search = '',
  limit = 5,
  page = 1,
}: {
  magangId: number
  search?: string
  limit?: number
  page?: number
}) {
  const supabase = createSupabaseServerClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Ambil logbook
  let { data: logbooks, count, error } = await supabase
    .from('logbook')
    .select('*', { count: 'exact' })
    .eq('magang_id', magangId)
    .order('tanggal', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('[JURNAL][LIST ERROR]', error)
    return { data: [], total: 0 }
  }

  // Ambil info magang (dari magang_id)
  const { data: magang } = await supabase
    .from('magang')
    .select('siswa_id, dudi_id')
    .eq('id', magangId)
    .single()

  // Ambil data siswa
  const { data: siswa } = await supabase
    .from('siswa')
    .select('id, nama, nis, kelas, jurusan')
    .eq('id', magang?.siswa_id)
    .single()

  // Ambil data dudi
  const { data: dudi } = await supabase
    .from('dudi')
    .select('id, nama_perusahaan, alamat, penanggung_jawab')
    .eq('id', magang?.dudi_id)
    .single()

  // Gabungkan
  const enrichedLogbooks = (logbooks || []).map(l => ({
    ...l,
    siswa,
    dudi,
  }))

  return {
    data: enrichedLogbooks,
    total: count ?? 0,
  }
}
