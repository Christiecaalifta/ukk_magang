'use client'

import React from 'react'
import { 
  X, FileText, User, Calendar, Download, Clock, CheckCircle2, AlertCircle, GraduationCap, Building2, MapPin
} from 'lucide-react'

interface DetailJurnalProps {
  data: {
    tanggal: string
    kegiatan: string
    file?: string // URL file
    status_verifikasi: string
    catatan_guru?: string
    created_at: string
    siswa: {
      nama: string
      nis: string
      kelas: string
      jurusan: string
    }
    dudi: {
      nama_perusahaan: string
      alamat: string
      penanggung_jawab: string
    }
  }
  onClose: () => void
}

export default function DetailJurnalModal({ data, onClose }: DetailJurnalProps) {

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'disetujui':
        return { 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-500', 
          border: 'border-emerald-100', 
          icon: <CheckCircle2 size={14} />, 
          label: 'Disetujui' 
        }
      case 'ditolak':
        return { 
          bg: 'bg-rose-50', 
          text: 'text-rose-500', 
          border: 'border-rose-100', 
          icon: <AlertCircle size={14} />, 
          label: 'Ditolak' 
        }
      default:
        return { 
          bg: 'bg-amber-50', 
          text: 'text-amber-500', 
          border: 'border-amber-100', 
          icon: <Clock size={14} />, 
          label: 'Belum Diverifikasi' 
        }
    }
  }

  const statusStyle = getStatusStyles(data.status_verifikasi)

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-100">

        {/* HEADER SECTION */}
        <div className="px-8 py-6 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-500 p-2.5 rounded-xl shadow-md shadow-cyan-100">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-tight tracking-tight">Detail Jurnal Harian</h2>
              <p className="text-sm text-slate-400 font-medium mt-0.5">
                {new Date(data.tanggal).toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-300">
            <X size={22} />
          </button>
        </div>

        <div className="px-8 pb-8 overflow-y-auto space-y-6">

          {/* INFORMASI SISWA & TEMPAT MAGANG GRID */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-[20px] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-600 font-bold text-[11px] uppercase tracking-[0.1em]">
                  <User size={14} /> <span>Informasi Siswa</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-cyan-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
                    <User size={28} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-base leading-none">{data.siswa?.nama}</h4>
                    <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase">
                      <FileText size={10} />
                      <span>NIS: {data.siswa?.nis}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs pt-1">
                      <GraduationCap size={14} className="text-slate-400" />
                      <span>{data.siswa?.kelas}</span>
                    </div>
                    <p className="text-slate-500 font-semibold text-xs leading-none">
                      Jurusan: <span className="font-medium text-slate-400">{data.siswa?.jurusan}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px] uppercase tracking-[0.1em]">
                  <Building2 size={14} /> <span>Tempat Magang</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-700 text-sm leading-tight">{data.dudi?.nama_perusahaan}</h4>
                  <div className="flex items-start gap-1.5 text-slate-400 text-xs">
                    <MapPin size={14} className="shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{data.dudi?.alamat}</span>
                  </div>
                  <p className="text-slate-700 font-bold text-xs pt-1">
                    PIC: <span className="font-medium text-slate-500">{data.dudi?.penanggung_jawab}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DATE & STATUS BAR */}
          <div className="border border-slate-100 rounded-2xl px-5 py-4 flex justify-between items-center bg-white shadow-sm shadow-slate-50">
            <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
              <Calendar size={18} className="text-slate-300" />
              <span>{new Date(data.tanggal).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
              {statusStyle.icon}
              {statusStyle.label}
            </div>
          </div>

          {/* KEGIATAN SECTION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-[11px] uppercase tracking-[0.1em]">
              <FileText size={14} /> <span>Kegiatan Hari Ini</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 min-h-[100px]">
              <p className="text-slate-500 text-[13.5px] leading-[1.6] font-medium">
                {data.kegiatan}
              </p>
            </div>
          </div>

          {/* DOKUMENTASI SECTION (UPDATED) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] uppercase tracking-[0.1em]">
              <FileText size={14} /> <span>Dokumentasi</span>
            </div>
            <div className={`flex items-center justify-between border rounded-2xl p-4 transition-all ${data.file ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100 bg-slate-50/30'}`}>
              <div className="flex items-center gap-3">
                <FileText className={data.file ? "text-emerald-500" : "text-slate-300"} size={20} />
                <span className={`text-sm font-semibold ${data.file ? 'text-slate-500' : 'text-slate-400 italic'}`}>
                  {data.file ? (data.file.split('/').pop() || 'Lampiran Jurnal') : 'File tidak tersedia'}
                </span>
              </div>
              
              {data.file && (
                <a 
                  href={data.file} 
                  download 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-100"
                >
                  <Download size={14} /> Unduh
                </a>
              )}
            </div>
          </div>

          {/* CATATAN GURU */}
          {data.status_verifikasi?.toLowerCase() === 'ditolak' && (
            <div className="bg-rose-50 border border-rose-100 rounded-[20px] p-5 space-y-2">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-[11px] uppercase tracking-wider">
                <AlertCircle size={14} /> <span>Catatan Guru:</span>
              </div>
              <p className="text-[13px] text-rose-800 leading-relaxed font-medium">
                {data.catatan_guru || 'Deskripsi terlalu singkat, mohon tambahkan detail langkah-langkah implementasi API'}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER SECTION */}
        <div className="px-8 py-4 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tight">Dibuat: {new Date(data.created_at).toLocaleDateString('id-ID')}</span>
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tight">Diperbarui: {new Date().toLocaleDateString('id-ID')}</span>
        </div>
      </div>
    </div>
  )
}