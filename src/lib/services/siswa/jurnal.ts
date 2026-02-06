import { createSupabaseServerClient } from '@/lib/supabase/server'


/* ================= STATS ================= */
export async function getLogbookStats(magangId: number) {

  const supabase = createSupabaseServerClient()

  const { count: total } = await supabase
    .from('logbook')
    .select('*', { count: 'exact', head: true })
    

  const { count: approved } = await supabase
    .from('logbook')
    .select('*', { count: 'exact', head: true })
    
    .eq('status_verifikasi', 'disetujui')

  const { count: pending } = await supabase
    .from('logbook')
    .select('*', { count: 'exact', head: true })
    
    .eq('status_verifikasi', 'pending')

  const { count: rejected } = await supabase
    .from('logbook')
    .select('*', { count: 'exact', head: true })
   
    .eq('status_verifikasi', 'ditolak')

  return {
    total: total ?? 0,
    approved: approved ?? 0,
    pending: pending ?? 0,
    rejected: rejected ?? 0,
  }
}


/* ================= LIST ================= */
export async function getLogbookList({
  search = '',
  limit = 5,
  page = 1,
}: any) {

  const supabase = createSupabaseServerClient()

  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('logbook')
    .select('*', { count: 'exact' })
    .order('tanggal', { ascending: false })
    .range(from, to)

  if (search) {
    query = query.or(
      `kegiatan.ilike.%${search}%,kendala.ilike.%${search}%`
    )
  }

  const { data, count, error } = await query

  if (error) {
    console.error('LOGBOOK ERROR:', error)
  }

  return {
    data: data ?? [],
    total: count ?? 0,
  }
}
