'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Briefcase,
  GraduationCap,
  LogOut
} from 'lucide-react'

/* ================= TYPE ================= */

interface User {
  id: string
  name: string
  role: string
}

/* ================= COMPONENT ================= */

export default function SiswaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [openMenu, setOpenMenu] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)

  /* ================= GET USER ================= */
  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        })

        if (!res.ok) {
          router.push('/login')
          return
        }

        const data = await res.json()

        // Pastikan role siswa
        if (data.role !== 'siswa') {
          router.push('/login')
          return
        }

        setUser(data)
      } catch (err) {
        console.error(err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  /* ================= LOGOUT ================= */
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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

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
              <p className="text-xs text-gray-500">Panel Siswa</p>
            </div>

          </div>

          {/* MENU */}
          <nav className="px-4 py-6 space-y-2">

            <SidebarItem
              href="/siswa/dashboard"
              active={pathname.startsWith('/siswa/dashboard')}
              label="Dashboard"
              subtitle="Ringkasan aktivitas"
              icon={<LayoutDashboard size={16} />}
            />

            <SidebarItem
              href="/siswa/dudi"
              active={pathname.startsWith('/siswa/dudi')}
              label="DUDI"
              subtitle="Dunia Usaha & Industri"
              icon={<Building2 size={16} />}
            />

            <SidebarItem
              href="/siswa/jurnal"
              active={pathname.startsWith('/siswa/jurnal')}
              label="Jurnal"
              subtitle="Catatan kegiatan"
              icon={<BookOpen size={16} />}
            />

            <SidebarItem
              href="/siswa/magang"
              active={pathname.startsWith('/siswa/magang')}
              label="Magang"
              subtitle="Data magang"
              icon={<Briefcase size={16} />}
            />

          </nav>

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t">

          <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs">
            Sistem Pelaporan v1.0
          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">

          {/* LEFT */}
          <div>
            <h2 className="font-semibold text-gray-800">
              Sistem Manajemen Magang
            </h2>

            <p className="text-xs text-gray-500">
              Panel Siswa
            </p>
          </div>

          {/* RIGHT */}
          <div className="relative">

            {/* BUTTON PROFILE */}
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-3 focus:outline-none"
            >

              <div className="text-right">

                <p className="text-sm font-semibold text-gray-700">
                  {user?.name}
                </p>

                <p className="text-xs text-gray-500">
                  Siswa
                </p>

              </div>

              <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold uppercase">
                {user?.name?.charAt(0)}
              </div>

            </button>

            {/* DROPDOWN */}
            {/* DROPDOWN */}
{openMenu && (
  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-50">
    <button
      onClick={() => {
        setOpenLogout(true)  // buka modal logout
        setOpenMenu(false)   // tutup dropdown
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

        {/* CONTENT */}
        <section className="flex-1 p-6 overflow-y-auto">
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
}: any) {
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

          <p className="text-xs opacity-80">
            {subtitle}
          </p>
        </div>

      </div>

    </Link>
  )
}
