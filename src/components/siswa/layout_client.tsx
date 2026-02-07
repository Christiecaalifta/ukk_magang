// 'use client'
// import { useState } from 'react'
// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import {
//   LayoutDashboard,
//   Building2,
//   BookOpen,
//   Briefcase,
//   GraduationCap,
// } from 'lucide-react'

// export default function SiswaLayoutClient({ children, user, profile, school }: any) {
//   const pathname = usePathname()
//   const router = useRouter()

//   const [openMenu, setOpenMenu] = useState(false)
//   const [openLogout, setOpenLogout] = useState(false)

//   async function handleLogout() {
//     await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
//     window.location.href = '/login'
//   }

//   return (
//     <div className="min-h-screen flex bg-[#f6f9fc]">
//       {/* SIDEBAR */}
//       <aside className="w-72 bg-white border-r flex flex-col justify-between">
//         <div>
//           <div className="flex items-center gap-3 px-6 py-5 border-b">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
//               <GraduationCap size={20} />
//             </div>
//             <div>
//               <h1 className="font-bold text-lg">{school?.nama_sekolah || 'SIMMAS'}</h1>
//               <p className="text-xs text-gray-500">Panel Siswa</p>
//             </div>
//           </div>

//           {/* MENU */}
//           <nav className="px-4 py-6 space-y-2">
//             <SidebarItem
//               href="/siswa/dashboard"
//               active={pathname.startsWith('/siswa/dashboard')}
//               label="Dashboard"
//               subtitle="Ringkasan aktivitas"
//               icon={<LayoutDashboard size={16} />}
//             />
//             <SidebarItem
//               href="/siswa/dudi"
//               active={pathname.startsWith('/siswa/dudi')}
//               label="DUDI"
//               subtitle="Dunia Usaha & Industri"
//               icon={<Building2 size={16} />}
//             />
//             <SidebarItem
//               href="/siswa/jurnal"
//               active={pathname.startsWith('/siswa/jurnal')}
//               label="Jurnal"
//               subtitle="Catatan kegiatan"
//               icon={<BookOpen size={16} />}
//             />
//             <SidebarItem
//               href="/siswa/magang"
//               active={pathname.startsWith('/siswa/magang')}
//               label="Magang"
//               subtitle="Data magang"
//               icon={<Briefcase size={16} />}
//             />
//           </nav>
//         </div>

//         {/* FOOTER */}
//         <div className="px-6 py-4 border-t">
//           <div className="p-3 rounded-xl bg-green-500 text-white text-xs">
//             Sistem Pelaporan v1.0
//           </div>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="flex-1 flex flex-col">
//         <header className="h-16 bg-white border-b flex items-center justify-between px-8">
//           <div>
//             <h2 className="font-semibold">{school?.nama_sekolah || 'SIMMAS'}</h2>
//             <p className="text-xs text-gray-500">Panel Siswa</p>
//           </div>

//           <div className="relative">
//             <button onClick={() => setOpenMenu(!openMenu)} className="flex items-center gap-3">
//               <div className="text-right">
//                 <p className="text-sm font-semibold">{profile?.nama || user?.email}</p>
//                 <p className="text-xs text-gray-500">Siswa</p>
//               </div>
//               <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
//                 {(profile?.nama || user?.email)?.charAt(0)}
//               </div>
//             </button>

//             {openMenu && (
//               <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow">
//                 <button
//                   onClick={() => { setOpenLogout(true); setOpenMenu(false) }}
//                   className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </header>

//         <section className="flex-1 p-6">{children}</section>
//       </main>

//       {/* MODAL LOGOUT */}
//       {openLogout && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white rounded-xl p-6 w-80">
//             <h3 className="font-semibold mb-2">Logout</h3>
//             <p className="text-sm mb-4">Yakin ingin keluar?</p>
//             <div className="flex justify-end gap-2">
//               <button onClick={() => setOpenLogout(false)} className="px-3 py-1 border rounded">
//                 Batal
//               </button>
//               <button onClick={handleLogout} className="px-3 py-1 bg-red-600 text-white rounded">
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// function SidebarItem({ href, label, subtitle, icon, active }: any) {
//   return (
//     <Link href={href}>
//       <div className={`flex gap-3 px-4 py-3 rounded-xl ${active ? 'bg-cyan-500 text-white' : 'hover:bg-gray-100'}`}>
//         <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg">{icon}</div>
//         <div>
//           <p className="font-semibold">{label}</p>
//           <p className="text-xs">{subtitle}</p>
//         </div>
//       </div>
//     </Link>
//   )
// }
