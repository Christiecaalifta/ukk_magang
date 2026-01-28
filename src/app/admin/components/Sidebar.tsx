import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
} from 'lucide-react'

const menus = [
  { name: 'Dashboard', icon: LayoutDashboard, active: true },
  { name: 'DUDI', icon: Building2 },
  { name: 'Pengguna', icon: Users },
  { name: 'Pengaturan', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-blue-600">SIMMAS</h1>
        <p className="text-xs text-gray-500">Panel Admin</p>
      </div>

      <nav className="space-y-2">
        {menus.map((menu) => (
          <div
            key={menu.name}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer
              ${
                menu.active
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <menu.icon size={18} />
            <span className="text-sm">{menu.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  )
}
