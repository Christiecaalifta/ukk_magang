import { supabase } from '@/lib/supabase/client'
import AdminLayoutClient from '@/components/admin/layout_client'

export const dynamic = 'force-dynamic' // ✅ HARUS DI SINI

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: school } = await supabase
    .from('school_settings')
    .select('*')
    .eq('id', 1)
    .single()

  return (
    <AdminLayoutClient school={school}>
      {children}
    </AdminLayoutClient>
  )
}
