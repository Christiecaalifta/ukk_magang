'use client'

import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'
import { useState } from "react"

import {
  LayoutDashboard,
  Building2,
  Briefcase,
  BookOpen,
  LogOut,
  User,
} from "lucide-react"

/* ================= LAYOUT ================= */

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()
  const router = useRouter()

  const [openProfile, setOpenProfile] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)

  /* ================= LOGOUT ================= */

  function handleLogout() {

    // Hapus token/session
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Redirect ke login
    router.replace('/login')
  }

  return (
    <div className="min-h-screen flex bg-[#f6f9fc]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-white border-r flex flex-col justify-between">

        {/* LOGO */}
        <div>
          <div className="flex items-center gap-3 px-6 py-5 border-b">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white font-bold">
              G
            </div>
            <div>
              <h1 className="font-bold text-lg">SIMMAS</h1>
              <p className="text-xs text-gray-500">Panel Guru</p>
            </div>
          </div>

          {/* MENU */}
          <nav className="px-4 py-6 space-y-2">

            <SidebarItem
              href="/guru/dashboard"
              active={pathname.startsWith('/guru/dashboard')}
              label="Dashboard"
              subtitle="Ringkasan aktivitas"
              icon={<LayoutDashboard size={16} />}
            />

            <SidebarItem
              href="/guru/dudi"
              active={pathname.startsWith('/guru/dudi')}
              label="DUDI"
              subtitle="Dunia Usaha & Industri"
              icon={<Building2 size={16} />}
            />

            <SidebarItem
              href="/guru/magang"
              active={pathname.startsWith('/guru/magang')}
              label="Magang"
              subtitle="Data siswa magang"
              icon={<Briefcase size={16} />}
            />

            <SidebarItem
              href="/guru/jurnal"
              active={pathname.startsWith('/guru/jurnal')}
              label="Jurnal Harian"
              subtitle="Catatan kegiatan siswa"
              icon={<BookOpen size={16} />}
            />

          </nav>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t">
          <div className="p-3 rounded-xl bg-cyan-500 text-white text-xs">
            <p className="font-semibold">SMK Negeri 1 Surabaya</p>
            <p className="opacity-90">Sistem Pelaporan v1.0</p>
          </div>
        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col">

        {/* ================= TOPBAR ================= */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 relative">

          <div>
            <h2 className="font-semibold text-gray-800">SMK Negeri 1 Surabaya</h2>
            <p className="text-xs text-gray-500">
              Sistem Manajemen Magang Siswa
            </p>
          </div>

          {/* ================= USER ================= */}
          <div className="relative">

            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-3 hover:bg-gray-100 px-3 py-1 rounded-lg transition"
            >

              <div className="text-right">
                <p className="text-sm font-medium">Guru Pembimbing</p>
                <p className="text-xs text-gray-500">Guru</p>
              </div>

              <div className="w-9 h-9 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
                G
              </div>

            </button>

            {/* ================= DROPDOWN ================= */}
            {openProfile && (

              <div className="absolute right-0 top-14 w-48 bg-white shadow-lg border rounded-xl overflow-hidden z-50">

                <button
                  onClick={() => {
                    setOpenProfile(false)
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
        <section className="flex-1 p-6 overflow-y-auto">
          {children}
        </section>

      </main>


      {/* ================= MODAL LOGOUT ================= */}
      {openLogout && (

        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">

          <div className="bg-white rounded-xl w-full max-w-sm p-5">

            <h3 className="font-semibold text-lg mb-2">
              Konfirmasi Logout
            </h3>

            <p className="text-sm text-gray-600 mb-5">
              Apakah kamu yakin ingin keluar?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setOpenLogout(false)}
                className="px-4 py-2 text-sm rounded-lg border"
              >
                Batal
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

/* ================= SIDEBAR ITEM ================= */

function SidebarItem({
  href,
  label,
  subtitle,
  icon,
  active = false,
}: {
  href: string
  label: string
  subtitle: string
  icon: React.ReactNode
  active?: boolean
}) {

  return (
    <Link href={href}>

      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
          ${
            active
              ? "bg-cyan-500 text-white shadow"
              : "text-gray-600 hover:bg-gray-100"
          }`
        }
      >

        {/* ICON */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition
            ${
              active
                ? "bg-white/20 text-white"
                : "bg-gray-200 text-gray-600"
            }`
          }
        >
          {icon}
        </div>

        {/* TEXT */}
        <div className="leading-tight">
          <p className="font-semibold">{label}</p>

          <p
            className={`text-xs ${
              active ? "text-white/80" : "text-gray-500"
            }`}
          >
            {subtitle}
          </p>
        </div>

      </div>

    </Link>
  )
}
