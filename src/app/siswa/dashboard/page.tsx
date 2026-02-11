'use client'

import { useEffect, useState } from 'react'
import { 
  User as UserIcon, 
  History, 
  Ticket, 
  AlertTriangle, 
  CheckCircle2,
  FileText
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface User {
  id: string
  name: string
  role: string
}

interface KuotaMagang {
  totalKuota: number
  terpakai: number
  sisa: number
}

interface RiwayatMagang {
  id: string
  namaDudi: string
  tanggalDaftar: string
}

interface JurnalStats {
  approved: number
  rejected: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [kuota, setKuota] = useState<KuotaMagang | null>(null)
  const [riwayat, setRiwayat] = useState<RiwayatMagang[]>([])
  const [jurnalStats, setJurnalStats] = useState<JurnalStats>({ approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initDashboard() {
      try {
        const resUser = await fetch('/api/auth/me', { credentials: 'include' })
        
        if (!resUser.ok) return;

        const userData: User = await resUser.json()
        setUser(userData)

        if (userData.role === 'siswa') {
          // Fetch Kuota, Riwayat, dan Statistik Jurnal secara paralel
          const [resKuota, resRiwayat, resJurnal] = await Promise.all([
            fetch('/api/siswa/kuotamagang', { 
              headers: { 'Cache-Control': 'no-cache' },
              credentials: 'include' 
            }),
            fetch(`/api/siswa/riwayatmagang?userId=${userData.id}`, { 
              headers: { 'Cache-Control': 'no-cache' },
              credentials: 'include' 
            }),
            // Endpoint API piejurnal yang kamu sebutkan
            fetch(`/api/siswa/piejurnal?userId=${userData.id}`, {
              headers: { 'Cache-Control': 'no-cache' },
              credentials: 'include'
            })
          ])

          if (resKuota.ok) setKuota(await resKuota.json())
          if (resRiwayat.ok) setRiwayat(await resRiwayat.json())
          if (resJurnal.ok) setJurnalStats(await resJurnal.json())
        }
      } catch (err) {
        console.error("Dashboard Error:", err)
      } finally {
        setLoading(false)
      }
    }

    initDashboard()
  }, [])

  // Data untuk Recharts
  const chartData = [
    { name: 'Disetujui', value: jurnalStats.approved, color: '#0ea5e9' }, // Biru/Cyan
    { name: 'Ditolak', value: jurnalStats.rejected, color: '#ef4444' }     // Merah
  ]

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
    </div>
  )
  
  if (!user) return <p className="p-6 text-red-500">Sesi berakhir, silakan login kembali.</p>

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6">
      
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-8 rounded-3xl shadow-lg text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <UserIcon size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Selamat datang, {user.name}! 👋</h2>
            <p className="opacity-80 text-sm">Semoga hari magangmu menyenangkan dan penuh ilmu baru.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Kuota & Statistik Jurnal */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card Kuota */}
          {user.role === 'siswa' && kuota && (
            <div className={`relative overflow-hidden bg-white p-6 rounded-3xl shadow-sm border-2 transition-all ${kuota.sisa === 0 ? 'border-red-100' : 'border-slate-50'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Kuota Pendaftaran</h3>
                <Ticket className={kuota.sisa === 0 ? 'text-red-400' : 'text-cyan-500'} size={20} />
              </div>

              <div className="flex items-baseline gap-1">
                <span className={`text-5xl font-extrabold ${kuota.sisa === 0 ? 'text-red-600' : 'text-slate-800'}`}>
                  {kuota.sisa}
                </span>
                <span className="text-lg text-slate-400 font-medium">/ {kuota.totalKuota}</span>
              </div>

              <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${kuota.sisa === 0 ? 'bg-red-500' : 'bg-cyan-500'}`}
                  style={{ width: `${(kuota.sisa / kuota.totalKuota) * 100}%` }}
                />
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Terpakai:</span>
                  <span className="text-slate-800">{kuota.terpakai} pendaftaran</span>
                </div>
                
                {kuota.sisa === 0 ? (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 animate-pulse">
                    <AlertTriangle size={16} />
                    <p className="text-[11px] font-bold leading-tight">Batas pendaftaran tercapai.</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                    <CheckCircle2 size={16} />
                    <p className="text-[11px] font-bold leading-tight">Anda dapat mendaftar.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Card Donut Chart Statistik Jurnal (Baru) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-slate-400" size={18} />
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Statistik Jurnal</h3>
            </div>
            
            <div className="h-[200px] w-full">
              {jurnalStats.approved === 0 && jurnalStats.rejected === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                   <p className="text-xs text-slate-400 italic">Belum ada data jurnal<br/>dalam 30 hari terakhir</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex justify-around mt-4 pt-4 border-t border-slate-50">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Disetujui</p>
                <p className="text-lg font-bold text-blue-600">{jurnalStats.approved}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Ditolak</p>
                <p className="text-lg font-bold text-red-500">{jurnalStats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Riwayat */}
        <div className="lg:col-span-2">
          {user.role === 'siswa' && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                  <History size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Riwayat Pendaftaran</h3>
              </div>

              {riwayat.length > 0 ? (
                <div className="space-y-4">
                  {riwayat.map((r) => (
                    <div key={r.id} className="group flex justify-between items-center p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 hover:border-cyan-100 transition-all">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 group-hover:text-cyan-700 transition-colors">
                          {r.namaDudi}
                        </span>
                        <span className="text-xs text-slate-400">
                          ID Pendaftaran: {String(r.id).slice(0, 8)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-slate-500 block">
                          {new Date(r.tanggalDaftar).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm">Belum ada riwayat pendaftaran magang.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}