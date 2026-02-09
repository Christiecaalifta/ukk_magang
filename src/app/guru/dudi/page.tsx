export const dynamic = 'force-dynamic'
export const revalidate = 0

import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'
import { getDudiListForGuru } from '@/lib/services/guru/dudi'
import DudiTableClient from './duditable'
import { Building2, Users, PieChart } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default async function DudiGuruPage({ searchParams }: any) {
  /* ================= AUTH ================= */
  const token = cookies().get('token')?.value
  if (!token) return <p className="p-10 text-center">Silakan login dulu</p>
  const user = verifyJwt(token)
  const guruId = Number(user.id)

  /* ================= PARAMS ================= */
  const search = searchParams.search || ''
  const page = Number(searchParams.page || 1)
  const limit = 5

  /* ================= DATA FETCHING ================= */
  // 1. Ambil List DUDI & Total DUDI Unik
  const { data: dudiList, total: totalDudi } = await getDudiListForGuru(guruId, {
    search,
    limit,
    page,
  })

  // 2. Ambil Statistik Siswa Magang Aktif khusus bimbingan guru ini
  const { count: totalSiswaMagang } = await supabase
    .from('magang')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'berlangsung')
    .in('siswa_id', (
        await supabase.from('siswa').select('id').eq('guru_id', guruId)
    ).data?.map(s => s.id) || [])

  // 3. Hitung Rata-rata (Total Siswa / Total DUDI)
  const averageSiswa = totalDudi > 0 ? (totalSiswaMagang || 0) / totalDudi : 0

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manajemen DUDI</h1>
      </div>

      {/* STAT CARDS (Identik dengan Gambar) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total DUDI" 
          value={totalDudi} 
          subtitle="Perusahaan mitra aktif" 
          icon={<Building2 size={24} />} 
        />
        <StatCard 
          title="Total Siswa Magang" 
          value={totalSiswaMagang || 0} 
          subtitle="Siswa magang aktif" 
          icon={<Users size={24} />} 
        />
        <StatCard 
          title="Rata-rata Siswa" 
          value={averageSiswa.toFixed(0)} 
          subtitle="Per perusahaan" 
          icon={<PieChart size={24} />} 
        />
      </div>

      {/* TABLE CLIENT */}
      <DudiTableClient data={dudiList} total={totalDudi} />
    </div>
  )
}

function StatCard({ title, value, icon, subtitle }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-start relative overflow-hidden">
      <div className="z-10">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
        <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
      </div>
      <div className="text-cyan-500 bg-cyan-50 p-3 rounded-xl z-10">
        {icon}
      </div>
      {/* Dekorasi Ikon Transparan di Background */}
      <div className="absolute -right-4 -bottom-4 text-cyan-500 opacity-[0.03] scale-[2.5]">
        {icon}
      </div>
    </div>
  )
}