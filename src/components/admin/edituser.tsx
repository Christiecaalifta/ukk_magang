'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { X, User, Mail, Shield, CheckCircle, AlertCircle, Save } from 'lucide-react'

export default function EditUserModal({ user, onClose, onSuccess }: any) {
  const [nama, setNama] = useState(user.name)
  const [role, setRole] = useState(user.role)
  const [email, setEmail] = useState(user.email)
  const [verified, setVerified] = useState(user.email_verified)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('users')
      .update({
        name: nama,
        email: email,
        role,
        email_verified_at: verified ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Edit Profil User</h2>
            <p className="text-xs text-slate-400 font-medium">ID User: #{user.id.toString().slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="space-y-4">
            {/* NAMA LENGKAP */}
            <Field label="Nama Lengkap" icon={<User size={14} />} required>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                placeholder="Nama lengkap user"
                className="input-v2"
              />
            </Field>

            {/* EMAIL */}
            <Field label="Alamat Email" icon={<Mail size={14} />} required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@sekolah.sch.id"
                className="input-v2"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              {/* ROLE */}
              <Field label="Role Akses" icon={<Shield size={14} />} required>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-v2 appearance-none"
                >
                  <option value="siswa">Siswa</option>
                  <option value="guru">Guru</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>

              {/* VERIFIED */}
              <Field label="Status Akun" icon={<CheckCircle size={14} />}>
                <select
                  value={verified ? 'true' : 'false'}
                  onChange={(e) => setVerified(e.target.value === 'true')}
                  className="input-v2 appearance-none"
                >
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
                </select>
              </Field>
            </div>
          </div>

          {/* CATATAN / INFO BOX */}
          <div className="flex gap-3 bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-700">
            <AlertCircle size={24} className="shrink-0 opacity-70" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold mb-0.5">Keamanan Akun</p>
              <p className="opacity-80">Perubahan email memerlukan verifikasi ulang. Untuk mengganti password, silakan gunakan modul Reset Password.</p>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all
                ${loading 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-cyan-100 active:scale-[0.98]'
                }`}
            >
              {loading ? 'Menyimpan...' : (
                <>
                  <Save size={16} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input-v2 {
          width: 100%;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .input-v2:focus {
          background-color: #ffffff;
          border-color: #0891b2;
          box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.1);
        }
      `}</style>
    </div>
  )
}

function Field({ label, icon, required, children }: any) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
        {icon}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}