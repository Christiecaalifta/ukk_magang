'use client'

import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AddUserModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'siswa',
    password: '',
    confirmPassword: '',
    verified: 'false',
  })

  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  /* LOCK SCROLL */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      form.password !== form.confirmPassword
    ) {
      alert('Lengkapi data dengan benar')
      return
    }

    setLoading(true)

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        verified: form.verified === 'true',
      }),
    })

    setLoading(false)

    if (!res.ok) {
  const err = await res.json()
  alert(err.message)
  return
}


    onClose()
    router.refresh()
  }

  const disabled =
    !form.name ||
    !form.email ||
    !form.password ||
    form.password !== form.confirmPassword

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-xl">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold">Tambah User</h2>
            <p className="text-xs text-gray-500">
              Lengkapi informasi user
            </p>
          </div>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-3">

          <Field label="Nama Lengkap" required>
            <div className="relative">
              <input
                name="name"
                placeholder="Nama lengkap"
                onChange={handleChange}
                className="input"
              />
              <MoreHorizontal className="icon-right" />
            </div>
          </Field>

          <Field label="Email" required>
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="input"
            />
          </Field>

          <Field label="Role" required>
            <select name="role" onChange={handleChange} className="input">
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </Field>

          <Field label="Password" required>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="input"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="icon-right"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </Field>

          <Field label="Konfirmasi Password" required>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Ulangi password"
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="input"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="icon-right"
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </Field>

          <Field label="Email Verification">
            <select
              name="verified"
              onChange={handleChange}
              className="input"
            >
              <option value="false">Unverified</option>
              <option value="true">Verified</option>
            </select>
          </Field>
        </div>

        {/* FOOTER */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg border py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={disabled || loading}
            className={`w-full rounded-lg py-2 text-sm font-medium
              ${
                disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-cyan-600 text-white hover:bg-cyan-700'
              }
            `}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* HELPER */
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
    <div className="space-y-0.5">
      <label className="text-xs font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}
