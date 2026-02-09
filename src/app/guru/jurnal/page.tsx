export const dynamic = 'force-dynamic'
export const revalidate = 0

import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'
import { db } from '@/lib/db'
import JurnalTableClient from './jurnaltable'
import { BookOpen, Clock, ThumbsUp, ThumbsDown } from 'lucide-react'

export default async function JurnalGuruPage() {
  
  const token = cookies().get('token')?.value
  if (!token) return <div className="p-10 text-center text-gray-500">Silakan login kembali</div>

  const user = verifyJwt(token)
  const guruId = Number(user.id)

  const { data: magangList } = await db
    .from('magang')
    .select('id')
    .eq('guru_id', guruId)

  const magangIds = magangList?.map(m => m.id) || []

  const { data: logbooks } = await db
    .from('logbook')
    .select(`
      id, tanggal, kegiatan, kendala, status_verifikasi, catatan_guru,
      magang:magang_id (
        siswa:siswa_id ( id, nama, nis )
      )
    `)
    .in('magang_id', magangIds)
    .order('tanggal', { ascending: false })

  const stats = {
    total: logbooks?.length || 0,
    pending: logbooks?.filter(l => l.status_verifikasi === 'pending').length || 0,
    disetujui: logbooks?.filter(l => l.status_verifikasi === 'disetujui').length || 0,
    ditolak: logbooks?.filter(l => l.status_verifikasi === 'ditolak').length || 0,
  }

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen font-sans text-slate-700">
      <h1 className="text-2xl font-bold text-[#1e293b]">
        Manajemen Jurnal Harian Magang
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Logbook" 
          sub="Laporan harian terdaftar"
          value={stats.total} 
          icon={<BookOpen size={20} />} 
          color="text-cyan-500" 
        />
        <StatCard 
          title="Belum Diverifikasi" 
          sub="Menunggu verifikasi"
          value={stats.pending} 
          icon={<Clock size={20} />} 
          color="text-cyan-500" 
        />
        <StatCard 
          title="Disetujui" 
          sub="Sudah diverifikasi"
          value={stats.disetujui} 
          icon={<ThumbsUp size={20} />} 
          color="text-cyan-500" 
        />
        <StatCard 
          title="Ditolak" 
          sub="Perlu perbaikan"
          value={stats.ditolak} 
          icon={<ThumbsDown size={20} />} 
          color="text-cyan-500" 
        />
      </div>

      <JurnalTableClient data={logbooks || []} />
    </div>
  )
}

function StatCard({ title, sub, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex justify-between items-start">
      <div>
        <p className="text-[12px] font-semibold text-slate-500">{title}</p>
        <p className="text-3xl font-bold mt-2 text-slate-800">{value}</p>
        <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
      </div>
      <div className={`${color} p-2`}>
        {icon}
      </div>
    </div>
  )
}