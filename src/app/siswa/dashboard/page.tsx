'use client'

import { useEffect, useState } from 'react'

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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [kuota, setKuota] = useState<KuotaMagang | null>(null)
  const [riwayat, setRiwayat] = useState<RiwayatMagang[]>([]) // <<< Pindah ke sini
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initDashboard() {
      try {
        const resUser = await fetch('/api/auth/me', { credentials: 'include' })
        if (!resUser.ok) return
        const userData: User = await resUser.json()
        setUser(userData)

        if (userData.role === 'siswa') {
          // Fetch kuota
          const resKuota = await fetch('/api/siswa/kuotamagang', { credentials: 'include' })
          if (resKuota.ok) {
            const kuotaData = await resKuota.json()
            setKuota(kuotaData)
          }

          // Fetch riwayat magang
          const resRiwayat = await fetch(`/api/siswa/riwayatmagang?userId=${userData.id}`, {
            credentials: 'include'
          })
          if (resRiwayat.ok) {
            const riwayatData: RiwayatMagang[] = await resRiwayat.json()
            setRiwayat(riwayatData)
          } else {
            console.error("Gagal ambil riwayat. Status:", resRiwayat.status)
          }
        }
      } catch (err) {
        console.error("Dashboard Error:", err)
      } finally {
        setLoading(false)
      }
    }

    initDashboard()
  }, [])

  if (loading) return <p>Loading...</p>
  if (!user) return <p>Unauthorized</p>

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold">Selamat datang, {user.name}! 👋</h2>
      </div>

      {/* Riwayat Magang */}
      {user.role === 'siswa' && riwayat.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Riwayat Pendaftaran Magang</h3>
          <ul className="space-y-3">
            {riwayat.map((r) => (
              <li key={r.id} className="flex justify-between border-b pb-2">
                <span>{r.namaDudi}</span>
                <span className="text-sm text-slate-500">{new Date(r.tanggalDaftar).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Kuota Magang */}
      {user.role === 'siswa' && kuota && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-sm font-semibold text-slate-500">Kuota Magang DUDI</h3>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-bold text-cyan-600">{kuota.sisa}</span>
              <span className="text-sm text-slate-400">/ {kuota.totalKuota}</span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Digunakan: {kuota.terpakai} kali pendaftaran
            </p>

            {kuota.sisa === 0 && (
              <p className="mt-3 text-xs font-semibold text-red-500">
                ⚠️ Kuota pendaftaran sudah habis
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
