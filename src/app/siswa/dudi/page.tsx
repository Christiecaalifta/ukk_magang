'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { FiSearch, FiMapPin, FiUser, FiSend, FiEye } from 'react-icons/fi'
import ModalDetailDudi from '@/components/siswa/detaildudi' // pastikan path sesuai

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface Dudi {
  id: number
  nama_perusahaan: string
  bidang: string
  alamat: string
  telepon: string
  email: string
  penanggung_jawab: string
  status: 'pending' | 'tersedia'
  kuota: number
  terisi: number
  deskripsi: string
  created_at: string
  updated_at: string
  sudah_daftar?: boolean
}

export default function DudiPage() {
  const [data, setData] = useState<Dudi[]>([])
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(6)
  const [loading, setLoading] = useState(true)

  // Modal state
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDudi, setSelectedDudi] = useState<Dudi | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  

 useEffect(() => {
  const fetchUser = async () => {
    const res = await fetch('/api/siswa/me')
    const user = await res.json()

    if (user?.id) {
      // Ambil siswa.id dari tabel siswa
      const { data: siswaData, error } = await supabase
        .from('siswa')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (siswaData?.id) setUserId(siswaData.id)
    }
  }

  fetchUser()
}, [])


 useEffect(() => {
  if (userId) {
    fetchDudi()
  }
}, [userId])

  const fetchDudi = async () => {
    setLoading(true)

    const { data: dudiData, error } = await supabase
      .from('dudi')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetch dudi:', error)
      setData([])
      setLoading(false)
      return
    }

    const dudiWithTerisi = await Promise.all(
    (dudiData || []).map(async (d: any) => {
      // hitung terisi
      const { count } = await supabase
        .from('magang')
        .select('*', { count: 'exact', head: true })
        .eq('dudi_id', d.id)
        .eq('status', 'berlangsung')

      // cek apakah siswa sudah daftar
      let sudahDaftar = false

      if (userId) {
        const { data: daftar } = await supabase
          .from('magang')
          .select('id')
          .eq('dudi_id', d.id)
          .eq('siswa_id', userId)
          .limit(1)

        sudahDaftar = !!(daftar && daftar.length > 0)
      }


      return {
        ...d,
        terisi: count || 0,
        sudah_daftar: sudahDaftar,
      }
    })
  )


    setData(dudiWithTerisi)
    setLoading(false)
  }

  const filtered = data.filter(d =>
    d.nama_perusahaan.toLowerCase().includes(search.toLowerCase()) ||
    d.bidang.toLowerCase().includes(search.toLowerCase())
  )

  const openDetail = (dudi: Dudi) => {
    setSelectedDudi(dudi)
    setIsOpen(true)
  }
  
  const handleDaftar = async (dudiId: number) => {
  try {
    const res = await fetch('/api/siswa/daftarmagang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dudi_id: dudiId }),
    })

    const result = await res.json()

    if (!res.ok) {
      alert(result.message)
      return
    }

    alert(result.message)
    fetchDudi() // refresh kuota & status

  } catch (err) {
    alert('Gagal mendaftar magang')
  }
}


  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      <h1 className="text-3xl font-bold mb-8 text-[#0f172a]">Cari Tempat Magang</h1>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari perusahaan, bidang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 w-full bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-cyan-500 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>Tampilkan:</span>
          <select
            className="bg-slate-50 border-none rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={6}>6 per halaman</option>
            <option value={12}>12 per halaman</option>
          </select>
        </div>
      </div>

      {/* Grid Kartu */}
      {loading ? (
        <p className="text-center text-slate-500">Memuat data...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.slice(0, limit).map(d => (
            <div key={d.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
              
              {/* Header Kartu */}
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-cyan-100">
                  <FiSend size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h2 className="font-bold text-lg truncate pr-2">{d.nama_perusahaan}</h2>
                    {d.status === 'pending' && (
                      <span className="bg-yellow-200 text-white text-[10px] font-medium px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Menunggu
                      </span>
                    )}
                  </div>
                  <p className="text-cyan-600 text-xs font-semibold">{d.bidang}</p>
                </div>
              </div>

              {/* Info Lokasi & PIC */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <FiMapPin className="shrink-0" /> <span className="truncate">{d.alamat}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <FiUser className="shrink-0" /> <span>PIC: {d.penanggung_jawab}</span>
                </div>
              </div>

              {/* Progress Kuota */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-400">Kuota Magang</span>
                  <span className="text-slate-800 font-bold">
                    {d.terisi}/{d.kuota}
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((d.terisi / d.kuota) * 100, 100)}%`
                    }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                  {d.kuota - d.terisi} slot tersisa
                </p>
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-3">
                {d.deskripsi}
              </p>


              {/* Tombol Aksi */}
              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => openDetail(d)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  <FiEye size={14} /> Detail
                </button>
                <button
                  onClick={() => handleDaftar(d.id)}
                  disabled={d.sudah_daftar || d.terisi >= d.kuota || d.status === 'pending'}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    d.sudah_daftar
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : d.terisi >= d.kuota || d.status === 'pending'
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#00a7c4] hover:bg-[#008ba3] text-white shadow-cyan-100'
                  }`}
                >
                  <FiSend size={14} />
                  {d.sudah_daftar
                    ? 'Sudah Mendaftar'
                    : d.status === 'pending'
                    ? 'Belum Dibuka'
                    : d.terisi >= d.kuota
                    ? 'Kuota Penuh'
                    : 'Daftar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selectedDudi && (
        <ModalDetailDudi 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          data={{
            nama: selectedDudi.nama_perusahaan,
            bidang: selectedDudi.bidang,
            deskripsi: selectedDudi.deskripsi,
            alamat: selectedDudi.alamat,
            telepon: selectedDudi.telepon,
            email: selectedDudi.email,
            pic: selectedDudi.penanggung_jawab,
            kuota: selectedDudi.kuota,
            terisi: selectedDudi.terisi,
            sudah_daftar: selectedDudi.sudah_daftar,
          }}
  onDaftar={handleDaftar}   // <-- oper fungsi
  dudiId={selectedDudi.id} 
        />
      )}
    </div>
  )
}
