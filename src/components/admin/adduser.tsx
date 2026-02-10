'use client'

import { useState, useEffect } from 'react'
import { 
  X, Eye, EyeOff, User, Mail, Shield, Lock, 
  GraduationCap, BookOpen, Fingerprint, 
  Briefcase, MapPin, Phone, CheckCircle2 
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Tambahkan onSuccess ke dalam interface props
interface AddUserModalProps {
  onClose: () => void;
  onSuccess: (message: string) => void; 
}

export default function AddUserModal({ onClose, onSuccess }: AddUserModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [guruOptions, setGuruOptions] = useState<{user_id: string, nama: string}[]>([])

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'siswa',
    password: '',
    confirmPassword: '',
    verified: 'false',
    kelas: '',
    jurusan: '',
    nis: '',
    nip: '',
    alamat: '',
    telepon: '',
    pembimbing: '',
  })

  useEffect(() => {
    async function fetchGuru() {
      try {
        const res = await fetch('/api/users?role=guru')
        const data = await res.json()
        setGuruOptions(data)
      } catch (err) {
        console.error('Gagal fetch guru', err)
      }
    }
    fetchGuru()
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'auto' }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (isInvalid) return

    setLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          verified: form.verified === 'true',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Gagal menambahkan user')

      // Panggil onSuccess dengan pesan sebelum menutup modal
      onSuccess("User baru berhasil didaftarkan!")
      onClose()
      
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isInvalid =
    !form.name ||
    !form.email ||
    !form.password ||
    form.password !== form.confirmPassword ||
    (form.role === 'siswa' && (!form.kelas || !form.jurusan || !form.nis || !form.pembimbing)) ||
    (form.role === 'guru' && (!form.nip || !form.alamat || !form.telepon))

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-100">
              <User size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-tight">Tambah User</h2>
              <p className="text-xs text-slate-400 font-medium">Registrasi akun sistem baru</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
          
          <div className="space-y-4">
            <Field label="Nama Lengkap" icon={<User size={14} />} required>
              <input name="name" onChange={handleChange} placeholder="Masukkan nama lengkap" className="input-v2" />
            </Field>

            <Field label="Alamat Email" icon={<Mail size={14} />} required>
              <input name="email" type="email" onChange={handleChange} placeholder="email@sekolah.sch.id" className="input-v2" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Role User" icon={<Shield size={14} />} required>
                <select name="role" value={form.role} onChange={handleChange} className="input-v2 appearance-none">
                  <option value="siswa">Siswa</option>
                  <option value="guru">Guru</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>

              <Field label="Status Verifikasi" icon={<CheckCircle2 size={14} />} required>
                <select name="verified" onChange={handleChange} className="input-v2 appearance-none">
                  <option value="false">Belum Verifikasi</option>
                  <option value="true">Terverifikasi</option>
                </select>
              </Field>
            </div>
          </div>

          {(form.role === 'siswa' || form.role === 'guru') && (
            <div className="pt-4 border-t border-slate-50 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-1 bg-cyan-500 rounded-full" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Informasi {form.role}</h3>
              </div>

              {form.role === 'siswa' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Kelas" icon={<GraduationCap size={14} />} required>
                      <input name="kelas" onChange={handleChange} placeholder="Contoh: XII" className="input-v2" />
                    </Field>
                    <Field label="Jurusan" icon={<BookOpen size={14} />} required>
                      <input name="jurusan" onChange={handleChange} placeholder="Contoh: RPL" className="input-v2" />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="NIS" icon={<Fingerprint size={14} />} required>
                      <input name="nis" onChange={handleChange} placeholder="Nomor Induk Siswa" className="input-v2" />
                    </Field>
                    <Field label="Guru Pembimbing" icon={<User size={14} />} required>
                      <select name="pembimbing" value={form.pembimbing} onChange={handleChange} className="input-v2">
                        <option value="">-- Pilih Guru --</option>
                        {guruOptions.map((g) => (
                          <option key={g.user_id} value={g.user_id}>{g.nama}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>
              )}

              {form.role === 'guru' && (
                <div className="space-y-4">
                  <Field label="NIP / ID Guru" icon={<Briefcase size={14} />} required>
                    <input name="nip" onChange={handleChange} placeholder="Masukkan NIP" className="input-v2" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Nomor Telepon" icon={<Phone size={14} />} required>
                      <input name="telepon" onChange={handleChange} placeholder="08..." className="input-v2" />
                    </Field>
                    <Field label="Alamat" icon={<MapPin size={14} />} required>
                      <input name="alamat" onChange={handleChange} placeholder="Kota Asal" className="input-v2" />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-50 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-1 bg-blue-600 rounded-full" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Keamanan Akun</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Kata Sandi" icon={<Lock size={14} />} required>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    onChange={handleChange}
                    className="input-v2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              <Field label="Konfirmasi" required>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    onChange={handleChange}
                    className="input-v2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-50/80 backdrop-blur-sm border-t border-slate-100 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-500 bg-white hover:bg-slate-50 transition-all active:scale-95"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isInvalid || loading}
            className={`flex-[2] px-6 py-3.5 rounded-2xl text-sm font-black shadow-lg transition-all active:scale-[0.98]
              ${isInvalid || loading
                ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-100 hover:shadow-cyan-200 hover:brightness-110'
              }`}
          >
            {loading ? 'Sedang Memproses...' : 'Daftarkan User Baru'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .input-v2 {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
          transition: all 0.2s ease;
        }
        .input-v2:focus {
          outline: none;
          border-color: #06b6d4;
          background-color: white;
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1);
        }
        .input-v2::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
      `}</style>
    </div>
  )
}

function Field({ label, icon, required, children }: { label: string, icon?: React.ReactNode, required?: boolean, children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-2">
        {icon}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}