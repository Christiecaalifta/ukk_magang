'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Building2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EditDudiModal({
  dudiId,
  onClose,
  onSuccess,
}: {
  dudiId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nama_perusahaan: '',
    alamat: '',
    telepon: '',
    email: '',
    penanggung_jawab: '',
    status: 'aktif',
  })

  /* ================= AMBIL DATA LAMA ================= */
  useEffect(() => {
    getDudi()
  }, [])

  async function getDudi() {
    const { data, error } = await supabase
      .from('dudi')
      .select('*')
      .eq('id', dudiId)
      .single()

    if (error) {
      setError('Gagal mengambil data')
      return
    }

    setForm({
      nama_perusahaan: data.nama_perusahaan,
      alamat: data.alamat,
      telepon: data.telepon,
      email: data.email,
      penanggung_jawab: data.penanggung_jawab,
      status: data.status,
    })
  }

  /* ================= HANDLE CHANGE ================= */
  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  /* ================= UPDATE ================= */
  async function handleSubmit(e: any) {
    e.preventDefault()
    setError('')

    if (
      !form.nama_perusahaan ||
      !form.alamat ||
      !form.telepon ||
      !form.email ||
      !form.penanggung_jawab
    ) {
      setError('Semua field wajib diisi')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('dudi')
      .update({
        nama_perusahaan: form.nama_perusahaan,
        alamat: form.alamat,
        telepon: form.telepon,
        email: form.email,
        penanggung_jawab: form.penanggung_jawab,
        status: form.status,
      })
      .eq('id', dudiId)

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    onSuccess()
    router.refresh()
  }

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white">
            <Building2 size={20} />
          </div>

          <div>
            <h1 className="font-bold text-lg">Edit DUDI</h1>
            <p className="text-sm text-gray-500">
              Perbarui informasi DUDI
            </p>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <Field label="Nama Perusahaan" required>
            <input
              name="nama_perusahaan"
              value={form.nama_perusahaan}
              onChange={handleChange}
              className="input"
            />
          </Field>

          <Field label="Alamat" required>
            <input
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              className="input"
            />
          </Field>

          <Field label="Telepon" required>
            <input
              name="telepon"
              value={form.telepon}
              onChange={handleChange}
              className="input"
            />
          </Field>

          <Field label="Email" required>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
            />
          </Field>

          <Field label="Penanggung Jawab" required>
            <input
              name="penanggung_jawab"
              value={form.penanggung_jawab}
              onChange={handleChange}
              className="input"
            />
          </Field>

          <Field label="Status" required>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Tidak Aktif</option>
            </select>
          </Field>

          {/* FOOTER */}
          <div className="flex gap-2 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Batal
            </button>

            <button
              disabled={loading}
              className={`w-full rounded-lg py-2 text-sm font-medium
                ${
                  loading
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-cyan-600 text-white hover:bg-cyan-700'
                }
              `}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}

/* ================= FIELD ================= */

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {children}
    </div>
  )
}
