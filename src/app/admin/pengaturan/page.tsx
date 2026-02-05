import { createSupabaseServerClient } from '@/lib/supabase/server'
import SchoolSettingClient from './school_setting'

export const dynamic = 'force-dynamic' // ⬅️ WAJIB

export default async function PengaturanSekolahPage() {
  const supabase = createSupabaseServerClient()

  const { data } = await supabase
    .from('school_settings')
    .select('*')
    .eq('id', 1)
    .single()

  return <SchoolSettingClient initialData={data} />
}
