'use client'

import { useState, useEffect } from 'react'
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Search,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Filter,
  X
} from 'lucide-react'
import TambahJurnalForm from '@/components/siswa/addjurnal' // import komponen form
import DetailJurnalModal from '@/components/siswa/detailjurnal' // Sesuaikan pathnya

/* ================= TOAST COMPONENT ================= */
function Toast({
  message,
  onClose,
  duration = 3000,
}: {
  message: string
  onClose: () => void
  duration?: number
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-toast-in">
      <div className="flex items-center gap-3 
        bg-gradient-to-r from-emerald-500 to-teal-500
        text-white px-4 py-3 rounded-xl shadow-xl
        border border-white/20
        backdrop-blur-sm
      ">
        <div className="bg-white/20 p-1.5 rounded-full">
          <CheckCircle2 size={18} />
        </div>
        <p className="text-sm font-semibold tracking-wide">{message}</p>
        <button onClick={onClose} className="ml-2 opacity-80 hover:opacity-100 transition">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

/* ================= LOGBOOK CLIENT ================= */
export default function LogbookClient({
  data = [],
  total = 0,
  stats = { total: 0, approved: 0, pending: 0, rejected: 0 },
  page = 1,
  search = "",
  magangId
}: any) {
  const [showForm, setShowForm] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [selectedJurnal, setSelectedJurnal] = useState<any | null>(null)

  const handleToast = (message: string) => setToastMessage(message)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-700">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Jurnal Harian Magang</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={20} strokeWidth={2.5} />
          Tambah Jurnal
        </button>
      </div>

      {/* FORM ADD JURNAL */}
      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
           <TambahJurnalForm 
             magangId={magangId} 
             onClose={() => setShowForm(false)} 
             onAdd={() => {
               setShowForm(false)
               handleToast("Jurnal berhasil ditambah!")
             }}
           />
        </div>
      )}

      {/* ALERT */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="bg-amber-100 p-2 rounded-lg h-fit">
            <FileText className="text-amber-600" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-amber-900">Jangan Lupa Jurnal Hari Ini!</h4>
            <p className="text-sm text-amber-700">Anda belum membuat jurnal untuk hari ini. Dokumentasikan kegiatan magang Anda sekarang.</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)} // buka form saat diklik
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          Buat Sekarang
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatBox title="Total Jurnal" value={stats.total} desc="Jurnal yang telah dibuat" icon={<FileText className="text-cyan-500" />} />
        <StatBox title="Disetujui" value={stats.approved} desc="Jurnal disetujui guru" icon={<CheckCircle2 className="text-emerald-500" />} />
        <StatBox title="Menunggu" value={stats.pending} desc="Belum diverifikasi" icon={<Clock className="text-sky-500" />} />
        <StatBox title="Ditolak" value={stats.rejected} desc="Perlu diperbaiki" icon={<XCircle className="text-rose-500" />} />
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 text-cyan-600 font-semibold mb-4">
            <FileText size={20} />
            <span>Riwayat Jurnal</span>
          </div>

          {/* FILTER */}
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari kegiatan atau kendala..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Filter size={16} /> Sembunyikan Filter <ChevronDown size={16} />
              </button>
              <div className="flex flex-1 gap-4">
                <FilterSelect label="Status" options={['Semua Status']} />
                <FilterSelect label="Bulan" options={['Semua Bulan']} />
                <FilterSelect label="Tahun" options={['Semua Tahun']} />
              </div>
            </div>
          </div>

          {/* TABEL JURNAL */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-slate-400 text-sm border-b border-slate-50">
                  <th className="text-left font-medium py-4 px-2">Tanggal</th>
                  <th className="text-left font-medium py-4 px-2">Kegiatan & Kendala</th>
                  <th className="text-left font-medium py-4 px-2">Status</th>
                  <th className="text-left font-medium py-4 px-2">Feedback Guru</th>
                  <th className="text-center font-medium py-4 px-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((item: any) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-2 align-top text-sm text-slate-600 whitespace-normal leading-relaxed">
                      {formatDate(item.tanggal)}
                    </td>
                    <td className="py-5 px-2 align-top max-w-md text-sm text-slate-600 whitespace-normal">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-700 leading-relaxed">Kegiatan:</p>
                        <p className="leading-relaxed">{item.kegiatan}</p>
                        {item.kendala && (
                          <>
                            <p className="text-slate-700 mt-2">Kendala:</p>
                            <p className="text-slate-500 italic">{item.kendala}</p>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-2 align-top text-sm whitespace-normal">
                      <StatusBadge status={item.status_verifikasi} />
                    </td>
                    <td className="py-5 px-2 align-top text-sm whitespace-normal">
                      {item.catatan_guru ? (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                          <p className="font-bold text-slate-500 mb-1 flex items-center gap-1">
                            <FileText size={12} /> Catatan Guru:
                          </p>
                          <p className="text-slate-600">{item.catatan_guru}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Belum ada catatan guru</span>
                      )}
                    </td>
                    <td className="py-5 px-2 align-top text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => setSelectedJurnal(item)}
                        className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all">
                          
                          <Eye size={18} />
                        </button>
                        <button
                          className={`p-2 rounded-lg transition-all ${
                            item.status_verifikasi === 'pending'
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-slate-300 cursor-not-allowed'
                          }`}
                          disabled={item.status_verifikasi !== 'pending'}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className={`p-2 rounded-lg transition-all ${
                            item.status_verifikasi === 'pending'
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-slate-300 cursor-not-allowed'
                          }`}
                          disabled={item.status_verifikasi !== 'pending'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pt-4 flex justify-between items-center text-xs text-slate-400">
            <p>Menampilkan 1 sampai {data.length} dari {total} entri</p>
            <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">{'<'}</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500 text-white shadow-sm shadow-cyan-200">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">{'>'}</button>
            </div>
          </div>
        </div>
      </div>

      {/* ... bagian akhir kode LogbookClient ... */}
      
      {/* MODAL DETAIL */}
      {selectedJurnal && (
        <DetailJurnalModal 
          data={selectedJurnal} 
          onClose={() => setSelectedJurnal(null)} 
        />
      )}

      {/* TOAST */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} duration={3000} />
      )}
    </div> // Penutup div utama
  )
}

/* ================= HELPER COMPONENTS ================= */
function StatBox({ title, value, desc, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h2 className="text-3xl font-extrabold text-slate-800">{value}</h2>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <p className="text-xs text-slate-400 font-medium">{desc}</p>
    </div>
  )
}

function FilterSelect({ label, options }: any) {
    return (
        <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">{label}</p>
            <div className="relative">
                <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/10 cursor-pointer">
                    {options.map((opt: string) => <option key={opt}>{opt}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
        </div>
    )
}

function StatusBadge({ status }: any) {
  const styles: Record<string, any> = {
    disetujui: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Disetujui', minWidth: 'min-w-[40px]' },
    pending: { bg: 'bg-yellow-200', text: 'text-yellow-900', label: 'Menunggu', minWidth: 'min-w-[50px]' },
    ditolak: { bg: 'bg-rose-100', text: 'text-rose-800', label: 'Ditolak', minWidth: 'min-w-[40px]' },
  }

  const current = styles[status?.toLowerCase()] || styles.pending

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`font-medium inline-block px-2 py-0.5 rounded-xl border ${current.bg} ${current.text} border-transparent text-[10px] text-center uppercase tracking-wide ${current.minWidth}`}
      >
        {current.label}
      </div>
      {status?.toLowerCase() === 'ditolak' && (
        <span className="text-[9px] text-rose-600 font-normal text-center">Perlu diperbaiki</span>
      )}
    </div>
  )
}
