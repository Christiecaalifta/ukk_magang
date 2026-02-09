export const dynamic = 'force-dynamic'
export const revalidate = 0

import { getDashboardData, getGuruStats } from '@/lib/services/adminDashboard'
import GuruPieChart from './grupPieChart'
import {
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
} from 'lucide-react'


export default async function AdminDashboard() {
  const data = await getDashboardData()
  const guruStats = await getGuruStats()

  return (
    // Penyesuaian: Padding lebih kecil di mobile (p-4), normal di desktop (p-6)
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="text-cyan-500 shrink-0" />
            <span>Dashboard SIMMAS</span>
          </h1>
          <p className="text-sm text-gray-500">
            Sistem Informasi Manajemen Magang Siswa
          </p>
        </div>
      </div>

      {/* ================= STATS ================= */}
      {/* Penyesuaian: grid-cols-2 untuk layar kecil agar tidak memanjang ke bawah terlalu jauh */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Total Siswa" value={data.stats.totalSiswa} desc="Siswa terdaftar" icon={<Users size={20} />} />
        <StatCard title="DUDI Partner" value={data.stats.totalDudi} desc="Perusahaan mitra" icon={<Building2 size={20} />} />
        <StatCard title="Siswa Magang" value={data.stats.siswaMagang} desc="Aktif magang" icon={<GraduationCap size={20} />} />
        <StatCard title="Logbook" value={data.stats.totalLogbook} desc="Total laporan" icon={<BookOpen size={20} />} />
      </div>

      {/* ================= CONTENT ================= */}
      {/* ================= CONTENT ================= */}
<div className="space-y-6">

  {/* ===== GRAFIK FULL ===== */}
  <div>
    <GuruPieChart data={guruStats} />
  </div>

  {/* ===== GRID BAWAH ===== */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* LEFT (MAGANG + LOGBOOK) */}
    <div className="lg:col-span-2 space-y-6">

      {/* ===== MAGANG ===== */}
      <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="text-cyan-500" />
          <h2 className="font-semibold">Magang Terbaru</h2>
        </div>

        <div className="space-y-3">
          {data.magangTerbaru.map((m: any, i: number) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-50 rounded-xl gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                  <GraduationCap size={18} />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold truncate">
                    {m.siswa?.nama || '-'}
                  </p>

                  <p className="text-xs text-gray-500 truncate">
                    {m.dudi?.nama_perusahaan || '-'}
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                    <Calendar size={12} />
                    <span>
                      {m.tanggal_mulai} - {m.tanggal_selesai}
                    </span>
                  </div>
                </div>
              </div>

              <StatusBadge status={m.status} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== LOGBOOK ===== */}
      <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-green-500" />
          <h2 className="font-semibold">Logbook Terbaru</h2>
        </div>

        <div className="space-y-3">
          {data.logbookTerbaru.map((l: any, i: number) => (
            <div
              key={i}
              className="flex justify-between items-start p-3 bg-slate-50 rounded-xl gap-3"
            >
              <div className="flex gap-3">

                <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center text-white">
                  <BookOpen size={16} />
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    {l.kegiatan}
                  </p>

                  <p className="text-[11px] text-gray-400 mt-1">
                    {l.tanggal}
                  </p>

                  {l.kendala && (
                    <p className="text-[11px] text-orange-500 mt-1 italic">
                      Kendala: {l.kendala}
                    </p>
                  )}
                </div>

              </div>

              <StatusBadge status={l.status_verifikasi} />
            </div>
          ))}
        </div>
      </div>

    </div>

    {/* RIGHT (DUDI) */}
    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border h-fit">

      <div className="flex items-center gap-2 mb-4">
        <Building2 className="text-orange-500" />
        <h2 className="font-semibold">DUDI Aktif</h2>
      </div>

      <div className="space-y-3">
        {data.dudiAktif.map((d: any, i: number) => (
          <div
            key={i}
            className="flex justify-between items-start p-3 bg-slate-50 rounded-xl rounded-lg"
          >
            <div className="min-w-0">

              <p className="font-semibold text-sm truncate">
                {d.nama_perusahaan}
              </p>

              <div className="text-[11px] text-gray-500 flex gap-1 mt-1">
                <MapPin size={12} />
                <span className="truncate">{d.alamat}</span>
              </div>

              <div className="text-[11px] text-gray-500 flex gap-1">
                <Phone size={12} />
                {d.telepon}
              </div>

            </div>

            <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-cyan-100 text-cyan-700">
              {d.jumlah_siswa} Siswa
            </span>
          </div>
        ))}
      </div>

    </div>

  </div>
</div>


      </div>
    
  )
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, desc, icon }: any) {
  return (
    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs md:text-sm text-gray-500 truncate">{title}</p>
          <p className="text-lg md:text-2xl font-bold mt-1">{value}</p>
          <p className="hidden sm:block text-[10px] text-gray-400 mt-1 truncate">{desc}</p>
        </div>
        <div className="text-cyan-500 shrink-0">
          {icon}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: any) {
  const map: any = {
    berlangsung: 'bg-green-100 text-green-700',
    aktif: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    disetujui: 'bg-green-100 text-green-700',
    ditolak: 'bg-red-100 text-red-700',
  }

  return (
    <span className={`px-2.5 py-0.5 text-[10px] md:text-xs font-medium rounded-full capitalize whitespace-nowrap ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}