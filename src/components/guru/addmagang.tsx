'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TambahMagangModal({ isOpen, onClose }: ModalProps) {
  const [siswaId, setSiswaId] = useState('')
  const [guruId, setGuruId] = useState('')
  const [guruName, setGuruName] = useState('') 
  const [dudiId, setDudiId] = useState('')
  const [tanggalMulai, setTanggalMulai] = useState('')
  const [tanggalSelesai, setTanggalSelesai] = useState('')
  const [status, setStatus] = useState('pending')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [siswaList, setSiswaList] = useState<any[]>([])
  const [dudiList, setDudiList] = useState<any[]>([])

  // Ambil data guru sesuai login
  useEffect(() => {
    if (!isOpen) return

    const fetchMe = async () => {
      try {
        const res = await fetch('/api/me')
        if (!res.ok) return
        const data = await res.json()
        if (data.role === 'guru' && data.guru) {
          setGuruId(data.guru.id)
          setGuruName(data.guru.nama)
        }
      } catch (err) {
        console.error('Gagal ambil data guru:', err)
      }
    }

    fetchMe()
  }, [isOpen])

  // Ambil list siswa & DUDI
  useEffect(() => {
    if (!isOpen) return

    const fetchData = async () => {
      const { data: siswa } = await supabase.from('siswa').select('id, nama')
      const { data: dudi } = await supabase.from('dudi').select('id, nama_perusahaan')
      setSiswaList(siswa || [])
      setDudiList(dudi || [])
    }

    fetchData()
  }, [isOpen])

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // ✅ Validasi semua wajib
    if (!siswaId || !guruId || !dudiId || !tanggalMulai || !tanggalSelesai) {
      setError('Semua data wajib diisi')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('magang').insert([{
      siswa_id: Number(siswaId),
      guru_id: Number(guruId),
      dudi_id: Number(dudiId),
      tanggal_mulai: tanggalMulai,
      tanggal_selesai: tanggalSelesai,
      status // default bisa 'pending' atau 'berlangsung' sesuai workflow
    }])

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setSuccess('Data berhasil disimpan!')

    // Reset form
    setSiswaId('')
    setDudiId('')
    setTanggalMulai('')
    setTanggalSelesai('')
    setStatus('pending')

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tambah Data Siswa Magang</h2>
            <p className="text-sm text-gray-400 mt-1">Masukkan informasi data magang siswa baru</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

          {/* Siswa */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">Siswa</label>
            <select 
              value={siswaId} 
              onChange={(e) => setSiswaId(e.target.value)} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Pilih Siswa</option>
              {siswaList.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
            </select>
          </div>

          {/* Guru Pembimbing */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 ml-1">Guru Pembimbing</label>
            <input
              type="text"
              value={guruName || 'Memuat nama guru...'}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed outline-none"
            />
            <input type="hidden" value={guruId} name="guru_id" />
          </div>

          {/* DUDI */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">DUDI</label>
            <select 
              value={dudiId} 
              onChange={(e) => setDudiId(e.target.value)} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Pilih DUDI</option>
              {dudiList.map((d) => <option key={d.id} value={d.id}>{d.nama_perusahaan}</option>)}
            </select>
          </div>

          {/* Periode & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Tanggal Mulai</label>
              <input type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Tanggal Selesai</label>
              <input type="date" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="pending">Pending</option>
                <option value="berlangsung">Aktif</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-gray-50 transition-all">
              Batal
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 transition-all">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
