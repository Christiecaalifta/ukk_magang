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
  const [guruList, setGuruList] = useState<any[]>([]) // ✅ list guru

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!isOpen) return

    const fetchData = async () => {
      try {
        // Ambil siswa
        const { data: siswa } = await supabase
          .from('siswa')
          .select('id, nama')

        // Ambil DUDI
        const { data: dudi } = await supabase
          .from('dudi')
          .select('id, nama_perusahaan')

        // Ambil guru
        const { data: guru } = await supabase
          .from('guru')
          .select('id, nama')

        setSiswaList(siswa || [])
        setDudiList(dudi || [])
        setGuruList(guru || [])

      } catch (err) {
        console.error('Fetch error:', err)
      }
    }

    fetchData()
  }, [isOpen])

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setSuccess('')

    // Validasi
    if (
      !siswaId ||
      !guruId ||
      !dudiId ||
      !tanggalMulai ||
      !tanggalSelesai
    ) {
      setError('Semua data wajib diisi')
      setLoading(false)
      return
    }

    // Insert
    const { error: insertError } = await supabase
      .from('magang')
      .insert([
        {
          siswa_id: Number(siswaId),
          guru_id: Number(guruId),
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

    setSuccess('Data berhasil disimpan!')

    // Reset
    setSiswaId('')
    setGuruId('')
    setGuruName('')
    setDudiId('')
    setTanggalMulai('')
    setTanggalSelesai('')
    setStatus('pending')

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
            <label className="text-xs font-semibold">
              Siswa
            </label>

            <select
              value={siswaId}
              onChange={(e) => setSiswaId(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-xl"
            >
              <option value="">Pilih Siswa</option>

              {siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>

          {/* GURU */}
          <div>
            <label className="text-xs font-semibold">
              Guru Pembimbing
            </label>

            <select
              value={guruId}
              onChange={(e) => {
                const selectedId = e.target.value

                setGuruId(selectedId)

                const selectedGuru = guruList.find(
                  (g) => g.id == selectedId
                )

                setGuruName(selectedGuru?.nama || '')
              }}
              className="w-full mt-1 px-4 py-2 border rounded-xl"
            >
              <option value="">Pilih Guru</option>

              {guruList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nama}
                </option>
              ))}
            </select>
          </div>

          {/* DUDI */}
          <div>
            <label className="text-xs font-semibold">
              DUDI
            </label>

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

          {/* TANGGAL + STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

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
                <option value="pending">Pending</option>
                <option value="berlangsung">Aktif</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>

          </div>

          {/* ERROR / SUCCESS */}
          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-500 text-sm">
              {success}
            </p>
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
