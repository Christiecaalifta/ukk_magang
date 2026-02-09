'use client'
import { useState } from 'react'
import { Search, Filter, Plus, Edit3, Trash2, Building2, User, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import TambahMagangModal from '@/components/guru/addmagang'
import EditMagangModal from '@/components/guru/editmagang'


interface Props {
  data: any[]
  total: number
  page: number
  limit: number
  search: string
  status: string
}


export default function MagangClient({ data, total, page, limit, search, status }: Props) {
  const router = useRouter()
  const totalPage = Math.ceil(total / limit)
  const [isOpen, setIsOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const s = formData.get('search')
    const st = formData.get('status')
    router.push(`?search=${s}&status=${st}&page=1`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Table Action Header */}
      <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm">
          <User size={18} />
          Daftar Siswa Magang
        </div>
        
        <button
        onClick={() => setIsOpen(true)}
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-100">
          <Plus size={18} /> Tambah
        </button>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleSearch} className="p-6 bg-gray-50/50 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            name="search"
            defaultValue={search}
            placeholder="Cari siswa, guru, atau DUDI..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
                name="status"
                defaultValue={status}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500/20"
            >
                <option value="">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="selesai">Selesai</option>
                <option value="pending">Pending</option>
            </select>
        </div>

        <button type="submit" className="text-sm font-bold text-cyan-600 hover:text-cyan-700 px-4">
          Terapkan Filter
        </button>
        
        <div className="ml-auto text-sm text-gray-500">
            Tampilkan: <span className="font-bold text-slate-800">10</span>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Siswa</th>
              <th className="px-6 py-4">Guru Pembimbing</th>
              <th className="px-6 py-4">DUDI</th>
              <th className="px-6 py-4">Periode</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Nilai</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Data tidak ditemukan</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  {/* Siswa */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-sm">{item.siswa?.nama}</div>
                    <div className="text-[10px] text-gray-400 uppercase mt-1">NIS: {item.siswa?.nis || '2024001'}</div>
                    <div className="text-[10px] text-cyan-600 font-medium italic">Rekayasa Perangkat Lunak</div>
                  </td>

                  {/* Guru */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-300" />
                        <div>
                            <div className="text-sm font-medium text-slate-700">{item.guru?.nama}</div>
                            <div className="text-[10px] text-gray-400">NIP: {item.guru?.nip || '-'}</div>
                        </div>
                    </div>
                  </td>

                  {/* DUDI */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:bg-cyan-50 group-hover:text-cyan-500 transition-colors">
                            <Building2 size={16} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-700">{item.dudi?.nama_perusahaan}</div>
                            <div className="text-[10px] text-gray-400 italic">Jakarta</div>
                        </div>
                    </div>
                  </td>

                  {/* Periode */}
                  <td className="px-6 py-4 text-[11px] text-gray-500 leading-relaxed">
                    <div className="flex items-center gap-1"><Calendar size={12} /> {item.tanggal_mulai}</div>
                    <div className="text-gray-300 ml-4">s.d {item.tanggal_selesai}</div>
                    <div className="font-bold text-cyan-600 ml-4 italic">90 hari</div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>

                  {/* Nilai */}
                  <td className="px-6 py-4 text-center">
                    {item.nilai ? (
                        <span className="bg-lime-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">{item.nilai}</span>
                    ) : (
                        <span className="text-gray-300">-</span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                       <button
  onClick={() => {
    setSelectedId(item.id)
    setOpenEdit(true)
  }}
  title="Edit Data"
  className="p-2 text-gray-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-all"
>
  <Edit3 size={16} />
</button>
                        <button title="Hapus Data" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Sesuai Gambar) */}
      <div className="p-6 border-t border-gray-50 flex justify-between items-center text-[11px] text-gray-400 font-medium">
        <p>Menampilkan {(page - 1) * limit + 1} sampai {Math.min(page * limit, total)} dari {total} entri</p>
        
        <div className="flex items-center gap-2">
            <button className="p-1 hover:text-cyan-600 transition-colors"><ChevronLeft size={16} /></button>
            {Array.from({ length: totalPage }).map((_, i) => (
                <a
                    key={i}
                    href={`?page=${i + 1}&search=${search}&status=${status}`}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                        page === i + 1 ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-100' : 'hover:bg-gray-100'
                    }`}
                >
                    {i + 1}
                </a>
            ))}
            <button className="p-1 hover:text-cyan-600 transition-colors"><ChevronRight size={16} /></button>
        </div>
      </div>
      {/* Tambah Magang Modal */}
<TambahMagangModal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
/>
<EditMagangModal
  isOpen={openEdit}
  onClose={() => setOpenEdit(false)}
  magangId={selectedId}
/>

    </div>
  )
}


function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    aktif: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    selesai: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${configs[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  )
}