// app/api/guru/dashboard/route.ts
import { NextResponse } from 'next/server'
import { getGuruDashboardData } from '@/lib/services/guru/guruDashboard'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const guruId = searchParams.get('guruId')
    if (!guruId) {
      return NextResponse.json({ error: 'guruId wajib dikirim' }, { status: 400 })
    }

    // PENTING: kirim guruId ke fungsi
    const data = await getGuruDashboardData(Number(guruId))
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal ambil data dashboard guru' }, { status: 500 })
  }
}
