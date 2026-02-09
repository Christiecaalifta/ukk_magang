'use client'

import { X, FileText, Check, XCircle, Edit, AlertCircle, Download, MessageSquare } from 'lucide-react'
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

    if (!error) {
      onSuccess?.()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-4 border-b">
          <div className="flex gap-4">
            <div className="bg-cyan-500 p-2 rounded-lg text-white">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800">Detail Jurnal Harian</h3>
              <p className="text-sm text-gray-500">
                {new Date(data.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Kendala */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-800">
              <AlertCircle size={18} className="text-orange-500" />
              <span className="font-bold text-sm uppercase tracking-tight">Kendala yang Dihadapi</span>
            </div>
            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed">
                {data.kendala || 'Tidak ada kendala yang dilaporkan.'}
              </p>
            </div>
          </div>

          {/* Dokumentasi */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-800">
              <FileText size={18} className="text-emerald-500" />
              <span className="font-bold text-sm uppercase tracking-tight">Dokumentasi</span>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="bg-white p-2 rounded-lg border border-emerald-100">
                  <FileText size={20} className="text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-600 truncate max-w-[200px]">
                  {data.file_url ? data.file_url.split('/').pop() : 'documento2.pdf'}
                </span>
              </div>
              <a
                href={data.file_url}
                target="_blank"
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-5 py-2 rounded-xl flex items-center gap-2 transition-all font-medium shadow-sm"
              >
                <Download size={16} /> Unduh
              </a>
            </div>
          </div>

          {/* Catatan Guru */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-slate-800">
                <MessageSquare size={18} className="text-purple-500" />
                <span className="font-bold text-sm uppercase tracking-tight">Catatan Guru</span>
              </div>
              <button className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                <Edit size={14} /> Edit
              </button>
            </div>
            <div className="relative group">
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Belum ada catatan dari guru"
                className="w-full min-h-[100px] border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center text-gray-500 focus:outline-none focus:border-blue-300 transition-all italic"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[11px] text-gray-400 font-medium">
            Dibuat: {data.created_at?.slice(0, 10)} | Diperbarui: {data.updated_at?.slice(0, 10)}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => updateStatus('disetujui')}
              disabled={loading}
              className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-md shadow-emerald-200 active:scale-95 disabled:opacity-50"
            >
              <Check size={18} strokeWidth={3} /> Setujui
            </button>
            <button
              onClick={() => updateStatus('ditolak')}
              disabled={loading}
              className="flex-1 sm:flex-none bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-md shadow-rose-200 active:scale-95 disabled:opacity-50"
            >
              <XCircle size={18} strokeWidth={3} /> Tolak
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}