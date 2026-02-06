export const dynamic = 'force-dynamic'
export const revalidate = 0

import { getDudiStats, getDudiList } from '@/lib/services/admindudi'
import DudiTableClient from './duditable'
import { Building2, Users, CheckCircle, XCircle, } from 'lucide-react'

export default async function DudiPage({ searchParams }: any) {
  const q = searchParams.q || ''
  const limit = Number(searchParams.limit || 5)
  const page = Number(searchParams.page || 1)

  const stats = await getDudiStats()
  const { data, total } = await getDudiList({ search: q, limit, page })

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Manajemen DUDI</h1>
        <p className="text-sm text-gray-500">
          Kelola data perusahaan mitra
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total DUDI" value={stats.totalDudi} subtitle="Seluruh mitra terdaftar" icon={<Building2 />} />
        <StatCard title="DUDI Aktif" value={stats.dudiAktif} subtitle="Seluruh mitra terdaftar" icon={<CheckCircle />} color="text-green-500" />
        <StatCard title="DUDI Tidak Aktif" value={stats.dudiTidakAktif} subtitle="Seluruh mitra terdaftar" icon={<XCircle />} color="text-red-500" />
        <StatCard title="Total Siswa Magang" value={stats.siswaMagang} subtitle="Seluruh mitra terdaftar" icon={<Users />} />
      </div>

      {/* TABLE */}
      <DudiTableClient data={data} total={total} />
    </div>
  )
}

function StatCard({ title, value, icon, subtitle, color = 'text-cyan-500' }: any) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>
      <div className={`${color}`}>{icon}</div>
    </div>
  )
}
