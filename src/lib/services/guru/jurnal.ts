import { supabase } from '@/lib/supabase/client'

// Ambil data logbook siswa berdasarkan guruId
export async function getLogbookData(guruId: number) {
  // Ambil siswa bimbingan guru
  const { data: siswaIds, error: siswaError } = await supabase
    .from('siswa')
    .select('id')
    .eq('guru_id', guruId)

  if (siswaError) throw siswaError

  const ids = siswaIds?.map(s => s.id) || []

  // Ambil logbook siswa
  const { data: logbooks, error: logbookError } = await supabase
    .from('logbook')
    .select(`
      id,
      siswa_id,
      tanggal,
      kegiatan,
      kendala,
      status,
      catatan_guru,
      siswa (nama, nis)
    `)
    .in('siswa_id', ids)
    .order('tanggal', { ascending: false })

  if (logbookError) throw logbookError

  // Hitung stats
  const stats = {
    total: logbooks?.length || 0,
    pending: logbooks?.filter(l => l.status === 'Belum Diverifikasi').length || 0,
    disetujui: logbooks?.filter(l => l.status === 'Disetujui').length || 0,
    ditolak: logbooks?.filter(l => l.status === 'Ditolak').length || 0,
  }

  return { logbooks, stats }
}
