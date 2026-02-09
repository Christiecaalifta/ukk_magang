'use client'

import { Search, Filter, Eye, CheckCircle, XCircle, BookOpen } from 'lucide-react'

export default function JurnalTableClient({ data }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm">
          <BookOpen size={18} />
          Daftar Logbook Siswa
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-6 bg-gray-50/50 flex flex-wrap gap-4 items-center border-b border-gray-50">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            placeholder="Cari siswa, kegiatan, atau kendala..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium">
          <Filter size={16} /> Tampilkan Filter
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4 w-10"><input type="checkbox" className="rounded" /></th>
              <th className="px-6 py-4">Siswa & Tanggal</th>
              <th className="px-6 py-4">Kegiatan & Kendala</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Catatan Guru</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {/* Contoh Baris Data Sesuai Gambar */}
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-6"><input type="checkbox" className="rounded" /></td>
              <td className="px-6 py-6">
                <div className="font-bold text-slate-800">Ahmad Rizki</div>
                <div className="text-[10px] text-gray-400 uppercase">NIS: 2024001</div>
                <div className="text-[10px] text-gray-400">1 Mar 2024</div>
              </td>
              <td className="px-6 py-6 max-w-md">
                <div className="mb-2">
                  <span className="font-bold text-[11px] block text-slate-700">Kegiatan:</span>
                  <p className="text-gray-500 text-xs leading-relaxed">Membuat desain UI aplikasi kasir menggunakan Figma...</p>
                </div>
                <div>
                  <span className="font-bold text-[11px] block text-slate-700">Kendala:</span>
                  <p className="text-gray-500 text-xs leading-relaxed">Kesulitan menentukan skema warna yang tepat...</p>
                </div>
              </td>
              <td className="px-6 py-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">Disetujui</span>
              </td>
              <td className="px-6 py-6">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500 italic">
                  Bagus, lanjutkan dengan implementasi
                </div>
              </td>
              <td className="px-6 py-6 text-center">
                <button className="p-2 text-gray-400 hover:text-cyan-600 transition-colors">
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}