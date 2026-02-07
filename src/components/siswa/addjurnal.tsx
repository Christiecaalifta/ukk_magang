'use client'

import React, { useState } from 'react'
import { 
  X, 
  Info, 
  Calendar as CalendarIcon, 
  Upload, 
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client' // sesuaikan path

interface TambahJurnalFormProps {
  magangId: number | null
  onClose?: () => void
  onAdd?: ()=> void
}

export default function TambahJurnalForm({ magangId, onClose, onAdd }: TambahJurnalFormProps) {
  const [deskripsi, setDeskripsi] = useState('')
  const [kendala, setKendala] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>(''); // opsional, untuk preview


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let filePath: string | null = null;

if (file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const folder = 'logbook'; 
  
  // 1. Proses Upload
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('jurnal') 
    .upload(`${folder}/${fileName}`, file);

  if (uploadError) {
    setErrorMsg(`Gagal upload file: ${uploadError.message}`);
    setLoading(false);
    return;
  }

  // 2. Dapatkan public URL (Perhatikan .data.publicUrl)
  const { data } = supabase.storage
    .from('jurnal')
    .getPublicUrl(`${folder}/${fileName}`);

  if (!data?.publicUrl) {
    setErrorMsg('Gagal mendapatkan URL file.');
    setLoading(false);
    return;
  }

  // Simpan string URL ke variabel filePath
  filePath = data.publicUrl;
}

    

    if (!tanggal || deskripsi.length < 50 || !magangId) {
      setErrorMsg(!magangId ? 'Magang ID tidak tersedia.' : '')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const { data, error } = await supabase
        .from('logbook')
        .insert([{
          magang_id: magangId,
          tanggal,
          kegiatan: deskripsi,
          kendala: kendala || null,
          status_verifikasi: 'pending',
          file: filePath, // <-- tambahkan kolom ini di DB
        }])
        .select()

      if (error) {
        setErrorMsg(`Error ${error.code}: ${error.message}`)
        console.error('Detail Error:', error)
      } else {
        console.log('Berhasil!', data)
        if (onAdd) onAdd()
        if (onClose) onClose()
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* MODAL CONTAINER */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tambah Jurnal Harian</h2>
            <p className="text-sm text-slate-500 mt-1">Dokumentasikan kegiatan magang harian Anda</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
          
          {/* PANDUAN PENULISAN */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
            <div className="bg-blue-100 p-2 rounded-lg h-fit">
              <Info className="text-blue-600" size={20} />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-blue-900">Panduan Penulisan Jurnal</h4>
              <ul className="text-xs text-blue-700 space-y-1.5 list-disc ml-4 leading-relaxed">
                <li>Minimal 50 karakter untuk deskripsi kegiatan</li>
                <li>Deskripsikan kegiatan dengan detail dan spesifik</li>
                <li>Sertakan kendala yang dihadapi (jika ada)</li>
                <li>Upload dokumentasi pendukung untuk memperkuat laporan</li>
                <li>Pastikan tanggal sesuai dengan hari kerja</li>
              </ul>
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
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Status</label>
                <input 
                  type="text"
                  readOnly
                  value="Menunggu Verifikasi"
                  className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm text-slate-500 cursor-not-allowed outline-none font-medium"
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
                placeholder="Deskripsikan kegiatan yang Anda lakukan hari ini secara detail..."
                rows={5}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className={`w-full px-5 py-4 bg-slate-50 border ${deskripsi.length > 0 && deskripsi.length < 50 ? 'border-rose-200' : 'border-slate-200'} rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:bg-white transition-all outline-none leading-relaxed`}
              />
            </div>
          </div>

          {/* KENDALA */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Kendala (Opsional)</label>
            <textarea 
              placeholder="Tuliskan kendala jika ada..."
              rows={3}
              value={kendala}
              onChange={(e) => setKendala(e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
            />
          </div>

          {/* DOKUMENTASI PENDUKUNG */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Dokumentasi Pendukung</h3>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Upload File (Opsional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 hover:border-cyan-300 transition-all cursor-pointer group">
                <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform mb-4">
                  <Upload className="text-slate-400 group-hover:text-cyan-500" size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700 mb-1">Pilih file dokumentasi</p>
                <p className="text-[11px] text-slate-400 font-medium mb-4 uppercase tracking-tighter">PDF, DOC, DOCX, JPG, PNG (Max 5MB)</p>
                <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                className="hidden"
                id="fileUpload"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                    setFileUrl(URL.createObjectURL(e.target.files[0])); // preview opsional
                    }
                }}
                />
                <label htmlFor="fileUpload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/25">
                Browse File
                </label>
                {file && <p className="text-xs mt-2">{file.name}</p>}

              </div>
              <p className="text-[10px] text-slate-400 italic">Jenis file yang dapat diupload: Screenshot hasil kerja, dokumentasi code, foto kegiatan</p>
            </div>
          </div>

          {/* VALIDATION ERROR */}
          {(deskripsi.length < 50 || !tanggal) && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="text-rose-500 shrink-0" size={18} />
              <div className="space-y-1">
                <p className="text-xs font-bold text-rose-900">Lengkapi form terlebih dahulu:</p>
                <ul className="text-[11px] text-rose-700 space-y-0.5 list-disc ml-4 font-medium">
                  {!tanggal && <li>Pilih tanggal yang valid</li>}
                  {deskripsi.length < 50 && <li>Deskripsi kegiatan minimal 50 karakter</li>}
                </ul>
              </div>
            </div>
          )}

          {/* ERROR SUPABASE */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="text-rose-500 shrink-0" size={18} />
              <p className="text-sm text-rose-700">{errorMsg}</p>
            </div>
          )}
        </form>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all border border-slate-200"
          >
            Batal
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={deskripsi.length < 50 || !tanggal || loading}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg 
              ${deskripsi.length >= 50 && tanggal && !loading 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/25 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
          >
            {loading ? 'Menyimpan...' : 'Simpan Jurnal'}
          </button>
        </div>
      </div>
    </div>
  )
}
