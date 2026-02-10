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
  Eye,
  Layout,
  FileText,
  Printer,
  Upload
} from 'lucide-react'

export default function SchoolSettingClient({ initialData }: any) {
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [openDeleteLogo, setOpenDeleteLogo] = useState(false)

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
 async function handleDeleteLogo() {
  if (!form.logo_url) return

  setLoading(true)

  try {
    const fileName = form.logo_url.split('/').pop()

    if (fileName) {
      await supabase.storage
        .from('school-assets')
        .remove([fileName])
    }

    // 🔥 PENTING: update database
    const { error } = await supabase
      .from('school_settings')
      .update({ logo_url: null })
      .eq('id', initialData.id)

    if (error) throw error

    setForm({
      ...form,
      logo_url: null,
    })

    setOpenDeleteLogo(false)

    router.refresh() // optional tapi recommended
  } catch (err) {
    alert('Gagal menghapus logo')
    console.error(err)
  } finally {
    setLoading(false)
  }
}



  async function handleUploadLogo(e: any) {
  const file = e.target.files[0]

  if (!file) return

  setLoading(true)

  const fileExt = file.name.split('.').pop()
  const fileName = `logo-${Date.now()}.${fileExt}`

  const { error } = await supabase.storage
    .from('school-assets')
    .upload(fileName, file, {
      upsert: true,
    })

  if (error) {
    alert(error.message)
    setLoading(false)
    return
  }

  const { data } = supabase.storage
    .from('school-assets')
    .getPublicUrl(fileName)

  setForm({
    ...form,
    logo_url: data.publicUrl,
  })

  setLoading(false)
}

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
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      
      {/* ================= KOLOM KIRI: FORM INFORMASI ================= */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-50 rounded-xl text-cyan-600">
                  <Settings size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Informasi Sekolah</h2>
                  <p className="text-xs text-slate-400 font-medium">Konfigurasi data identitas instansi</p>
                </div>
              </div>

              <button
                onClick={() => (edit ? handleSave() : setEdit(true))}
                disabled={loading}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  edit 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-100' 
                  : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-cyan-100'
                } shadow-lg`}
              >
                {edit ? (loading ? 'Memproses...' : 'Simpan Perubahan') : (
                  <>
                    <Pencil size={14} />
                    Edit Data
                  </>
                )}
              </button>
            </div>

            <div className="space-y-6">
              {/* Logo Upload Placeholder */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  <Upload size={14} /> Logo Sekolah
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden">
                    {form.logo_url ? (
                      <img src={form.logo_url} className="w-full h-full object-contain" />
                    ) : (
                      <School className="text-slate-300" size={32} />
                    )}
                    
                  </div>
                  {edit && (
  <div className="flex gap-3">
    <input
      type="file"
      accept="image/*"
      hidden
      id="logoUpload"
      onChange={handleUploadLogo}
    />

    <label
      htmlFor="logoUpload"
      className="cursor-pointer text-xs font-bold text-cyan-600 bg-cyan-50 px-4 py-2 rounded-lg hover:bg-cyan-100"
    >
      {form.logo_url ? 'Ganti Logo' : 'Upload Logo'}
    </label>

    {form.logo_url && (
      <button
  type="button"
  onClick={() => setOpenDeleteLogo(true)}
  className="text-xs font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100"
>
  Hapus Logo
</button>

    )}
  </div>
)}


                </div>
              </div>

              <FormItem icon={<School size={16}/>} label="Nama Sekolah / Instansi">
                <Input name="nama_sekolah" value={form.nama_sekolah} onChange={handleChange} disabled={!edit} placeholder="Contoh: SMK Negeri 1 Surabaya" />
              </FormItem>

              <FormItem icon={<MapPin size={16}/>} label="Alamat Lengkap">
                <textarea
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                  disabled={!edit}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all disabled:opacity-60 resize-none font-medium text-slate-700"
                  placeholder="Jl. SMEA No.4, Sawahan..."
                />
              </FormItem>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem icon={<Phone size={16}/>} label="Telepon">
                  <Input name="telepon" value={form.telepon} onChange={handleChange} disabled={!edit} placeholder="031-xxxxxx" />
                </FormItem>
                <FormItem icon={<Mail size={16}/>} label="Email">
                  <Input name="email" value={form.email} onChange={handleChange} disabled={!edit} placeholder="info@sekolah.sch.id" />
                </FormItem>
              </div>

              <FormItem icon={<Globe size={16}/>} label="Website">
                <Input name="website" value={form.website} onChange={handleChange} disabled={!edit} placeholder="www.sekolah.sch.id" />
              </FormItem>

              <FormItem icon={<User size={16}/>} label="Kepala Sekolah">
                <Input name="kepala_sekolah" value={form.kepala_sekolah} onChange={handleChange} disabled={!edit} placeholder="Nama Lengkap & Gelar" />
              </FormItem>

              <FormItem icon={<Hash size={16}/>} label="NPSN (Nomor Pokok Sekolah Nasional)">
                <Input name="npsn" value={form.npsn} onChange={handleChange} disabled={!edit} placeholder="Nomor NPSN" />
              </FormItem>

              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Terakhir diperbarui: {new Date(initialData.updated_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= KOLOM KANAN: PREVIEW ================= */}
      <div className="space-y-6">
        
        {/* Title Preview */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <Eye size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Preview Tampilan</h2>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Pratinjau visual informasi sekolah</p>
              </div>
           </div>
        </div>

        {/* Dashboard Header Preview */}
        <PreviewCard icon={<Layout size={14}/>} title="Dashboard Header">
          <div className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-1">
               <img src={form.logo_url || '/logo.png'} className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">{form.nama_sekolah || 'Nama Sekolah'}</p>
              <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mt-1">Sistem Informasi Magang</p>
            </div>
          </div>
        </PreviewCard>

        {/* Sertifikat Preview */}
        <PreviewCard icon={<FileText size={14}/>} title="Header Rapor / Sertifikat">
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 text-center shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <img src={form.logo_url || '/logo.png'} className="w-10 h-10 object-contain mb-1" />
              <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{form.nama_sekolah}</p>
              <p className="text-[9px] text-slate-500 font-medium max-w-[200px] leading-relaxed italic">{form.alamat}</p>
              <div className="flex flex-wrap justify-center gap-x-2 text-[8px] text-slate-400 font-bold border-t border-slate-50 pt-2 mt-1">
                <span>Telp: {form.telepon}</span>
                <span>•</span>
                <span>Email: {form.email}</span>
                <span>•</span>
                <span>Web: {form.website}</span>
              </div>
              <div className="mt-4 py-1.5 px-6 border-y-2 border-slate-900 w-full">
                <p className="text-[10px] font-black text-slate-900 tracking-[0.2em] uppercase">Sertifikat Magang</p>
              </div>
            </div>
          </div>
        </PreviewCard>

        {/* Dokumen Cetak Preview */}
        <PreviewCard icon={<Printer size={14}/>} title="Dokumen Cetak">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1 flex-shrink-0">
               <img src={form.logo_url || '/logo.png'} className="w-full h-full object-contain grayscale opacity-50" />
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-slate-700">{form.nama_sekolah}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">NPSN: {form.npsn}</p>
               <p className="text-[8px] text-slate-400 leading-tight font-medium italic">{form.alamat}</p>
               <div className="flex gap-2 text-[8px] text-slate-400 font-bold pt-1">
                 <Mail size={8}/> {form.email}
               </div>
               <div className="flex gap-2 text-[8px] text-slate-400 font-bold">
                 <User size={8}/> Kepala Sekolah: {form.kepala_sekolah}
               </div>
            </div>
          </div>
        </PreviewCard>

        {/* Info Box */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6">
          <p className="text-xs font-bold text-blue-900 mb-4 flex items-center gap-2 italic">
             Informasi Penggunaan Data:
          </p>
          <div className="space-y-4">
            <InfoGuide icon={<Layout className="text-blue-500"/>} bold="Dashboard" text="Logo dan nama sekolah ditampilkan di header navigasi panel siswa & admin" />
            <InfoGuide icon={<FileText className="text-blue-500"/>} bold="Rapor/Sertifikat" text="Informasi lengkap digunakan sebagai kop dokumen resmi kelulusan magang" />
            <InfoGuide icon={<Printer className="text-blue-500"/>} bold="Dokumen Cetak" text="Footer atau header pada laporan aktivitas & jurnal yang dicetak" />
          </div>
        </div>
      </div>
      {openDeleteLogo && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95">

      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Hapus Logo Sekolah
      </h3>

      <p className="text-sm text-slate-600 mb-6">
        Logo sekolah akan dihapus dan tidak ditampilkan di dashboard maupun dokumen.
        Tindakan ini bisa dibatalkan sebelum disimpan.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setOpenDeleteLogo(false)}
          className="px-4 py-2 text-sm font-bold border rounded-lg hover:bg-slate-100"
        >
          Batal
        </button>

        <button
          onClick={handleDeleteLogo}
          disabled={loading}
          className="px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          {loading ? 'Menghapus...' : 'Ya, Hapus'}
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  )
}

/* ================= COMPONENT HELPER ================= */

function FormItem({ icon, label, children }: any) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
        <span className="text-slate-300">{icon}</span>
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
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all disabled:opacity-60"
    />
  )
}

function PreviewCard({ icon, title, children }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <p className="text-xs font-bold uppercase tracking-widest">{title}</p>
      </div>
      {children}
    </div>
  )
}

function InfoGuide({ icon, bold, text }: any) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5">{icon}</div>
      <p className="text-[11px] leading-relaxed text-slate-600">
        <strong className="text-blue-700 font-bold">{bold}:</strong> {text}
      </p>
    </div>
  )
}