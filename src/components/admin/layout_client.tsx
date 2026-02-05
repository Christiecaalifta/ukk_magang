'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  GraduationCap
} from 'lucide-react'

export default function AdminLayoutClient({
  children,
  school,
}: {
  children: React.ReactNode
  school: any
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex bg-[#f6f9fc]">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r flex flex-col justify-between">

        <div>
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

        {/* FOOTER */}
        <div className="px-6 py-4 border-t">
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs">
            <p className="font-semibold">{school?.nama_sekolah}</p>
            <p className="opacity-90">Sistem Pelaporan v1.0</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div>
            <h2 className="font-semibold text-gray-800">
              {school?.nama_sekolah}
            </h2>
            <p className="text-xs text-gray-500">
              Sistem Manajemen Magang Siswa
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            A
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6">
          {children}
        </section>
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
          <p className="font-semibold leading-tight">{label}</p>
          {subtitle && (
            <p className="text-xs opacity-80">{subtitle}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
