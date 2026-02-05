import { supabase } from '@/lib/supabase/client'

export async function getGuruDashboardData(guruId: string) {
  /* ================= SISWA BIMBINGAN ================= */

  const { data: siswaBimbingan } = await supabase
    .from('siswa')
    .select('id, nama')
    .eq('guru_id', guruId)

  const siswaIds = siswaBimbingan?.map(s => s.id) || []

  if (siswaIds.length === 0) {
    return {
      stats: {
        totalSiswa: 0,
        totalDudi: 0,
        siswaMagang: 0,
        logbookHariIni: 0,
      },
      magangTerbaru: [],
      logbookTerbaru: [],
      dudiAktif: [],
    }
  }

  /* ================= STATS ================= */

  const { count: siswaMagang } = await supabase
    .from('magang')
    .select('*', { count: 'exact', head: true })
    .in('siswa_id', siswaIds)
    .eq('status', 'berlangsung')

  const today = new Date().toISOString().split('T')[0]

  const { count: logbookHariIni } = await supabase
    .from('logbook')
    .select('*', { count: 'exact', head: true })
    .in('siswa_id', siswaIds)
    .eq('tanggal', today)

  /* ================= MAGANG TERBARU ================= */

  const { data: magangTerbaru } = await supabase
    .from('magang')
    .select(`
      id,
      status,
      tanggal_mulai,
      tanggal_selesai,
      siswa:siswa_id (
        nama
      ),
      dudi:dudi_id (
        nama_perusahaan
      )
    `)
    .in('siswa_id', siswaIds)
    .order('tanggal_mulai', { ascending: false })
    .limit(5)

  const magangIds = magangTerbaru?.map((m: any) => m.id) || []

  /* ================= LOGBOOK TERBARU ================= */

  let logbookTerbaru: any[] = []

  if (magangIds.length > 0) {
    const { data, error } = await supabase
      .from('logbook')
      .select(`
        id,
        tanggal,
        kegiatan,
        kendala,
        status_verifikasi,
        magang_id
      `)
      .in('magang_id', magangIds)
      .order('tanggal', { ascending: false })
      .limit(5)

    if (error) console.error('Error fetch logbook:', error)
    else logbookTerbaru = data || []
  }

  /* ================= DUDI AKTIF ================= */

  const { data: dudiRaw } = await supabase
    .from('magang')
    .select(`
      dudi:dudi_id (
        id,
        nama_perusahaan,
        alamat,
        telepon
      )
    `)
    .in('siswa_id', siswaIds)
    .eq('status', 'berlangsung')

  const dudiMap = new Map<string, any>()

  dudiRaw?.forEach((item: any) => {
    const dudi = item.dudi
    if (!dudi?.id) return

    if (!dudiMap.has(dudi.id)) {
      dudiMap.set(dudi.id, {
        ...dudi,
        jumlah_siswa: 1,
      })
    } else {
      dudiMap.get(dudi.id).jumlah_siswa++
    }
  })

  /* ================= RETURN ================= */

  return {
    stats: {
      totalSiswa: siswaIds.length,
      totalDudi: dudiMap.size,
      siswaMagang: siswaMagang || 0,
      logbookHariIni: logbookHariIni || 0,
    },
    magangTerbaru: magangTerbaru || [],
    logbookTerbaru,
    dudiAktif: Array.from(dudiMap.values()),
  }
}
