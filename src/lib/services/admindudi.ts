import { supabaseAdmin } from '@/lib/supabase/admin'

/* ================= STATS ================= */
export async function getDudiStats() {
  const { count: totalDudi } = await supabaseAdmin
    .from('dudi')
    .select('*', { count: 'exact' })

  const { count: dudiAktif } = await supabaseAdmin
    .from('dudi')
    .select('*', { count: 'exact' })
    .eq('status', 'aktif')
    .is('deleted_at', null)

  const { count: dudiTidakAktif } = await supabaseAdmin
    .from('dudi')
    .select('*', { count: 'exact' })
    .eq('status', 'nonaktif')
    .is('deleted_at', null)

  const { count: siswaMagang } = await supabaseAdmin
    .from('magang')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'berlangsung')

  return {
    totalDudi: totalDudi || 0,
    dudiAktif: dudiAktif || 0,
    dudiTidakAktif: dudiTidakAktif || 0,
    siswaMagang: siswaMagang || 0,
  }
}

/* ================= LIST DUDI ================= */
export async function getDudiList({ search = '', status = '', limit = 5, page = 1 }: any) {
  const from = (page - 1) * limit
  const to = from + limit - 1
let query = supabaseAdmin
  .from('dudi')
  .select(
    `
    id,
    nama_perusahaan,
    alamat,
    email,
    telepon,
    penanggung_jawab,
    status,
    deleted_at,
    magang(id, status)
    `,
    { count: 'exact' }
  )
  .is('deleted_at', null)
  .range (from,to)
if (status) {
  query = query.eq('status', status)
}


  if (search) {
    query = query.or(`
      nama_perusahaan.ilike.%${search}%,
      alamat.ilike.%${search}%,
      email.ilike.%${search}%,
      telepon.ilike.%${search}%,
      penanggung_jawab.ilike.%${search}%
    `)
  }

  const { data, count } = await query

  return {
    data: data || [],
    total: count || 0,
  }
}
