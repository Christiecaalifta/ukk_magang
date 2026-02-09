'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

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
        email:email,
        role,
        email_verified_at: verified
        ? new Date().toISOString()
        : null,
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">

        {/* HEADER */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Edit User</h2>
          <p className="text-sm text-gray-500">
            Perbarui informasi user
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAMA */}
          <div>
            <label className="text-sm font-medium">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* EMAIL */}
          <div>
        <label className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
        </label>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-cyan-500"
        />
        </div>

          {/* ROLE */}
          {/* ROLE */}
<div>
  <label className="text-sm font-medium">
    Role <span className="text-red-500">*</span>
  </label>

  <select
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-cyan-500"
  >
    <option value="siswa">Siswa</option>
    <option value="guru">Guru</option>
    <option value="admin">Admin</option>
  </select>
</div>


          {/* CATATAN */}
          <div className="bg-blue-50 text-blue-600 text-xs p-3 rounded-lg">
            <strong>Catatan:</strong> Untuk mengubah password, silakan
            gunakan fitur reset password yang terpisah.
          </div>

          {/* EMAIL VERIFICATION */}
          <div>
            <label className="text-sm font-medium">
              Email Verification
            </label>
            <select
              value={verified ? 'true' : 'false'}
              onChange={(e) => setVerified(e.target.value === 'true')}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            >
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-lg"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>

        </form>
      </div>
    </div>
    
  )
}
