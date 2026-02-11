'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { FiSearch, FiMapPin, FiUser, FiSend, FiEye } from 'react-icons/fi'
import ModalDetailDudi from '@/components/siswa/detaildudi'
import Toast from '@/components/ui/toast' // Sesuaikan path file Toast kamu

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

  // Modal & User state
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDudi, setSelectedDudi] = useState<Dudi | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  // Toast state
  const [showToast, setShowToast] = useState(false)
  const [toastConfig, setToastConfig] = useState<{
    message: string
    type: 'success' | 'error'
  }>({ message: '', type: 'success' })

  // Helper untuk memicu toast
  const triggerToast = (message: string, type: 'success' | 'error') => {
    setToastConfig({ message, type })
    setShowToast(true)
  }

  // Fetch data utama (User + Dudi)
  const fetchAllData = useCallback(async () => {
    setLoading(true)
    try {
      // 1. Ambil info user login
      const res = await fetch('/api/siswa/me')
      const user = await res.json()
      let currentSiswaId = null

      if (user?.id) {
        const { data: siswaData } = await supabase
          .from('siswa')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()
        
        if (siswaData) {
          currentSiswaId = siswaData.id
          setUserId(siswaData.id)
        }
      }

      // 2. Ambil data DUDI
      const { data: dudiData, error: dudiError } = await supabase
        .from('dudi')
        .select('*')
        .order('created_at', { ascending: false })

      if (dudiError) throw dudiError

      // 3. Mapping status terisi & sudah_daftar
      const dudiWithDetails = await Promise.all(
        (dudiData || []).map(async (d: any) => {
          const { count } = await supabase
            .from('magang')
            .select('*', { count: 'exact', head: true })
            .eq('dudi_id', d.id)
            .eq('status', 'berlangsung')

          let sudahDaftar = false
          if (currentSiswaId) {
            const { data: daftar } = await supabase
              .from('magang')
              .select('id')
              .eq('dudi_id', d.id)
              .eq('siswa_id', currentSiswaId)
              .maybeSingle()
            sudahDaftar = !!daftar
          }

          return {
            ...d,
            terisi: count || 0,
            sudah_daftar: sudahDaftar,
          }
        })
      )
      setData(dudiWithDetails)
    } catch (err) {
      console.error('Error:', err)
      triggerToast('Gagal memuat data', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const handleDaftar = async (dudiId: number) => {
    const target = data.find(d => d.id === dudiId)
    
    // Validasi Kuota sebelum hit API
    if (target && target.terisi >= target.kuota) {
      triggerToast('Maaf, kuota pendaftaran sudah penuh!', 'error')
      return
    }

    try {
      const res = await fetch('/api/siswa/daftarmagang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dudi_id: dudiId }),
      })

      const result = await res.json()

      if (!res.ok) {
        triggerToast(result.message || 'Gagal mendaftar', 'error')
        return
      }

      triggerToast('Berhasil mendaftar magang!', 'success')
      fetchAllData() // Refresh data UI
    } catch (err) {
      triggerToast('Terjadi kesalahan jaringan', 'error')
    }
  }

  const filtered = data.filter(d =>
    d.nama_perusahaan.toLowerCase().includes(search.toLowerCase()) ||
    d.bidang.toLowerCase().includes(search.toLowerCase())
  )

  const openDetail = (dudi: Dudi) => {
    setSelectedDudi(dudi)
    setIsOpen(true)
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-800 relative">
      {/* Notifikasi Toast Custom */}
      {showToast && (
        <Toast 
          message={toastConfig.message} 
          onClose={() => setShowToast(false)} 
        />
      )}

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
            className="bg-slate-50 border-none rounded-lg px-3 py-2 outline-none"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={6}>6 per halaman</option>
            <option value={12}>12 per halaman</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500">Memuat informasi magang...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.slice(0, limit).map(d => {
            const isFull = d.terisi >= d.kuota
            const isPending = d.status === 'pending'
            
            return (
              <div key={d.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg ${isFull ? 'bg-slate-400 shadow-slate-100' : 'bg-cyan-500 shadow-cyan-100'}`}>
                    <FiSend size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h2 className="font-bold text-lg truncate pr-2">{d.nama_perusahaan}</h2>
                      {isPending && (
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Pending</span>
                      )}
                    </div>
                    <p className="text-cyan-600 text-xs font-semibold">{d.bidang}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <FiMapPin className="shrink-0" /> <span className="truncate">{d.alamat}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <FiUser className="shrink-0" /> <span>PIC: {d.penanggung_jawab}</span>
                  </div>
                </div>

                {/* Kuota Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-400">Kuota Magang</span>
                    <span className={`font-bold ${isFull ? 'text-red-500' : 'text-slate-800'}`}>
                      {d.terisi}/{d.kuota}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-cyan-500'}`}
                      style={{ width: `${Math.min((d.terisi / d.kuota) * 100, 100)}%` }}
                    />
                  </div>
                  <p className={`text-[11px] mt-1.5 font-medium ${isFull ? 'text-red-500' : 'text-slate-400'}`}>
                    {isFull ? '⚠️ Kuota Penuh' : `${d.kuota - d.terisi} slot tersisa`}
                  </p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-3 italic">
                  {d.deskripsi || "Tidak ada deskripsi tersedia."}
                </p>

                <div className="flex gap-3 mt-auto">
                  <button 
                    onClick={() => openDetail(d)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    <FiEye size={14} /> Detail
                  </button>
                  <button
                    onClick={() => handleDaftar(d.id)}
                    disabled={d.sudah_daftar || isFull || isPending}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      d.sudah_daftar ? 'bg-green-100 text-green-700' : 
                      isFull ? 'bg-red-50 text-red-400 cursor-not-allowed border border-red-100' :
                      isPending ? 'bg-slate-200 text-slate-400 cursor-not-allowed' :
                      'bg-[#00a7c4] hover:bg-[#008ba3] text-white'
                    }`}
                  >
                    <FiSend size={14} />
                    {d.sudah_daftar ? 'Terdaftar' : isFull ? 'Penuh' : 'Daftar'}
                  </button>
                </div>
              </div>
            )
          })}
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
          onDaftar={handleDaftar}
          dudiId={selectedDudi.id} 
        />
      )}
    </div>
  )
}