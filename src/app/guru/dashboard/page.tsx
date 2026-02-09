// app/guru/dashboard/page.tsx
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'
import { getGuruDashboardData } from '@/lib/services/guru/guruDashboard'
import {
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
} from 'lucide-react'

// ================= COMPONENT UTAMA =================
export default async function GuruDashboardPage() {
  // Ambil token dari cookies
  const token = cookies().get('token')?.value
  if (!token) return <div>Silakan login</div>

  // Verifikasi token
  const payload = verifyJwt(token)
  const guruId = Number(payload?.id) 
  console.log('Guru ID:', guruId)
  if (!guruId) return <div>Guru tidak ditemukan</div>

  // Ambil data dashboard guru sesuai guruId
  const data = await getGuruDashboardData(guruId)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="text-cyan-500" />
          Dashboard Guru
        </h1>
        <p className="text-sm text-gray-500">Ringkasan siswa bimbingan</p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Siswa Bimbingan"
          value={data.stats.totalSiswa}
          desc="Siswa di bawah bimbingan"
          icon={<Users />}
        />
        <StatCard
          title="DUDI Partner"
          value={data.stats.totalDudi}
          desc="Perusahaan mitra"
          icon={<Building2 />}
        />
        <StatCard
          title="Siswa Magang"
          value={data.stats.siswaMagang}
          desc="Sedang aktif magang"
          icon={<GraduationCap />}
        />
        <StatCard
          title="Logbook Hari Ini"
          value={data.stats.logbookHariIni}
          desc="Masuk hari ini"
          icon={<BookOpen />}
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* MAGANG TERBARU */}
          <CardSection title="Magang Terbaru" icon={<GraduationCap className="text-cyan-500" />} items={data.magangTerbaru} type="magang" />

          {/* LOGBOOK TERBARU */}
          <CardSection title="Logbook Terbaru" icon={<BookOpen className="text-green-500" />} items={data.logbookTerbaru} type="logbook" />
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="text-orange-500" />
            <h2 className="font-semibold">DUDI Aktif</h2>
          </div>

          <div className="space-y-3">
            {data.dudiAktif.map((d: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold">{d.nama_perusahaan}</p>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={12} /> {d.alamat}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone size={12} /> {d.telepon}
                  </div>
                </div>

                <span className="px-3 py-1 text-xs rounded-full bg-cyan-100 text-cyan-700">
                  {d.jumlah_siswa} Siswa
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ================= SUB-COMPONENT =================
function StatCard({ title, value, desc, icon }: any) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{desc}</p>
        </div>
        <div className="text-cyan-500">{icon}</div>
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
    <span className={`px-3 py-1 text-xs rounded-full ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

function CardSection({ title, icon, items, type }: any) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border">
      <div className="flex items-center gap-2 mb-4">{icon}<h2 className="font-semibold">{title}</h2></div>

      <div className="space-y-3">
        {items.map((item: any, i: number) => {
          if (type === 'magang') {
            return (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <p className="font-semibold">{item.siswa?.nama}</p>
                    <p className="text-xs text-gray-500">{item.dudi?.nama_perusahaan}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={12} />
                      <span>{item.tanggal_mulai} - {item.tanggal_selesai}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            )
          } else if (type === 'logbook') {
            return (
              <div key={i} className="flex justify-between items-start p-3 bg-slate-50 rounded-xl">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center text-white">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.kegiatan}</p>
                    <p className="text-xs text-gray-400">{item.tanggal}</p>
                    <p className="text-xs text-orange-500">Kendala: {item.kendala || '-'}</p>
                  </div>
                </div>
                <StatusBadge status={item.status_verifikasi} />
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}
