import { supabase } from '@/lib/supabase/client'

export async function getDashboardData() {
  /* ================= STATS ================= */

  const { count: totalSiswa } = await supabase
    .from('siswa')
    .select('*', { count: 'exact', head: true })

  const { count: totalDudi } = await supabase
    .from('dudi')
    .select('*', { count: 'exact' })

  const { count: siswaMagang } = await supabase
    .from('magang')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'berlangsung')

  const { count: totalLogbook } = await supabase
    .from('logbook')
    .select('*', { count: 'exact'})

  /* ================= LOGBOOK TERBARU ================= */

  const { data: logbookTerbaru, error: logbookError } = await supabase
  .from('logbook')
  .select(`
    id,
    tanggal,
    kegiatan,
    kendala,
    status_verifikasi,
    magang:magang_id (
      id,
      siswa:siswa_id (
        nama
      )
    )
  `)
  .order('tanggal', { ascending: false })
  .limit(5)

console.log('LOGBOOK:', logbookTerbaru)
console.log('LOGBOOK ERROR:', logbookError)


  /* ================= MAGANG TERBARU ================= */

  const { data: magangTerbaru } = await supabase
    .from('magang')
    .select(`
      id,
      status,
      tanggal_mulai, 
      tanggal_selesai,
      siswa:siswa_id ( nama ),
      dudi:dudi_id ( nama_perusahaan )
    `)
    .order('tanggal_mulai', { ascending: false })
    .limit(5)

  /* ================= DUDI AKTIF ================= */

  /* ================= DUDI AKTIF + JUMLAH SISWA ================= */

const { data: dudiAktifRaw } = await supabase
  .from('magang')
  .select(`
    dudi_id,
    dudi:dudi_id (
      id,
      nama_perusahaan,
      alamat,
      telepon
    )
  `)
  .eq('status', 'berlangsung')

const dudiMap = new Map<string, any>()

dudiAktifRaw?.forEach((item: any) => {
  const dudi = item.dudi
  if (!dudi?.id) return

  if (!dudiMap.has(dudi.id)) {
    dudiMap.set(dudi.id, {
      ...dudi,
      jumlah_siswa: 1,
    })
  } else {
    dudiMap.get(dudi.id).jumlah_siswa += 1
  }
})

const dudiAktif = Array.from(dudiMap.values())


  /* ================= RETURN ================= */

  return {
    stats: {
      totalSiswa: totalSiswa || 0,
      totalDudi: totalDudi || 0,
      siswaMagang: siswaMagang || 0,
      totalLogbook: totalLogbook || 0,
    },
    magangTerbaru: magangTerbaru || [],
    dudiAktif: dudiAktif || [],
    logbookTerbaru: logbookTerbaru || [],
  }
}
