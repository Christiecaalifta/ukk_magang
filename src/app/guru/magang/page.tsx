import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'

import {
  getMagangListForGuru,
  getMagangStatsForGuru,
} from '@/lib/services/guru/magang'

import MagangClient from './magangtable'

import {
  Users,
  Play,
  CheckCircle,
  Clock,
} from 'lucide-react'


export default async function MagangGuruPage({ searchParams }: any) {

  /* ================= AUTH ================= */

  const token = cookies().get('token')?.value

  if (!token) {
    return <p className="p-10 text-center">Silakan login</p>
  }

  const user = verifyJwt(token) as any

  if (user.role !== 'guru') {
    return <p className="p-10 text-center">Akses ditolak</p>
  }

  const guruId = Number(user.id)


  /* ================= PARAM ================= */

  const search = searchParams?.search || ''
  const status = searchParams?.status || ''
  const page = Number(searchParams?.page || 1)
  const limit = 5


  /* ================= DATA ================= */

  // ✅ Ambil stats dari service
  const stats = await getMagangStatsForGuru(guruId)

  // ✅ Ambil list dari service
  const result = await getMagangListForGuru(guruId, {
    search,
    status,
    page,
    limit,
  })


  /* ================= UI ================= */

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Manajemen Siswa Magang
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Kelola data siswa magang bimbingan Anda
        </p>
      </div>


      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Siswa"
          value={stats.total}
          subtitle="Siswa magang terdaftar"
          icon={<Users />}
        />

        <StatCard
          title="Aktif"
          value={stats.aktif}
          subtitle="Sedang magang"
          icon={<Play />}
          color="text-cyan-500"
        />

        <StatCard
          title="Selesai"
          value={stats.selesai}
          subtitle="Magang selesai"
          icon={<CheckCircle />}
          color="text-emerald-500"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          subtitle="Menunggu penempatan"
          icon={<Clock />}
          color="text-amber-500"
        />

      </div>


      {/* Table */}
      <MagangClient
        data={result.data}
        total={result.total}
        page={page}
        limit={limit}
        search={search}
        status={status}
      />

    </div>
  )
}


/* ================= CARD ================= */

function StatCard({
  title,
  value,
  icon,
  subtitle,
  color = 'text-cyan-500',
}: any) {

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-start relative overflow-hidden">

      <div className="z-10">

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </p>

        <p className="text-3xl font-bold text-slate-800 mt-2">
          {value}
        </p>

        <p className="text-xs text-gray-400 mt-2">
          {subtitle}
        </p>

      </div>


      <div className={`${color} bg-gray-50 p-3 rounded-xl z-10`}>
        {icon}
      </div>

    </div>
  )
}
