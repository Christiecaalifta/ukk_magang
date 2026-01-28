import { LucideIcon } from 'lucide-react'

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: number
  description: string
  icon: LucideIcon
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon size={18} className="text-blue-500" />
      </div>

      <h3 className="text-2xl font-bold mt-2">{value}</h3>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  )
}
