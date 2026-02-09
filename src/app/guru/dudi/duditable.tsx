'use client'

import { 
  Building2, MapPin, Mail, Phone, User, 
  Search, ChevronLeft, ChevronRight 
} from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function DudiTableClient({ data, total }: any) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page') || 1)
  const limit = 5
  const totalPage = Math.ceil(total / limit)

  function handleSearch(q: string) {
    const params = new URLSearchParams(window.location.search)
    params.set('search', q)
    params.set('page', '1') // reset ke hal 1
    router.push(`?${params.toString()}`)
  }

  function goToPage(p: number) {
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(p))
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* TABLE HEADER & SEARCH */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-50">
        <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm">
          <Building2 size={18} />
          Daftar DUDI
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input
              type="text"
              placeholder="Cari perusahaan, alamat, penanggung jawab..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              defaultValue={searchParams.get('search') || ''}
              onKeyDown={(e: any) => e.key === 'Enter' && handleSearch(e.target.value)}
            />
          </div>
          <div className="text-xs text-gray-400 whitespace-nowrap hidden md:block">
            Tampilkan: <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100 text-slate-700 mx-1">10</span> per halaman
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-[0.05em] font-bold">
              <th className="px-6 py-4">Perusahaan</th>
              <th className="px-6 py-4">Kontak</th>
              <th className="px-6 py-4">Penanggung Jawab</th>
              <th className="px-6 py-4 text-center">Siswa Magang</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400 text-sm">Tidak ada data DUDI ditemukan</td>
              </tr>
            ) : (
              data.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-cyan-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-cyan-100">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{d.nama_perusahaan}</p>
                        <p className="text-[10px] text-gray-400 italic mt-0.5 flex items-center gap-1">
                          <MapPin size={10} /> {d.alamat}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Mail size={12} /> {d.email}
                      </p>
                      <p className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                        <Phone size={12} /> {d.telepon}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <User size={14} className="text-gray-300" />
                      {d.penanggung_jawab || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="bg-[#a3e635] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm shadow-lime-100">
                      {/* Nilai siswa diambil dari total bimbingan per dudi */}
                      {totalSiswaPerDudi(d)} 
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER / PAGINATION */}
      <div className="p-6 border-t border-gray-50 flex justify-between items-center text-[11px] text-gray-400">
        <p>Menampilkan {(page - 1) * limit + 1} sampai {Math.min(page * limit, total)} dari {total} entri</p>
        
        <div className="flex items-center gap-1">
          <button 
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPage }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-all ${
                page === i + 1
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-100'
                  : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={page === totalPage}
            onClick={() => goToPage(page + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Fungsi dummy untuk UI badge siswa (sebaiknya dihitung di server jika memungkinkan)
function totalSiswaPerDudi(dudi: any) {
    return Math.floor(Math.random() * 10) + 1 
}