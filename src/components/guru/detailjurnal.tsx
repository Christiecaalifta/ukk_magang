'use client'

import {
  X,
  FileText,
  Check,
  XCircle,
  AlertCircle,
  Download,
  MessageSquare,
} from 'lucide-react'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function DetailJurnalGuruModal({
  data,
  onClose,
  onSuccess,
}: any) {
  const [catatan, setCatatan] = useState(data.catatan_guru || '')
  const [loading, setLoading] = useState(false)

  const updateStatus = async (status: 'disetujui' | 'ditolak') => {
    setLoading(true)

    const { error } = await supabase
      .from('logbook')
      .update({
        status_verifikasi: status,
        catatan_guru: catatan,
        updated_at: new Date(),
      })
      .eq('id', data.id)

    setLoading(false)

    if (error) {
      console.error(error)
      onSuccess?.(true, 'Gagal memperbarui jurnal')
      return
    }

    const successMsg = status === 'disetujui' 
      ? 'Jurnal berhasil disetujui' 
      : 'Jurnal berhasil ditolak '

    // Kirim pesan ke parent untuk ditampilkan lewat Toast parent
    onSuccess?.(false, successMsg)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-500 shadow-lg shadow-cyan-200 p-2.5 rounded-xl text-white">
              <FileText size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 tracking-tight">Detail Jurnal Harian</h3>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">
                {new Date(data.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
          
          {/* Kendala */}
          <section>
            <div className="flex items-center gap-2 mb-3 px-1">
              <AlertCircle size={16} className="text-orange-500" />
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">Kendala Lapangan</span>
            </div>
            <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 text-slate-700 leading-relaxed text-sm italic">
              {data.kendala || 'Siswa tidak mencantumkan kendala.'}
            </div>
          </section>

          {/* Dokumentasi */}
          <section>
            <div className="flex items-center gap-2 mb-3 px-1">
              <FileText size={16} className="text-emerald-500" />
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">Berkas Dokumentasi</span>
            </div>
            <div className="group bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-white p-2 rounded-lg border border-slate-200"><FileText size={18} className="text-slate-400" /></div>
                <span className="text-sm font-medium text-slate-600 truncate max-w-[200px]">
                  {data.file_url ? data.file_url.split('/').pop() : 'Tidak ada lampiran berkas'}
                </span>
              </div>
              {data.file_url && (
                <a href={data.file_url} target="_blank" className="bg-white hover:bg-emerald-500 hover:text-white text-emerald-600 border border-emerald-200 shadow-sm px-5 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all active:scale-95">
                  <Download size={14} /> Unduh
                </a>
              )}
            </div>
          </section>

          {/* Catatan */}
          <section>
            <div className="flex items-center gap-2 mb-3 px-1">
              <MessageSquare size={16} className="text-indigo-500" />
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">Feedback Guru</span>
            </div>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Berikan arahan atau catatan..."
              className="w-full min-h-[120px] bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all rounded-2xl p-5 text-sm outline-none resize-none"
            />
          </section>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={() => updateStatus('ditolak')}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 font-bold text-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <XCircle size={18} /> Tolak
          </button>

          <button
            onClick={() => updateStatus('disetujui')}
            disabled={loading}
            className="px-8 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 font-bold text-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Check size={18} /> Setujui
          </button>
        </div>
      </div>
    </div>
  )
}