import { getCurrentUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { 
  Building2, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Award,
  Circle,
  User,
  Hash,
  BookOpen
} from 'lucide-react'

export default async function StatusMagangPage() {
  // 1. Ambil user login
  const user = getCurrentUser()
  if (!user) return <div className="p-8 text-slate-500">Sesi berakhir. Silakan login ulang.</div>

  const supabase = createSupabaseServerClient()

  // 2. Cari siswa dari user.id
  const { data: siswa } = await supabase
    .from('siswa')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!siswa) return <div className="p-8 text-slate-500">Akun belum terhubung ke data siswa.</div>

  // 3. Ambil data magang dengan Join
  const { data: magang, error } = await supabase
    .from('magang')
    .select(`
      status,
      nilai_akhir,
      tanggal_mulai,
      tanggal_selesai,
      siswa ( nama, nis, kelas, jurusan ),
      dudi ( nama_perusahaan, alamat )
    `)
    .eq('siswa_id', siswa.id)
    .eq('status', 'berlangsung')
    .order('tanggal_mulai', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>
  if (!magang) return <div className="p-8 text-slate-500">Belum ada data magang yang terdaftar.</div>

  // Normalisasi data karena join bisa mengembalikan array atau objek
  const siswaData: any = Array.isArray(magang.siswa) ? magang.siswa[0] : magang.siswa
  const dudiData: any = Array.isArray(magang.dudi) ? magang.dudi[0] : magang.dudi

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <h1 className="text-3xl font-bold text-[#1E293B] tracking-tight mb-8">
            Status Magang Saya
          </h1>

          {/* Card Utama */}
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-12">
              
              {/* Header Card */}
              <div className="flex items-center gap-3 mb-10 text-cyan-600">
                <div className="p-2 bg-cyan-50 rounded-lg">
                   <GraduationCap size={22} />
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider">Data Magang</h3>
              </div>

              {/* Grid Konten */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                
                {/* Baris 1: Nama & NIS */}
                <InfoItem 
                  label="Nama Siswa" 
                  value={siswaData?.nama} 
                  icon={<User size={16} />} 
                />
                <InfoItem 
                  label="NIS" 
                  value={siswaData?.nis} 
                  icon={<Hash size={16} />} 
                />

                {/* Baris 2: Kelas & Jurusan */}
                <InfoItem 
                  label="Kelas" 
                  value={siswaData?.kelas} 
                  icon={<BookOpen size={16} />} 
                />
                <InfoItem 
                  label="Jurusan" 
                  value={siswaData?.jurusan} 
                />

                {/* Baris 3: Perusahaan & Alamat */}
                <InfoItem 
                  label="Nama Perusahaan" 
                  value={dudiData?.nama_perusahaan} 
                  icon={<Building2 size={16} />} 
                />
                <InfoItem 
                  label="Alamat Perusahaan" 
                  value={dudiData?.alamat} 
                  icon={<MapPin size={16} />} 
                />

                {/* Baris 4: Periode & Status */}
                <InfoItem 
                  label="Periode Magang" 
                  value={`${magang.tanggal_mulai} s.d ${magang.tanggal_selesai}`} 
                  icon={<Calendar size={16} />} 
                />
                <div className="space-y-2">
                  <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Status</p>
                  <div className="flex">
                    <span className="bg-emerald-50 text-emerald-600 text-[12px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2 border border-emerald-100 uppercase">
                      <Circle size={8} fill="currentColor" />
                      {magang.status || 'Aktif'}
                    </span>
                  </div>
                </div>

                {/* Baris 5: Nilai Akhir (Full Width atau di bawah) */}
                <InfoItem 
                  label="Nilai Akhir" 
                  value={magang.nilai_akhir || '-'} 
                  icon={<Award size={16} />} 
                  highlight 
                />

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Komponen Reusable untuk item informasi agar kode bersih
function InfoItem({ 
  label, 
  value, 
  icon, 
  highlight = false 
}: { 
  label: string, 
  value?: string | number, 
  icon?: React.ReactNode, 
  highlight?: boolean 
}) {
  return (
    <div className="space-y-2">
      <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-slate-400">{icon}</span>}
        <p className={`font-bold leading-tight ${highlight ? 'text-3xl text-slate-800' : 'text-[15px] text-slate-700'}`}>
          {value ?? '-'}
        </p>
      </div>
    </div>
  )
}