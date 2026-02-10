'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Props {
  isOpen: boolean
  onClose: () => void
  magangId: number | null
  onSuccess: () => void // ✅ TAMBAH UNTUK TOAST
}

export default function EditMagangModal({
  isOpen,
  onClose,
  magangId,
  onSuccess,
}: Props) {

  /* ================= STATE ================= */
  const [siswaId, setSiswaId] = useState('')
  const [guruId, setGuruId] = useState('')
  const [dudiId, setDudiId] = useState('')

  const [tanggalMulai, setTanggalMulai] = useState('')
  const [tanggalSelesai, setTanggalSelesai] = useState('')
  const [status, setStatus] = useState('pending')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [siswaList, setSiswaList] = useState<any[]>([])
  const [guruList, setGuruList] = useState<any[]>([])
  const [dudiList, setDudiList] = useState<any[]>([])

  /* ================= ENUM STATUS ================= */
  const statusOptions = [
    'pending',
    'diterima',
    'ditolak',
    'berlangsung',
    'selesai',
    'dibatalkan',
  ]

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!isOpen || !magangId) return

    const fetchAll = async () => {
      try {
        /* List */
        const { data: siswa } = await supabase
          .from('siswa')
          .select('id, nama')

        const { data: guru } = await supabase
          .from('guru')
          .select('id, nama')

        const { data: dudi } = await supabase
          .from('dudi')
          .select('id, nama_perusahaan')

        setSiswaList(siswa || [])
        setGuruList(guru || [])
        setDudiList(dudi || [])

        /* Data Magang */
        const { data: magang, error } = await supabase
          .from('magang')
          .select('*')
          .eq('id', magangId)
          .single()

        if (error || !magang) {
          setError('Data magang tidak ditemukan')
          return
        }

        setSiswaId(String(magang.siswa_id))
        setGuruId(String(magang.guru_id))
        setDudiId(String(magang.dudi_id))

        setTanggalMulai(magang.tanggal_mulai || '')
        setTanggalSelesai(magang.tanggal_selesai || '')
        setStatus(magang.status)

      } catch (err) {
        console.error(err)
        setError('Gagal memuat data')
      }
    }

    fetchAll()
  }, [isOpen, magangId])

  /* ================= UPDATE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!magangId) return

    setLoading(true)
    setError('')

    /* VALIDASI */
    if (!siswaId || !guruId || !dudiId || !status) {
      setError('Siswa, Guru, DUDI, dan Status wajib diisi')
      setLoading(false)
      return
    }

    if (
      (status === 'berlangsung' || status === 'selesai') &&
      (!tanggalMulai || !tanggalSelesai)
    ) {
      setError('Tanggal Mulai & Selesai wajib diisi')
      setLoading(false)
      return
    }

    /* UPDATE */
    const { error: updateError } = await supabase
      .from('magang')
      .update({
        siswa_id: Number(siswaId),
        guru_id: Number(guruId),
        dudi_id: Number(dudiId),
        tanggal_mulai: tanggalMulai || null,
        tanggal_selesai: tanggalSelesai || null,
        status,
      })
      .eq('id', magangId)

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    /* ================= SUCCESS ================= */

    onSuccess() // 🔔 trigger toast
    onClose()   // tutup modal
  }

  if (!isOpen) return null

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Edit Data Magang</h2>
            <p className="text-sm text-gray-400">
              Perbarui data magang siswa
            </p>
          </div>

          <button onClick={onClose}>
            <X />
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
              onChange={(e) => setGuruId(e.target.value)}
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

          {/* TANGGAL & STATUS */}
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
              <label className="text-xs font-semibold">Status</label>

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
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}
