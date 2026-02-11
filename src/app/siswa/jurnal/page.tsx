import {
  getLogbookList,
  getLogbookStats,
} from '@/lib/services/siswa/jurnal'

import LogbookClient from './jurnaltabel'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'
import { db } from '@/lib/db'

export default async function LogbookPage({ searchParams }: any) {
  /* ================= AUTH ================= */
  const token = cookies().get('token')?.value

  if (!token) {
    console.log('[JURNAL] Token tidak ditemukan')
    return (
      <LogbookClient
        data={[]}
        total={0}
        stats={{ total: 0, approved: 0, pending: 0, rejected: 0 }}
        page={1}
        search=""
        magangId={null}
      />
    )
  }

  const payload = verifyJwt(token)
  const userId = payload?.id
  console.log('[JURNAL] userId:', userId)

  
  /* ================= SISWA ================= */
  const { data: siswa, error: siswaError } = await db
    .from('siswa')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (siswaError || !siswa) {
    console.log('[JURNAL] Data siswa tidak ditemukan', siswaError)
    return (
      <LogbookClient
        data={[]}
        total={0}
        stats={{ total: 0, approved: 0, pending: 0, rejected: 0 }}
        page={1}
        search=""
        magangId={null}
      />
    )
  }
  console.log('[JURNAL] siswaId:', siswa.id)

  /* ================= MAGANG ================= */
  const { data: magang, error: magangError } = await db
    .from('magang')
    .select('id')
    .eq('siswa_id', siswa.id)
    .in('status', ['berlangsung', 'pending', 'diterima', 'selesai'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (magangError || !magang) {
    console.log('[JURNAL] Magang belum ditemukan', magangError)
    return (
      <LogbookClient
        data={[]}
        total={0}
        stats={{ total: 0, approved: 0, pending: 0, rejected: 0 }}
        page={1}
        search=""
        magangId={null}
      />
    )
  }
  console.log('[JURNAL] magangId:', magang.id)

  /* ================= PARAM ================= */
  const page = Number(searchParams?.page || 1)
  const search = searchParams?.search || ''

  /* ================= DATA ================= */
  const { data, total } = await getLogbookList({
    magangId: magang.id,
    page,
    search,
    limit: 5,
  })

  const stats = await getLogbookStats(magang.id)

  return (
    <LogbookClient
      data={data}
      total={total}
      stats={stats}
      page={page}
      search={search}
      magangId={magang.id} // kirim magangId ke client
    />
  )
}
