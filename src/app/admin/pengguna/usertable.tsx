'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Pencil,
  Trash2,
  Users,
  Mail,
  Shield,
  GraduationCap,
  User,
  X,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import AddUserModal from '@/components/admin/adduser'
import EditUserModal from '@/components/admin/edituser'
import Toast from '@/components/ui/toast'

export default function UserTableClient({ data, total }: any) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [openEdit, setOpenEdit] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  // --- LOGIC SEARCH ---
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (searchTerm) params.set('q', searchTerm); else params.delete('q')
      params.set('page', '1') // Reset ke hal 1 saat cari
      router.push(`${pathname}?${params.toString()}`)
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  // --- LOGIC PAGINATION ---
  const currentPage = Number(searchParams.get('page')) || 1
  const limit = 10 // Sesuaikan dengan limit di API/Server
  const totalPages = Math.ceil(total / limit)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  // --- UI HELPERS ---
  const handleActionSuccess = (message: string) => {
    setToastMsg(message)
    router.refresh()
  }

  function RoleIcon({ role }: { role: string }) {
    if (role === 'admin') return <Shield size={14} />
    if (role === 'guru') return <GraduationCap size={14} />
    return <User size={14} />
  }

  // Fungsi Warna Role
  function getRoleBadgeColor(role: string) {
    if (role === 'admin') return 'bg-rose-100 text-rose-700 border-rose-200'
    if (role === 'guru') return 'bg-amber-100 text-amber-700 border-amber-200'
    return 'bg-emerald-100 text-emerald-700 border-emerald-200' // Siswa
  }

  // ... fungsi delete & dialog tetap sama ...
  function openEditDialog(user: any) { setSelectedUser(user); setOpenEdit(true); }
  function closeEditDialog() { setSelectedUser(null); setOpenEdit(false); }
  function openDeleteDialog(user: any) { setSelectedUser(user); setOpenDelete(true); }
  function closeDeleteDialog() { setSelectedUser(null); setOpenDelete(false); }

  async function handleDelete() {
    if (!selectedUser) return
    setLoading(true)
    const { error } = await supabase.from('users').delete().eq('id', selectedUser.id)
    setLoading(false)
    if (error) { alert(error.message); return }
    closeDeleteDialog()
    handleActionSuccess("User berhasil dihapus!")
  }

  return (
    <>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Users size={18} className="text-cyan-500" />
            Daftar User
          </h2>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
              />
            </div>
            
            <button
              onClick={() => setOpenAdd(true)}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 transition-colors whitespace-nowrap"
            >
              + Tambah User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Role</th>
                <th className="text-left py-2">Terdaftar</th>
                <th className="text-center py-2">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {data.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 text-gray-700">
                    <Mail size={14} className="inline mr-1 text-gray-400" />
                    {u.email}
                  </td>

                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border font-medium ${getRoleBadgeColor(u.role)}`}>
                      <RoleIcon role={u.role} />
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 text-gray-500">
                    {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>

                  <td className="py-3">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => openEditDialog(u)} className="text-gray-400 hover:text-cyan-600 transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => openDeleteDialog(u)} className="text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION UI */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <p className="text-xs text-gray-400">
            Menampilkan {data.length} dari {total} data
          </p>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-1 rounded border hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1 mx-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                      currentPage === i + 1 
                      ? 'bg-cyan-600 text-white' 
                      : 'border hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-1 rounded border hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals tetap sama */}
      {openDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800">Konfirmasi Hapus</h3>
              <button onClick={closeDeleteDialog} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <p className="text-sm text-slate-600 mb-6">Apakah anda yakin ingin menghapus user <span className="font-bold text-slate-900">{selectedUser?.name}</span>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={closeDeleteDialog} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-lg">Batal</button>
              <button onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg disabled:opacity-50">
                {loading ? 'Menghapus...' : 'Ya, Hapus User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {openAdd && (
        <AddUserModal 
          onClose={() => setOpenAdd(false)} 
          onSuccess={() => handleActionSuccess("User baru berhasil ditambahkan!")}
        />
      )}

      {openEdit && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={closeEditDialog}
          onSuccess={(msg: string) => handleActionSuccess(msg || "Profil berhasil diperbarui!")}
        />
      )}
    </>
  )
}