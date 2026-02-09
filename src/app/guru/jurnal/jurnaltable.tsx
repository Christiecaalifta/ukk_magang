'use client'
import { useState } from 'react'
import { Eye, Search, Filter, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import DetailJurnalGuruModal from '@/components/guru/detailjurnal'

export default function JurnalTableClient({ data }: any) {
  const [selectedJurnal, setSelectedJurnal] = useState(null)
  

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'disetujui': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'ditolak': return 'bg-rose-50 text-rose-600 border-rose-100'
      default: return 'bg-orange-50 text-orange-600 border-orange-100'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Table Header / Toolbar */}
      <div className="p-6 border-b border-slate-50">
        <div className="flex items-center gap-2 mb-6">
            <BookOpen size={18} className="text-cyan-500" />
            <h2 className="font-bold text-slate-800">Daftar Logbook Siswa</h2>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari siswa, kegiatan, atau kendala..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                <Filter size={16} /> Tampilkan Filter
             </button>
             <div className="text-sm text-slate-500">
                Tampilkan: <select className="bg-transparent font-bold text-slate-800 outline-none"><option>10</option></select> per halaman
             </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-slate-50">
            <tr className="text-slate-400 text-[12px] uppercase tracking-wider">
              <th className="px-8 py-4 font-semibold w-12 text-center">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="px-6 py-4 font-semibold">Siswa & Tanggal</th>
              <th className="px-6 py-4 font-semibold">Kegiatan & Kendala</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Catatan Guru</th>
              <th className="px-6 py-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6 text-center">
                   <input type="checkbox" className="rounded border-slate-300" />
                </td>
                <td className="px-6 py-6 vertical-top">
                  <div className="font-bold text-slate-800 leading-tight">{item.magang?.siswa?.nama}</div>
                  <div className="text-[11px] text-slate-400 mt-1 uppercase">
                    NIS: {item.magang?.siswa?.nis} <br/> {formatDate(item.tanggal)}
                  </div>
                </td>
                <td className="px-6 py-6 max-w-md">
                  <div className="mb-2">
                    <span className="text-[11px] font-bold text-slate-800 block uppercase mb-1">Kegiatan:</span>
                    <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2">{item.kegiatan}</p>
                  </div>
                  {item.kendala && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-800 block uppercase mb-1">Kendala:</span>
                      <p className="text-[13px] text-slate-400 italic leading-relaxed line-clamp-2">{item.kendala}</p>
                    </div>
                  )}
                </td>
                <td className="px-6 py-6">
                  <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tighter ${getStatusStyle(item.status_verifikasi)}`}>
                    {item.status_verifikasi === 'pending' ? 'Belum Diverifikasi' : item.status_verifikasi}
                  </span>
                </td>
                <td className="px-6 py-6">
                  {item.catatan_guru ? (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-[12px] text-slate-600 max-w-[200px]">
                        {item.catatan_guru}
                    </div>
                  ) : (
                    <span className="text-[12px] text-slate-300 italic">Belum ada catatan</span>
                  )}
                </td>
                <td className="px-6 py-6 text-center">
                  <button
                    onClick={() => setSelectedJurnal(item)}
                    className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 border-t border-slate-50 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Menampilkan <span className="font-bold text-slate-800">1</span> sampai <span className="font-bold text-slate-800">{data.length}</span> dari <span className="font-bold text-slate-800">{data.length}</span> entri
        </p>
        <div className="flex gap-2">
            <button className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-30" disabled><ChevronLeft size={16}/></button>
            <button className="px-3 py-1 bg-cyan-500 text-white rounded-lg text-sm font-bold">1</button>
            <button className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-30" disabled><ChevronRight size={16}/></button>
        </div>
      </div>

      {selectedJurnal && (
        <DetailJurnalGuruModal
          data={selectedJurnal}
          onClose={() => setSelectedJurnal(null)}
          onSuccess={() => {
            setSelectedJurnal(null)
          }}
        />
      )}
    </div>
  )
}