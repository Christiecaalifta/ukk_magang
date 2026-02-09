export const dynamic = 'force-dynamic'
export const revalidate = 0

import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'
import { supabase } from '@/lib/supabase/client'
import JurnalTableClient from './jurnaltable'
import { BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react'

export default async function JurnalGuruPage({ searchParams }: any) {
  /* ================= AUTH & VALIDATION ================= */
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  // Guard agar tidak error: Jika token tidak ada, hentikan proses
  if (!token) {
    return <div className="p-10 text-center text-gray-500">Silakan login kembali.</div>
  }

  // Gunakan try-catch jika verifyJwt berpotensi melempar error
  let user: any
  try {
    user = verifyJwt(token)
  } catch (err) {
    return <div className="p-10 text-center text-red-500">Sesi tidak valid.</div>
  }

  if (user.role !== 'guru') {
    return <div className="p-10 text-center text-red-500">Akses ditolak.</div>
  }

  const guruId = Number(user.id)

  /* ================= DATA STATISTIK ================= */
  // Ambil ID siswa bimbingan guru ini
  const { data: siswaIds } = await supabase
    .from('siswa')
    .select('id')
    .eq('guru_id', guruId)

  const ids = siswaIds?.map(s => s.id) || []

  // Ambil statistik logbook riil dari database
  const { data: logbooks } = await supabase
    .from('logbook')
    .select('status')
    .in('siswa_id', ids)

  const stats = {
    total: logbooks?.length || 0,
    pending: logbooks?.filter(l => l.status === 'Belum Diverifikasi').length || 0,
    disetujui: logbooks?.filter(l => l.status === 'Disetujui').length || 0,
    ditolak: logbooks?.filter(l => l.status === 'Ditolak').length || 0,
  }

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800">Manajemen Jurnal Harian Magang</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Logbook" value={stats.total} subtitle="Laporan harian terdaftar" icon={<BookOpen />} />
        <StatCard title="Belum Diverifikasi" value={stats.pending} subtitle="Menunggu verifikasi" icon={<Clock />} color="text-cyan-500" />
        <StatCard title="Disetujui" value={stats.disetujui} subtitle="Sudah diverifikasi" icon={<CheckCircle />} color="text-emerald-500" />
        <StatCard title="Ditolak" value={stats.ditolak} subtitle="Perlu perbaikan" icon={<XCircle />} color="text-red-500" />
      </div>

      {/* Tabel Jurnal */}
      <JurnalTableClient guruId={guruId} searchParams={searchParams} />
    </div>
  )
}

function StatCard({ title, value, icon, subtitle, color = "text-cyan-500" }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-start">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
        <p className="text-[10px] text-gray-400 mt-1">{subtitle}</p>
      </div>
      <div className={`${color} bg-gray-50 p-3 rounded-xl`}>{icon}</div>
    </div>
  )
}