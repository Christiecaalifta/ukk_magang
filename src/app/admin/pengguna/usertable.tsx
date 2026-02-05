'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Pencil,
  Trash2,
  Users,
  Mail,
  CheckCircle,
  Shield,
  GraduationCap,
  User,
  X
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import AddUserModal from '@/components/admin/adduser'
import EditUserModal from '@/components/admin/edituser'


export default function UserTableClient({ data, total }: any) {
  const router = useRouter()
  const [openEdit, setOpenEdit] = useState(false)

  const [openAdd, setOpenAdd] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function openEditDialog(user: any) {
  setSelectedUser(user)
  setOpenEdit(true)
}

function closeEditDialog() {
  setSelectedUser(null)
  setOpenEdit(false)
}

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  function RoleIcon({ role }: { role: string }) {
    if (role === 'admin') return <Shield size={14} />
    if (role === 'guru') return <GraduationCap size={14} />
    return <User size={14} />
  }

  function openDeleteDialog(user: any) {
    setSelectedUser(user)
    setOpenDelete(true)
  }

  function closeDeleteDialog() {
    setSelectedUser(null)
    setOpenDelete(false)
  }

  async function handleDelete() {
    if (!selectedUser) return

    setLoading(true)

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', selectedUser.id)

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    closeDeleteDialog()
    router.refresh()
  }

  return (
    <>
      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Users size={18} className="text-cyan-500" />
            Daftar User
          </h2>

          <button
            onClick={() => setOpenAdd(true)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700"
          >
            + Tambah User
          </button>
        </div>

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
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-gray-100">
                    <RoleIcon role={u.role} />
                    {u.role}
                  </span>
                </td>

                <td className="py-3 text-gray-500">
                  {formatDate(u.created_at)}
                </td>

                <td className="py-3">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => openEditDialog(u)}
                      className="text-gray-400 hover:text-cyan-600"
                    >
                      <Pencil size={16} />
                    </button>


                    <button
                      onClick={() => openDeleteDialog(u)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-xs text-gray-400 mt-4">
          Menampilkan {data.length} dari {total} data
        </p>
      </div>

      {/* ================= MODAL DELETE ================= */}
      {openDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-md p-5">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">Konfirmasi Hapus</h3>
              <button onClick={closeDeleteDialog}>
                <X />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-5">
              Apakah anda yakin ingin menghapus user {selectedUser?.name} ini? Tindakan ini tidak dapat dibatalkan
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={closeDeleteDialog} className="border px-4 py-2 rounded-lg">
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                {loading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ADD USER ================= */}
      {openAdd && (
        <AddUserModal onClose={() => setOpenAdd(false)} />
      )}
      {openEdit && selectedUser && (
  <EditUserModal
    user={selectedUser}
    onClose={closeEditDialog}
    onSuccess={() => {
      closeEditDialog()
      router.refresh()
    }}
  />
)}

      
    </>
    
  )
}
