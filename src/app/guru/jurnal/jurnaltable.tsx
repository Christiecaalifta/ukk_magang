'use client'

import { useState, useEffect } from 'react'
import {
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react'

import { supabase } from '@/lib/supabase/client'
import DetailJurnalGuruModal from '@/components/guru/detailjurnal'
import Toast from '@/components/ui/toast'

export default function JurnalTableClient({ data: initialData }: any) {
  const [data, setData] = useState(initialData)
  const [selectedJurnal, setSelectedJurnal] = useState<any>(null)

  // State Toast di level Parent
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('logbook')
      .select(`
        id, tanggal, kegiatan, kendala, status_verifikasi, catatan_guru,
        magang (
          siswa ( nama, nis )
        )
      `)
      .order('tanggal', { ascending: false })

    if (error) {
      console.error(error)
      return
    }
    setData(data || [])
  }

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'disetujui': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'ditolak': return 'bg-rose-50 text-rose-600 border-rose-100'
      default: return 'bg-orange-50 text-orange-600 border-orange-100'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
      
      {/* TOAST DI LEVEL PARENT */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* HEADER */}
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
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-slate-50 transition-colors">
            <Filter size={16} /> Tampilkan Filter
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr className="text-slate-400 text-[12px] uppercase">
              <th className="px-8 py-4 text-center"><input type="checkbox" /></th>
              <th className="px-6 py-4">Siswa & Tanggal</th>
              <th className="px-6 py-4">Kegiatan & Kendala</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Catatan</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-6 text-center"><input type="checkbox" /></td>
                <td className="px-6 py-6">
                  <div className="font-bold text-slate-700">{item.magang?.siswa?.nama}</div>
                  <div className="text-xs text-slate-400">
                    NIS: {item.magang?.siswa?.nis} <br /> {formatDate(item.tanggal)}
                  </div>
                </td>
                <td className="px-6 py-6 max-w-md">
                  <p className="text-sm text-slate-600 line-clamp-2">{item.kegiatan}</p>
                  {item.kendala && <p className="text-xs italic text-orange-400 mt-1">⚠️ {item.kendala}</p>}
                </td>
                <td className="px-6 py-6">
                  <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(item.status_verifikasi)}`}>
                    {item.status_verifikasi}
                  </span>
                </td>
                <td className="px-6 py-6">
                  {item.catatan_guru ? (
                    <div className="p-2 bg-slate-50 border border-slate-100 rounded text-[11px] text-slate-500 italic max-w-[150px] truncate">
                      "{item.catatan_guru}"
                    </div>
                  ) : (
                    <span className="text-xs italic text-slate-300">Belum ada</span>
                  )}
                </td>
                <td className="px-6 py-6 text-center">
                  <button onClick={() => setSelectedJurnal(item)} className="p-2 text-slate-400 hover:text-cyan-600 transition-colors">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t flex justify-between items-center text-sm">
        <p className="text-slate-400 font-medium text-xs">Menampilkan {data.length} Logbook</p>
        <div className="flex gap-2">
          <button className="p-1 border rounded-md disabled:opacity-30" disabled><ChevronLeft size={16} /></button>
          <button className="bg-cyan-500 text-white px-3 py-1 rounded-md text-xs font-bold shadow-lg shadow-cyan-200">1</button>
          <button className="p-1 border rounded-md disabled:opacity-30" disabled><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* MODAL */}
      {selectedJurnal && (
        <DetailJurnalGuruModal
          data={selectedJurnal}
          onClose={() => setSelectedJurnal(null)}
          onSuccess={async (isError: boolean, message: string) => {
            if (isError) {
              showNotification(message, 'error')
            } else {
              await fetchData()
              setSelectedJurnal(null)
              showNotification(message, 'success')
            }
          }}
        />
      )}
    </div>
  )
}