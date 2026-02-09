import { supabaseAdmin } from '@/lib/supabase/admin'

export async function getDashboardData() {
  /* ================= STATS ================= */
// Total Siswa
const { count: totalSiswa } = await supabaseAdmin
  .from('siswa')
  .select('*', { count: 'exact', head: true })

// Total DUDI
const { count: totalDudi } = await supabaseAdmin
  .from('dudi')
  .select('*', { count: 'exact', head: true })

// ✅ SISWA MAGANG AKTIF (STATUS = berlangsung)
const { count: siswaMagangAktif, error: magangError } = await supabaseAdmin
  .from('magang')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'berlangsung')

console.log('MAGANG AKTIF:', siswaMagangAktif, magangError)

// Total Logbook
const { count: totalLogbook } = await supabaseAdmin
  .from('logbook')
  .select('*', { count: 'exact', head: true })


  /* ================= LOGBOOK TERBARU ================= */

  const { data: logbookTerbaru, error: logbookError } = await supabaseAdmin
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

  const { data: magangTerbaru } = await supabaseAdmin
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

  /* ================= DUDI AKTIF + JUMLAH SISWA ================= */

  const { data: dudiAktifRaw } = await supabaseAdmin
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
    console.log('DUDI RAW:', dudiAktifRaw)


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
      siswaMagang: siswaMagangAktif || 0,
      totalLogbook: totalLogbook || 0,
    },
    magangTerbaru: magangTerbaru || [],
    dudiAktif: dudiAktif || [],
    logbookTerbaru: logbookTerbaru || [],
  }
}

export async function getGuruStats() {
  const { data, error } = await supabaseAdmin
    .from('magang')
    .select(`
      siswa_id,
      guru:guru_id (
        id,
        nama
      )
    `)

  if (error) throw error

  // Hitung manual DISTINCT
  const map = new Map()

  data.forEach((row: any) => {
    const guruId = row.guru.id
    const siswaId = row.siswa_id

    if (!map.has(guruId)) {
      map.set(guruId, {
        nama: row.guru.nama,
        siswaSet: new Set(),
      })
    }

    map.get(guruId).siswaSet.add(siswaId)
  })

  // Convert ke array
  return Array.from(map.values()).map((item: any) => ({
    nama: item.nama,
    jumlah: item.siswaSet.size,
  }))
}

