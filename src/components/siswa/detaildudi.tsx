'use client'

import { FiMapPin, FiPhone, FiMail, FiUser, FiSend, FiX, FiBriefcase, FiAlertCircle } from 'react-icons/fi'

interface DetailDudiProps {
  isOpen: boolean
  onClose: () => void
  data: {
    nama: string
    bidang: string
    deskripsi: string
    alamat: string
    telepon: string
    email: string
    pic: string
    kuota: number
    terisi: number
    sudah_daftar?: boolean
  }
  onDaftar: (dudiId: number) => void
  dudiId: number
}

export default function ModalDetailDudi({
  isOpen,
  onClose,
  data,
  onDaftar,
  dudiId
}: DetailDudiProps) {
  if (!isOpen) return null

  const isFull = data.terisi >= data.kuota

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with stronger blur */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* HEADER SECTION */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-100 shrink-0">
              <FiBriefcase size={26} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-800 leading-tight">{data.nama}</h2>
                {data.sudah_daftar && (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-amber-200">
                    Menunggu Verifikasi
                  </span>
                )}
              </div>
              <p className="text-cyan-600 font-bold text-xs uppercase tracking-widest">{data.bidang}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 group"
          >
            <FiX size={24} className="group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-8 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
          
          {/* Tentang Perusahaan */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
               Tentang Perusahaan
            </h3>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p className="text-slate-600 text-sm leading-relaxed">
                {data.deskripsi}
              </p>
            </div>
          </section>

          {/* Informasi Kontak - Grid System */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Informasi Kontak</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Alamat Full Width */}
              <div className="md:col-span-2 flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-cyan-200 transition-colors">
                <div className="p-2 bg-slate-50 rounded-xl text-cyan-600">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Alamat Kantor</p>
                  <p className="text-sm text-slate-700 font-semibold">{data.alamat}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-cyan-200 transition-colors">
                <div className="p-2 bg-slate-50 rounded-xl text-cyan-600">
                  <FiPhone size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Telepon</p>
                  <p className="text-sm text-slate-700 font-semibold">{data.telepon}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-cyan-200 transition-colors">
                <div className="p-2 bg-slate-50 rounded-xl text-cyan-600">
                  <FiMail size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Email</p>
                  <p className="text-sm text-slate-700 font-semibold">{data.email}</p>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-cyan-200 transition-colors">
                <div className="p-2 bg-slate-50 rounded-xl text-cyan-600">
                  <FiUser size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Penanggung Jawab (PIC)</p>
                  <p className="text-sm text-slate-700 font-semibold">{data.pic}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Statistik Magang Card */}
          <section>
            <div className="bg-cyan-600 rounded-3xl p-6 text-white shadow-xl shadow-cyan-100 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <FiBriefcase size={100} />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-80">Informasi Kuota Magang</h3>
              <div className="grid grid-cols-3 gap-4 relative z-10">
                <div>
                  <p className="text-[10px] uppercase opacity-70 mb-1">Total</p>
                  <p className="text-xl font-bold">{data.kuota}</p>
                </div>
                <div className="border-x border-white/20 px-4">
                  <p className="text-[10px] uppercase opacity-70 mb-1">Terisi</p>
                  <p className="text-xl font-bold">{data.terisi}</p>
                </div>
                <div className="pl-4">
                  <p className="text-[10px] uppercase opacity-70 mb-1">Sisa</p>
                  <p className="text-xl font-bold">{data.kuota - data.terisi}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER ACTION */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all text-sm"
          >
            Batal
          </button>
          
          <button
            onClick={() => onDaftar(dudiId)}
            disabled={data.sudah_daftar || isFull}
            className={`px-10 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all text-sm active:scale-95 ${
                data.sudah_daftar
                ? 'bg-emerald-500 shadow-emerald-100 cursor-default'
                : isFull
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200'
            }`}
          >
            <FiSend size={16} />
            {data.sudah_daftar
                ? 'Sudah Terdaftar'
                : isFull
                ? 'Kuota Penuh'
                : 'Daftar Magang Sekarang'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}