import { createSupabaseServerClient } from '@/lib/supabase/server'

/* =====================================================
   UPDATE STATUS MAGANG → Pending → Aktif
===================================================== */

export async function approveMagang(magangId: number) {
  const supabase = createSupabaseServerClient()

  const { error } = await supabase
    .from('magang')
    .update({
      status: 'berlangsung',
    })
    .eq('id', magangId)

  if (error) {
    console.error('[MAGANG][APPROVE ERROR]', error)
    throw new Error('Gagal update status magang')
  }

  return true
}

/* =====================================================
   INPUT NILAI → Status → Selesai
===================================================== */

export async function inputNilaiMagang(
  magangId: number,
  nilai: number
) {
  const supabase = createSupabaseServerClient()

  const { error } = await supabase
    .from('magang')
    .update({
      nilai,
      status: 'selesai',
    })
    .eq('id', magangId)

  if (error) {
    console.error('[MAGANG][NILAI ERROR]', error)
    throw new Error('Gagal input nilai magang')
  }

  return true
}

/* =====================================================
   AMBIL LIST MAGANG UNTUK GURU
===================================================== */

export async function getMagangListForGuru(
  guruId: number,
  {
    search = '',
    status = '',
    page = 1,
    limit = 5,
  }: {
    search?: string
    status?: string
    page?: number
    limit?: number
  }
) {
  const supabase = createSupabaseServerClient()

  const from = (page - 1) * limit
  const to = from + limit - 1

  /* ================= QUERY UTAMA ================= */

  let query = supabase
    .from('magang')
    .select('*', { count: 'exact' })
    .eq('guru_id', guruId)
    .order('created_at', { ascending: false })
    .range(from, to)

  /* ================= FILTER STATUS ================= */

  if (status) {
    query = query.eq('status', status)
  }

  const { data: magangList, count, error } = await query

  if (error) {
    console.error('[MAGANG][LIST ERROR]', error)

    return {
      data: [],
      total: 0,
    }
  }

  if (!magangList || magangList.length === 0) {
    return {
      data: [],
      total: 0,
    }
  }

  /* =====================================================
     AMBIL RELASI DATA
  ===================================================== */

  const siswaIds = magangList.map(m => m.siswa_id)
  const guruIds = magangList.map(m => m.guru_id)
  const dudiIds = magangList.map(m => m.dudi_id)

  /* ===== Siswa ===== */
  const { data: siswaList } = await supabase
    .from('siswa')
    .select('id, nama, nis, kelas, jurusan')
    .in('id', siswaIds)

  /* ===== Guru ===== */
  const { data: guruList } = await supabase
    .from('guru')
    .select('id, nama, nip')
    .in('id', guruIds)

  /* ===== DUDI ===== */
  const { data: dudiList } = await supabase
    .from('dudi')
    .select('id, nama_perusahaan, alamat, penanggung_jawab')
    .in('id', dudiIds)

  /* =====================================================
     GABUNG DATA
  ===================================================== */

  const enrichedMagang = magangList.map(m => {
    const siswa = siswaList?.find(s => s.id === m.siswa_id)
    const guru = guruList?.find(g => g.id === m.guru_id)
    const dudi = dudiList?.find(d => d.id === m.dudi_id)

    return {
      ...m,
      siswa,
      guru,
      dudi,
      periode: `${m.tanggal_mulai} - ${m.tanggal_selesai}`,
    }
  })

  /* =====================================================
     SEARCH (Nama Siswa / Guru / DUDI)
  ===================================================== */

  let filtered = enrichedMagang

  if (search) {
    const keyword = search.toLowerCase()

    filtered = enrichedMagang.filter(item =>
      item.siswa?.nama?.toLowerCase().includes(keyword) ||
      item.guru?.nama?.toLowerCase().includes(keyword) ||
      item.dudi?.nama_perusahaan?.toLowerCase().includes(keyword)
    )
  }

  return {
    data: filtered,
    total: count ?? 0,
  }
}

/* =====================================================
   STATISTIK UNTUK CARD
===================================================== */

export async function getMagangStatsForGuru(guruId: number) {
  const supabase = createSupabaseServerClient()

  // Ambil semua magang guru beserta siswa_id dan status
  const { data: magangData, error } = await supabase
    .from('magang')
    .select(`
      siswa_id,
      siswa:siswa_id(nama),
      status
    `)
    .eq('guru_id', guruId)

  if (error || !magangData) {
    console.error('[MAGANG][STATS ERROR]', error)
    return {
      total: 0,
      totalSiswaUnik: 0,
      aktif: 0,
      selesai: 0,
      pending: 0,
    }
  }

  // Ambil siswa unik berdasarkan siswa_id
  const siswaUnik = new Set<number>()
  magangData.forEach(m => {
    if (m.siswa_id) siswaUnik.add(m.siswa_id)
  })

  return {
    total: magangData.length,        // total baris magang
    totalSiswaUnik: siswaUnik.size,  // jumlah siswa unik
    aktif: magangData.filter(d => d.status === 'berlangsung').length,
    selesai: magangData.filter(d => d.status === 'selesai').length,
    pending: magangData.filter(d => d.status === 'pending').length,
  }
}
