import { createSupabaseServerClient } from '@/lib/supabase/server'

/* ================= STATS ================= */
export async function getUserStats() {
  const supabase = createSupabaseServerClient()

  const { count: totalUser } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: admin } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin')

  const { count: guru } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'guru')

  const { count: siswa } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'siswa')

  return {
    totalUser: totalUser ?? 0,
    admin: admin ?? 0,
    guru: guru ?? 0,
    siswa: siswa ?? 0,
  }
}

/* ================= LIST ================= */
export async function getUserList({
  search = '',
  limit = 5,
  page = 1,
}: any) {
  const supabase = createSupabaseServerClient()

  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,role.ilike.%${search}%`
    )
  }

  const { data, count } = await query

  return {
    data: data ?? [],
    total: count ?? 0,
  }
}
