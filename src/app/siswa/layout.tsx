'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Briefcase,
} from "lucide-react"

export default function SiswaLayout({
  children,
  siswaName = "Siswa Name",
}: {
  children: React.ReactNode
  siswaName?: string
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex bg-[#f6f9fc]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-white border-r flex flex-col justify-between">

        {/* LOGO */}
        <div>
          <div className="flex items-center gap-3 px-6 py-5 border-b">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white font-bold">
              S
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
              active={pathname.startsWith("/siswa/dashboard")}
              label="Dashboard"
              subtitle="Ringkasan aktivitas"
              icon={<LayoutDashboard size={16} />}
            />
            <SidebarItem
              href="/siswa/dudi"
              active={pathname.startsWith("/siswa/dudi")}
              label="DUDI"
              subtitle="Dunia Usaha & Industri"
              icon={<Building2 size={16} />}
            />
            <SidebarItem
              href="/siswa/jurnal"
              active={pathname.startsWith("/siswa/jurnal")}
              label="Jurnal Harian"
              subtitle="Catatan kegiatan"
              icon={<BookOpen size={16} />}
            />
            <SidebarItem
              href="/siswa/magang"
              active={pathname.startsWith("/siswa/magang")}
              label="Magang"
              subtitle="Data magang saya"
              icon={<Briefcase size={16} />}
            />
          </nav>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t">
          <div className="p-3 rounded-xl bg-gray-100 text-gray-600 text-xs flex flex-col gap-1">
            <p className="font-semibold">SMK Negeri 1 Surabaya</p>
            <p className="opacity-80">Sistem Pelaporan v1.0</p>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div>
            <h2 className="font-semibold text-gray-800">SMK Negeri 1 Surabaya</h2>
            <p className="text-xs text-gray-500">Sistem Manajemen Magang Siswa</p>
          </div>

          {/* USER */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{siswaName}</p>
              <p className="text-xs text-gray-500">Siswa</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
              {siswaName[0] || "S"}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="flex-1 p-6 overflow-y-auto">
          {children}
        </section>
      </main>
    </div>
  )
}

/* ================= COMPONENT ================= */

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
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
          active
            ? "bg-cyan-500 text-white shadow"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
            active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          {icon}
        </div>
        <div className="leading-tight">
          <p className="font-semibold">{label}</p>
          <p className={`text-xs ${active ? "text-white/80" : "text-gray-500"}`}>
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  )
}
