'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export default function GuruPieChart({ data = [] }: any) {
  const COLORS = [
    '#06b6d4',
    '#3b82f6',
    '#22c55e',
    '#f97316',
    '#a855f7',
    '#ef4444',
  ]

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <p className="text-sm text-gray-400 text-center py-10">
          Belum ada data bimbingan guru
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border">
      <h2 className="font-semibold mb-4 text-sm">
        Distribusi Siswa per Guru
      </h2>

      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="jumlah"
              nameKey="nama"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              label
            >
              {data.map((_: any, i: number) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
