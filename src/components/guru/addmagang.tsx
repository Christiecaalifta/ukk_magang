'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  guruId: number
  guruName?: string
}

export default function TambahMagangModal({
  isOpen,
  onClose,
  onSuccess,
  guruId,
  guruName,
}: ModalProps) {
  /* ================= STATE ================= */

  const [siswaId, setSiswaId] = useState('')
  const [dudiId, setDudiId] = useState('')
  const [tanggalMulai, setTanggalMulai] = useState('')
  const [tanggalSelesai, setTanggalSelesai] = useState('')
  const [status, setStatus] = useState('pending')

  const [selectedGuruId, setSelectedGuruId] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [siswaList, setSiswaList] = useState<any[]>([])
  const [dudiList, setDudiList] = useState<any[]>([])
  const [guruList, setGuruList] = useState<any[]>([])

  const statusOptions = [
    'pending',
    'diterima',
    'ditolak',
    'berlangsung',
    'selesai',
    'dibatalkan',
  ]

  /* ================= SET GURU LOGIN ================= */

  useEffect(() => {
    if (isOpen && guruId) {
      setSelectedGuruId(String(guruId))
    }
  }, [isOpen, guruId])

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!isOpen || !guruId) return

    const fetchData = async () => {
      try {
        /* === SISWA BIMBINGAN === */
        const { data: siswaData, error: siswaErr } = await supabase
          .from('siswa')
          .select('id, nama, nis')
          .eq('guru_id', guruId)

        if (siswaErr) throw siswaErr

        /* === DUDI === */
        const { data: dudiData } = await supabase
          .from('dudi')
          .select('id, nama_perusahaan')

        /* === GURU (OPSIONAL) === */
        const { data: guruData } = await supabase
          .from('guru')
          .select('id, nama')

        setSiswaList(siswaData || [])
        setDudiList(dudiData || [])
        setGuruList(guruData || [])
      } catch (err) {
        console.error(err)
        setError('Gagal memuat data')
      }
    }

    fetchData()
  }, [isOpen, guruId])

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    if (
      !siswaId ||
      !selectedGuruId ||
      !dudiId ||
      !tanggalMulai ||
      !tanggalSelesai
    ) {
      setError('Semua data wajib diisi')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('magang')
      .insert([
        {
          siswa_id: Number(siswaId),
          guru_id: Number(selectedGuruId),
          dudi_id: Number(dudiId),
          tanggal_mulai: tanggalMulai,
          tanggal_selesai: tanggalSelesai,
          status,
        },
      ])

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    onSuccess()

    /* RESET */
    setSiswaId('')
    setDudiId('')
    setTanggalMulai('')
    setTanggalSelesai('')
    setStatus('pending')
    setSelectedGuruId('')

    onClose()
  }

  if (!isOpen) return null

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">
              Tambah Data Siswa Magang
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Masukkan data magang siswa
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
        >

          {/* SISWA */}
          <div>
            <label className="text-xs font-semibold">Siswa</label>

            <select
              value={siswaId}
              onChange={(e) => setSiswaId(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-xl"
            >
              <option value="">Pilih Siswa</option>

              {siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} {s.nis ? `(${s.nis})` : ''}
                </option>
              ))}
            </select>

            {siswaList.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Tidak ada siswa bimbingan Anda
              </p>
            )}
          </div>

          {/* GURU */}
          <div>
            <label className="text-xs font-semibold">
              Guru Pembimbing
            </label>

            <input
              value={guruName || 'Guru Login'}
              disabled
              className="w-full mt-1 px-4 py-2 border rounded-xl bg-gray-100"
            />

            <p className="text-xs text-blue-600 mt-1">
              ✓ Terisi otomatis
            </p>
          </div>

          {/* DUDI */}
          <div>
            <label className="text-xs font-semibold">DUDI</label>

            <select
              value={dudiId}
              onChange={(e) => setDudiId(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-xl"
            >
              <option value="">Pilih DUDI</option>

              {dudiList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama_perusahaan}
                </option>
              ))}
            </select>
          </div>

          {/* TANGGAL */}
          <div className="grid md:grid-cols-3 gap-4">

            <div>
              <label className="text-xs font-semibold">
                Tanggal Mulai
              </label>

              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">
                Tanggal Selesai
              </label>

              <input
                type="date"
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-xl"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* BUTTON */}
          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-xl"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}
