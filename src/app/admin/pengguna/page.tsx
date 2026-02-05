import { getUserStats, getUserList } from '@/lib/services/adminuser'
import UserTableClient from './usertable'
import { Users, Shield, GraduationCap, User } from 'lucide-react'
export const dynamic = 'force-dynamic'
export default async function PenggunaPage({ searchParams }: any) {
  const q = searchParams.q || ''
  const limit = Number(searchParams.limit || 5)
  const page = Number(searchParams.page || 1)

  const stats = await getUserStats()
  const { data, total } = await getUserList({ search: q, limit, page })

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Manajemen User</h1>
        <p className="text-sm text-gray-500">Kelola akun pengguna sistem</p>
      </div>

      {/* TABLE */}
      <UserTableClient data={data} total={total} />
    </div>
  )
}
