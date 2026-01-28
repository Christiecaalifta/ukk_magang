import { User } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="flex justify-between items-center bg-white px-6 py-4 border-b">
      <div>
        <h2 className="text-sm font-semibold">SMK Negeri 1 Surabaya</h2>
        <p className="text-xs text-gray-500">
          Sistem Manajemen Magang Siswa
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-blue-100 p-2 rounded-full">
          <User size={16} className="text-blue-600" />
        </div>
        <div className="text-sm">
          <p className="font-medium">Admin Sistem</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
      </div>
    </header>
  )
}
