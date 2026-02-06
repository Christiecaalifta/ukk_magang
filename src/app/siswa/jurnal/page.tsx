import {
  getLogbookList,
  getLogbookStats,
} from '@/lib/services/siswa/jurnal'

import LogbookClient from './jurnaltabel'


export default async function LogbookPage({ searchParams }: any) {

  /* ================= AUTH ================= */

  // ⚠️ nanti ambil dari session
  const magangId = 1


  /* ================= PARAM ================= */

  const page = Number(searchParams?.page || 1)
  const search = searchParams?.search || ''


  /* ================= DATA ================= */

  const { data, total } = await getLogbookList({
    magangId,
    page,
    search,
    limit: 5,
  })

  const stats = await getLogbookStats(magangId)


  return (

    <LogbookClient
      data={data}
      total={total}
      stats={stats}
      page={page}
      search={search}
    />

  )
}
