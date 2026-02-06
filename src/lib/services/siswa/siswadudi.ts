import { supabase } from '@/lib/supabase/client'

export interface Dudi {
  id: string
  nama_perusahaan: string
  alamat?: string
  penanggung_jawab?: string
  magang: { id: string; status: string }[]
  peserta: number
  status?: string 
}

export const getDudi = async (
  page: number = 1,
  limit: number = 6,
  search: string = ''
): Promise<{ data: Dudi[]; count: number }> => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('dudi')
    .select(`
      id,
      nama_perusahaan,
      alamat,
      penanggung_jawab,
      magang(id, status)
    `, { count: 'exact' })
    .range(from, to)

  if (search) {
    query = query.or(`nama_perusahaan.ilike.%${search}%`)
  }

  const { data, count, error } = await query

  if (error) throw error

  const mapped: Dudi[] = (data || []).map((d: any) => ({
    ...d,
    peserta: d.magang.filter((m: any) => m.status === 'berlangsung').length
  }))

  return { data: mapped, count: count || 0 }
}
