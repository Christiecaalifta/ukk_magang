'use client'

import React, { useState, useEffect } from 'react'
import { 
  X, 
  Info, 
  Calendar as CalendarIcon, 
  Upload, 
  AlertCircle,
  FileText,
  Trash2
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface EditJurnalFormProps {
  jurnalId: number
  onClose?: () => void
  onUpdate?: () => void
}

export default function EditJurnalForm({ jurnalId, onClose, onUpdate }: EditJurnalFormProps) {
  const [deskripsi, setDeskripsi] = useState('')
  const [kendala, setKendala] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [statusVerifikasi, setStatusVerifikasi] = useState('')
  const [catatanGuru, setCatatanGuru] = useState('')
  
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  const [file, setFile] = useState<File | null>(null)
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null)
  const [isDeletingOldFile, setIsDeletingOldFile] = useState(false)

  // 1. Fetch data jurnal yang akan diedit
  useEffect(() => {
    const fetchJurnal = async () => {
      try {
        const { data, error } = await supabase
          .from('logbook')
          .select('*')
          .eq('id', jurnalId)
          .single()

        if (error) throw error
        if (data) {
          setDeskripsi(data.kegiatan || '')
          setKendala(data.kendala || '')
          setTanggal(data.tanggal || '')
          setStatusVerifikasi(data.status_verifikasi)
          setCatatanGuru(data.catatan_guru || '')
          setExistingFileUrl(data.file)
        }
      } catch (err: any) {
        setErrorMsg('Gagal mengambil data jurnal: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchJurnal()
  }, [jurnalId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tanggal || deskripsi.length < 50) return

    setSubmitLoading(true)
    setErrorMsg('')

    try {
      let finalFilePath = existingFileUrl

      // 2. Jika ada file baru yang diupload
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('jurnal')
          .upload(`logbook/${fileName}`, file)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('jurnal')
          .getPublicUrl(`logbook/${fileName}`)
        
        finalFilePath = urlData.publicUrl
      } else if (isDeletingOldFile) {
        finalFilePath = null
      }

      // 3. Update Database
      const { error: updateError } = await supabase
        .from('logbook')
        .update({
          tanggal,
          kegiatan: deskripsi,
          kendala: kendala || null,
          file: finalFilePath,
          status_verifikasi: 'pending', // Reset status ke pending setelah diperbaiki
        })
        .eq('id', jurnalId)

      if (updateError) throw updateError

      if (onUpdate) onUpdate()
      if (onClose) onClose()
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memperbarui jurnal.')
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-xl">Memuat data...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Jurnal Harian</h2>
            <p className="text-sm text-slate-500 mt-1">Perbarui dokumentasi kegiatan magang Anda</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
          
          {/* BANNER JIKA DITOLAK */}
          {statusVerifikasi === 'ditolak' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <div className="space-y-1">
                <p className="text-sm font-bold text-amber-900">Jurnal ini ditolak dan perlu diperbaiki</p>
                {catatanGuru && (
                   <p className="text-xs text-amber-800 font-medium italic">" {catatanGuru} "</p>
                )}
              </div>
            </div>
          )}

          {/* PANDUAN */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
            <div className="bg-blue-100 p-2 rounded-lg h-fit">
              <Info className="text-blue-600" size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-blue-900">Panduan Perbaikan</h4>
              <p className="text-[11px] text-blue-700 leading-relaxed">Pastikan Anda telah menjawab umpan balik dari guru dan memperbarui deskripsi kegiatan minimal 50 karakter.</p>
            </div>
          </div>

          {/* INFORMASI DASAR */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Informasi Dasar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tanggal <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Status</label>
                <input 
                  type="text"
                  readOnly
                  value="Edit Mode"
                  className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm text-slate-500 outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* KEGIATAN HARIAN */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Kegiatan Harian</h3>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${deskripsi.length < 50 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                {deskripsi.length}/50 minimum
              </span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Deskripsi Kegiatan <span className="text-rose-500">*</span></label>
              <textarea 
                rows={5}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* DOKUMENTASI PENDUKUNG */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Dokumentasi Pendukung</h3>
            
            {/* Tampilkan jika sudah ada file sebelumnya */}
            {existingFileUrl && !isDeletingOldFile ? (
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 p-2 rounded-lg text-white">
                    <FileText size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-emerald-900">File terpilih</span>
                    <span className="text-[10px] text-emerald-600 truncate max-w-[200px]">{existingFileUrl.split('/').pop()}</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setIsDeletingOldFile(true)
                    setExistingFileUrl(null)
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-100 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:border-cyan-300 transition-all">
                <Upload className="text-slate-400 mb-2" size={24} />
                <p className="text-sm font-bold text-slate-700">Klik untuk ganti dokumentasi</p>
                <input
                  type="file"
                  className="hidden"
                  id="fileUpdate"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setFile(e.target.files[0])
                  }}
                />
                <label htmlFor="fileUpdate" className="mt-4 cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25">
                  Browse File
                </label>
                {file && <p className="text-xs mt-3 font-medium text-cyan-600 italic">File baru: {file.name}</p>}
              </div>
            )}
          </div>

          {/* VALIDATION / ERROR MSG */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="text-rose-500 shrink-0" size={18} />
              <p className="text-sm text-rose-700 font-medium">{errorMsg}</p>
            </div>
          )}
        </form>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 border border-slate-200 transition-all"
          >
            Batal
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={deskripsi.length < 50 || submitLoading}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg 
              ${deskripsi.length >= 50 && !submitLoading 
                ? 'bg-blue-600 text-white shadow-blue-500/25 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
          >
            {submitLoading ? 'Memproses...' : 'Update Jurnal'}
          </button>
        </div>
      </div>
    </div>
  )
}