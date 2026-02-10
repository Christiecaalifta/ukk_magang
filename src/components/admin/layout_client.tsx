'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Users,
  LogOut,
  Settings,
  GraduationCap,
} from 'lucide-react'


/* ================= TYPE ================= */

interface User {
  id: string
  name: string
  role: string
}

/* ================= COMPONENT ================= */

export default function AdminLayoutClient({
  children,
  school,
}: {
  children: React.ReactNode
  school: any
}) {
  const pathname = usePathname()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [openMenu, setOpenMenu] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)
  const [schoolData, setSchoolData] = useState(school)


  /* ================= GET USER ================= */
  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        })

        if (!res.ok) return

        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.error('Get user error:', err)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  async function handleLogout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    window.location.href = '/login'
  } catch (err) {
    console.error('Logout error:', err)
  }
}


  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex bg-[#f6f9fc]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-white border-r flex flex-col justify-between">

        <div>

          {/* LOGO */}
          <div className="flex items-center gap-3 px-6 py-5 border-b">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
              <GraduationCap size={20} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="font-bold text-lg">SIMMAS</h1>
              <p className="text-xs text-gray-500">Panel Admin</p>
            </div>
          </div>

          {/* MENU */}
          <nav className="px-4 py-6 space-y-2">

            <SidebarItem
              href="/admin/dashboard"
              active={pathname.startsWith('/admin/dashboard')}
              label="Dashboard"
              subtitle="Ringkasan sistem"
              icon={<LayoutDashboard size={16} />}
            />

            <SidebarItem
              href="/admin/dudi"
              active={pathname.startsWith('/admin/dudi')}
              label="DUDI"
              subtitle="Manajemen DUDI"
              icon={<Building2 size={16} />}
            />

            <SidebarItem
              href="/admin/pengguna"
              active={pathname.startsWith('/admin/pengguna')}
              label="Pengguna"
              subtitle="Manajemen user"
              icon={<Users size={16} />}
            />

            <SidebarItem
              href="/admin/pengaturan"
              active={pathname.startsWith('/admin/pengaturan')}
              label="Pengaturan"
              subtitle="Konfigurasi sistem"
              icon={<Settings size={16} />}
            />

          </nav>
        </div>

       {/* ================= FOOTER ================= */}
        <div className="px-6 py-4">

          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-100/50">
            <p className="font-bold text-xs leading-tight mb-1 truncate">
              {school?.nama_sekolah || "Nama Sekolah"}
            </p>

            <div className="flex items-center gap-1.5 opacity-80">
              <div className="w-1 h-1 rounded-full bg-cyan-200" />
              <p className="text-[9px] font-medium tracking-wide">
                v1.0 System
              </p>
            </div>
          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col">

        {/* ================= HEADER ================= */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">

          {/* LEFT */}
          <div>
            <h2 className="flex items-center gap-2 font-semibold text-gray-800">
  {school?.logo_url && (
    <img src={school.logo_url} className="w-8 h-8 object-contain rounded" />
  )}
  {school?.nama_sekolah}
</h2>


            <p className="text-xs text-gray-500">
              Sistem Manajemen Magang Siswa
            </p>
          </div>

         {/* RIGHT (PROFILE) */}
<div className="relative">

  {/* BUTTON PROFILE */}
  <button
    onClick={() => setOpenMenu(!openMenu)}
    className="flex items-center gap-3 focus:outline-none"
  >

    {/* TEXT */}
    <div className="text-right">

      <p className="text-sm font-semibold text-gray-700">
        {loading ? 'Loading...' : user?.name || 'Admin'}
      </p>

      <p className="text-xs text-gray-500 capitalize">
        {user?.role || '-'}
      </p>

    </div>

    {/* AVATAR / LOGO */}
<div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 
                flex items-center justify-center text-white font-bold">
  {user?.name?.charAt(0).toUpperCase() || 'A'}
</div>



  </button>

  {/* DROPDOWN */}
  {openMenu && (
    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-50">

      <button
        onClick={() => {
          setOpenMenu(false)
          setOpenLogout(true)
        }}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50"
      >
        <LogOut size={16} />
        Logout
      </button>

    </div>
  )}

</div>
        </header>

        {/* ================= CONTENT ================= */}
        <section className="flex-1 overflow-y-auto p-6">
          {children}
        </section>
{/* ================= LOGOUT MODAL ================= */}
{openLogout && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">

    <div className="bg-white rounded-xl w-full max-w-sm p-6">

      <h3 className="font-semibold text-lg mb-2">
        Konfirmasi Logout
      </h3>

      <p className="text-sm text-gray-600 mb-5">
        Apakah kamu yakin ingin keluar?
      </p>

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setOpenLogout(false)}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
        >
          Batal
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Ya, Logout
        </button>

      </div>

    </div>

  </div>
)}

      </main>

    </div>
  )
}

/* ================= SIDEBAR ITEM ================= */

function SidebarItem({
  href,
  label,
  subtitle,
  icon,
  active,
}: {
  href: string
  label: string
  subtitle?: string
  icon: React.ReactNode
  active?: boolean
}) {
  return (
    <Link href={href}>

      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
          active
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >

        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            active
              ? 'bg-white/20'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {icon}
        </div>

        <div>
          <p className="font-semibold leading-tight">
            {label}
          </p>

          {subtitle && (
            <p className="text-xs opacity-80">
              {subtitle}
            </p>
          )}
        </div>

      </div>

    </Link>
  )
}
