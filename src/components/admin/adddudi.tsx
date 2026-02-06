'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Building2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TambahDudiModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  
  const [form, setForm] = useState({
    nama_perusahaan: '',
    alamat: '',
    telepon: '',
    email: '',
    penanggung_jawab: '',
    status: 'aktif',
  })
  const isDisabled =
  !form.nama_perusahaan ||
  !form.alamat ||
  !form.telepon ||
  !form.email ||
  !form.penanggung_jawab


  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  /* ================= VALIDASI ================= */

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function validatePhone(phone: string) {
    return /^[0-9]{10,15}$/.test(phone)
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: any) {
    e.preventDefault()
    setError('')
    setSuccess('')

    /* WAJIB ISI */
    if (
      !form.nama_perusahaan ||
      !form.alamat ||
      !form.telepon ||
      !form.email ||
      !form.penanggung_jawab
    ) {
      setError('Semua field bertanda * wajib diisi')
      return
    }

    /* EMAIL */
    if (!validateEmail(form.email)) {
      setError('Format email tidak valid')
      return
    }

    /* TELEPON */
    if (!validatePhone(form.telepon)) {
      setError('Nomor telepon harus 10–15 digit angka')
      return
    }

    setLoading(true)

    /* CEK DUPLIKAT */
    const { data: existing } = await supabase
      .from('dudi')
      .select('id')
      .eq('nama_perusahaan', form.nama_perusahaan)
      .maybeSingle()

    if (existing) {
      setLoading(false)
      setError('Nama perusahaan sudah terdaftar')
      return
    }

    /* INSERT */
    const { error } = await supabase.from('dudi').insert([
      {
        ...form,
        deleted_at: null,
      },
    ])

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }
onSuccess()
    router.refresh()

  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      {/* CARD */}
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
            <h1 className="font-bold text-lg">Tambah DUDI Baru</h1>
            <p className="text-sm text-gray-500">
              Lengkapi semua informasi perusahaan
            </p>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-3">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="bg-green-100 text-green-700 text-sm p-3 rounded mb-3">
            {success}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <Field
            label="Nama Perusahaan"
            name="nama_perusahaan"
            placeholder="Masukkan nama perusahaan"
            value={form.nama_perusahaan}
            onChange={handleChange}
          />

          <Field
            label="Alamat"
            name="alamat"
            placeholder="Masukkan alamat lengkap"
            value={form.alamat}
            onChange={handleChange}
          />

          <Field
            label="Telepon"
            name="telepon"
            placeholder="Contoh: 081234567890"
            value={form.telepon}
            onChange={handleChange}
          />

          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="contoh@email.com"
            value={form.email}
            onChange={handleChange}
          />

          <Field
            label="Penanggung Jawab"
            name="penanggung_jawab"
            placeholder="Nama penanggung jawab"
            value={form.penanggung_jawab}
            onChange={handleChange}
          />

          {/* STATUS */}
          <div>
            <label className="text-sm font-medium">
              Status <span className="text-red-500">*</span>
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Tidak Aktif</option>
            </select>
          </div>

         {/* FOOTER */}
<div className="flex gap-2 pt-4">

  {/* BATAL */}
  <button
    type="button"
    onClick={onClose}
    className="w-full rounded-lg border py-2 text-sm text-gray-600 hover:bg-gray-50"
  >
    Batal
  </button>

  {/* SIMPAN */}
  <button
    type="submit"
    disabled={loading || isDisabled}
    className={`w-full rounded-lg py-2 text-sm font-medium
      ${
        loading || isDisabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
}: any) {
  return (
    <div>
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 mt-1 text-sm
        focus:ring-2 focus:ring-cyan-400 outline-none"
      />
    </div>
  )
}
