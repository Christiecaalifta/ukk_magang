'use client'

import { useState, useEffect } from 'react'
import { 
  X, User, Mail, Shield, CheckCircle2, Save, 
  GraduationCap, BookOpen, Fingerprint, 
  Briefcase, MapPin, Phone, AlertCircle 
} from 'lucide-react'

export default function EditUserModal({ user, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [guruOptions, setGuruOptions] = useState<{user_id: string, nama: string}[]>([])

  const [form, setForm] = useState({
    name: '', email: '', role: 'siswa', verified: 'false',
    kelas: '', jurusan: '', nis: '', pembimbing: '',
    nip: '', alamat: '', telepon: '',
  })

  useEffect(() => {
    async function fetchUserDetail() {
      try {
        const res = await fetch(`/api/users?userId=${user.id}`)
        const fullData = await res.json()
        setForm({
          name: fullData.name || '',
          email: fullData.email || '',
          role: fullData.role || 'siswa',
          verified: fullData.email_verified_at ? 'true' : 'false',
          kelas: fullData.siswa?.kelas || '',
          jurusan: fullData.siswa?.jurusan || '',
          nis: fullData.siswa?.nis || '',
          pembimbing: fullData.siswa?.guru?.user_id || '',
          nip: fullData.guru?.nip || '',
          alamat: fullData.guru?.alamat || '',
          telepon: fullData.guru?.telepon || '',
        })
      } catch (err) { console.error(err) }
    }

    async function fetchGuru() {
      try {
        const res = await fetch('/api/users?role=guru')
        const data = await res.json()
        setGuruOptions(data)
      } catch (err) { console.error(err) }
    }
    
    fetchUserDetail()
    fetchGuru()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'auto' }
  }, [user.id])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...form }),
      })

      if (!res.ok) throw new Error('Gagal update user')

      // LANGSUNG TUTUP MODAL & KIRIM SINYAL SUKSES KE PARENT
      onSuccess("Profil berhasil diperbarui!") 
      onClose()

    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isInvalid = !form.name || !form.email

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <User size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Edit Profil</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">ID: #{user.id.toString().slice(0, 8)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-90"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <Field label="Nama Lengkap" icon={<User size={14}/>} required>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nama lengkap" className="input-v2" />
            </Field>
            <Field label="Email" icon={<Mail size={14}/>} required>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@sekolah.sch.id" className="input-v2" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Role Akses" icon={<Shield size={14}/>}>
                <select name="role" value={form.role} onChange={handleChange} className="input-v2 appearance-none">
                  <option value="siswa">Siswa</option>
                  <option value="guru">Guru</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>
              <Field label="Status Verifikasi" icon={<CheckCircle2 size={14}/>}>
                <select name="verified" value={form.verified} onChange={handleChange} className="input-v2 appearance-none">
                  <option value="false">Belum Verifikasi</option>
                  <option value="true">Terverifikasi</option>
                </select>
              </Field>
            </div>
          </div>

          {(form.role === 'siswa' || form.role === 'guru') && (
            <div className="pt-6 border-t border-slate-50 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-4 w-1 bg-cyan-500 rounded-full" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Informasi {form.role}</h3>
              </div>
              {form.role === 'siswa' && (
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <Field label="Kelas" icon={<GraduationCap size={14}/>}><input name="kelas" value={form.kelas} onChange={handleChange} className="input-v2" /></Field>
                      <Field label="Jurusan" icon={<BookOpen size={14}/>}><input name="jurusan" value={form.jurusan} onChange={handleChange} className="input-v2" /></Field>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                    <Field label="NIS" icon={<Fingerprint size={14}/>}><input name="nis" value={form.nis} onChange={handleChange} className="input-v2" /></Field>
                    <Field label="Pembimbing" icon={<User size={14}/>}>
                      <select name="pembimbing" value={form.pembimbing} onChange={handleChange} className="input-v2 appearance-none">
                        <option value="">Pilih Guru</option>
                        {guruOptions.map(g => <option key={g.user_id} value={g.user_id}>{g.nama}</option>)}
                      </select>
                    </Field>
                   </div>
                </div>
              )}
              {form.role === 'guru' && (
                <div className="space-y-4">
                  <Field label="NIP" icon={<Briefcase size={14}/>}><input name="nip" value={form.nip} onChange={handleChange} className="input-v2" /></Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Telepon" icon={<Phone size={14}/>}><input name="telepon" value={form.telepon} onChange={handleChange} className="input-v2" /></Field>
                    <Field label="Kota" icon={<MapPin size={14}/>}><input name="alamat" value={form.alamat} onChange={handleChange} className="input-v2" /></Field>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50/80 backdrop-blur-sm border-t border-slate-100 flex gap-4">
          <button type="button" onClick={onClose} className="flex-1 px-6 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-500 bg-white">Batal</button>
          <button onClick={handleSubmit} disabled={loading || isInvalid} className={`flex-[2] px-6 py-3.5 rounded-2xl text-sm font-black shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${loading || isInvalid ? 'bg-slate-200 text-slate-400' : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'}`}>
            {loading ? 'Memproses...' : <><Save size={18} strokeWidth={2.5} /> Simpan Perubahan</>}
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .input-v2 { width: 100%; padding: 0.75rem 1rem; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1.25rem; font-size: 0.875rem; font-weight: 500; color: #334155; transition: all 0.2s ease; outline: none; }
        .input-v2:focus { border-color: #06b6d4; background-color: white; box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1); }
      `}</style>
    </div>
  )
}

function Field({ label, icon, required, children }: any) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-2">
        {icon} {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}