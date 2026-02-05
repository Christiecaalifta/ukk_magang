'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import {
  Settings,
  School,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  Hash,
  Pencil,
} from 'lucide-react'

export default function SchoolSettingClient({ initialData }: any) {
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    logo_url: initialData.logo_url,
    nama_sekolah: initialData.nama_sekolah,
    alamat: initialData.alamat,
    telepon: initialData.telepon,
    email: initialData.email,
    website: initialData.website,
    kepala_sekolah: initialData.kepala_sekolah,
    npsn: initialData.npsn,
  })

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSave() {
  setLoading(true)

  const { error } = await supabase
    .from('school_settings')
    .update({
      ...form,
      updated_at: new Date().toISOString(),
    })
    .eq('id', initialData.id)

  setLoading(false)

  if (error) {
    alert(error.message)
    return
  }

  setEdit(false)

  // 🔥 INI KUNCINYA
  router.refresh()
}

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ================= INFORMASI SEKOLAH ================= */}
      <div className="lg:col-span-2 bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-cyan-600" />
            <h2 className="font-semibold">Informasi Sekolah</h2>
          </div>

          <button
            onClick={() => (edit ? handleSave() : setEdit(true))}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-cyan-600 text-white"
          >
            <Pencil size={14} />
            {edit ? 'Simpan' : 'Edit'}
          </button>
        </div>

        <FormItem icon={<School />} label="Nama Sekolah / Instansi">
          <Input name="nama_sekolah" value={form.nama_sekolah} onChange={handleChange} disabled={!edit} />
        </FormItem>

        <FormItem icon={<MapPin />} label="Alamat Lengkap">
          <Input name="alamat" value={form.alamat} onChange={handleChange} disabled={!edit} />
        </FormItem>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem icon={<Phone />} label="Telepon">
            <Input name="telepon" value={form.telepon} onChange={handleChange} disabled={!edit} />
          </FormItem>

          <FormItem icon={<Mail />} label="Email">
            <Input name="email" value={form.email} onChange={handleChange} disabled={!edit} />
          </FormItem>
        </div>

        <FormItem icon={<Globe />} label="Website">
          <Input name="website" value={form.website} onChange={handleChange} disabled={!edit} />
        </FormItem>

        <FormItem icon={<User />} label="Kepala Sekolah">
          <Input name="kepala_sekolah" value={form.kepala_sekolah} onChange={handleChange} disabled={!edit} />
        </FormItem>

        <FormItem icon={<Hash />} label="NPSN">
          <Input name="npsn" value={form.npsn} onChange={handleChange} disabled={!edit} />
        </FormItem>

        <p className="text-xs text-gray-400 mt-4">
          Terakhir diperbarui: {new Date(initialData.updated_at).toLocaleString()}
        </p>
      </div>

      {/* ================= PREVIEW ================= */}
      <div className="space-y-4">

        <Card title="Preview Tampilan" subtitle="Pratinjau bagaimana informasi sekolah akan ditampilkan" />

        {/* Dashboard Header */}
        <PreviewCard title="Dashboard Header">
          <div className="flex items-center gap-3 bg-cyan-50 p-3 rounded-lg">
            <img src={form.logo_url || '/logo.png'} className="w-10 h-10 rounded" />
            <div>
              <p className="font-semibold">{form.nama_sekolah}</p>
              <p className="text-xs text-gray-500">Sistem Informasi Magang</p>
            </div>
          </div>
        </PreviewCard>

        {/* Sertifikat */}
        <PreviewCard title="Header Rapor / Sertifikat">
          <div className="text-sm">
            <p className="font-bold">{form.nama_sekolah}</p>
            <p>{form.alamat}</p>
            <p>Telp: {form.telepon} | Email: {form.email}</p>
            <p className="mt-2 font-semibold">SERTIFIKAT MAGANG</p>
          </div>
        </PreviewCard>

        {/* Dokumen */}
        <PreviewCard title="Dokumen Cetak">
          <p className="text-xs text-gray-600">
            Header dan footer akan digunakan pada dokumen yang dicetak
          </p>
        </PreviewCard>

        {/* Info */}
        <div className="bg-white border rounded-xl p-4 text-sm">
          <p className="font-semibold mb-2">Informasi Penggunaan:</p>
          <ul className="list-disc pl-4 space-y-1 text-blue-600">
            <li>Dashboard: logo & nama sekolah</li>
            <li>Rapor/Sertifikat: header dokumen resmi</li>
            <li>Dokumen Cetak: footer laporan</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ================= COMPONENT KECIL ================= */

function FormItem({ icon, label, children }: any) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-2 text-sm font-medium mb-1">
        {icon}
        {label}
      </label>
      {children}
    </div>
  )
}

function Input(props: any) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-100"
    />
  )
}

function Card({ title, subtitle }: any) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="font-semibold">{title}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  )
}

function PreviewCard({ title, children }: any) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-sm font-semibold mb-2">{title}</p>
      {children}
    </div>
  )
}
