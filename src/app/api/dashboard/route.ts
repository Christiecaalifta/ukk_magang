import { NextResponse } from 'next/server'
import { getDashboardData} from '@/lib/services/adminDashboard'

export async function GET() {
  try {
    const data = await getDashboardData()
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal ambil data dashboard' }, { status: 500 })
  }
}
