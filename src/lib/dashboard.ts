// import { supabase } from '@/lib/supabase'

// export async function getDashboardData() {
//   /* ================= STATS ================= */

//   const { count: totalSiswa } = await supabase
//     .from('siswa')
//     .select('*', { count: 'exact', head: true })

//   const { count: totalDudi } = await supabase
//     .from('public.dudi')
//     .select('*', { count: 'exact', head: true })

//   // siswa yang sedang magang (status berlangsung)
//   const { count: siswaMagang } = await supabase
//     .from('magang')
//     .select('*', { count: 'exact', head: true })
//     .eq('status', 'berlangsung')

//   /* ================= MAGANG TERBARU ================= */

//   const { data: magangTerbaru } = await supabase
//     .from('magang')
//     .select(`
//       id,
//       status,
//       tanggal_mulai,
//       tanggal_selesai,
//       siswa:siswa_id ( nama ),
//       dudi:dudi_id ( nama_perusahaan )
//     `)
//     .order('tanggal_mulai', { ascending: false })
//     .limit(5)

//   /* ================= DUDI AKTIF ================= */

//   const { data: dudiAktifRaw } = await supabase
//     .from('magang')
//     .select(`
//       dudi_id,
//       dudi:dudi_id (
//         id,
//         nama_perusahaan,
//         alamat,
//         telepon
//       )
//     `)
//     .eq('status', 'berlangsung')

//   // remove duplicate dudi
//   const map = new Map<string, any>()

//   dudiAktifRaw?.forEach((item: any) => {
//     if (item.dudi?.id) {
//       map.set(item.dudi.id, item.dudi)
//     }
//   })

//   const dudiAktif = Array.from(map.values())

//   /* ================= RETURN ================= */

//   return {
//     stats: {
//       totalSiswa: totalSiswa || 0,
//       totalDudi: totalDudi || 0,
//       siswaMagang: siswaMagang || 0,
//     },
//     magangTerbaru: magangTerbaru || [],
//     dudiAktif: dudiAktif || [],
//   }
// }
