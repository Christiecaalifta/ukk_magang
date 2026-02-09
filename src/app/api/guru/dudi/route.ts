// app/api/guru/dudi/route.ts
import { NextResponse } from 'next/server'
import { getDudiListForGuru } from '@/lib/services/guru/dudi'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const guruId = searchParams.get('guruId')
    const page = Number(searchParams.get('page') || 1)
    const q = searchParams.get('q') || ''

    if (!guruId) return NextResponse.json({ error: 'guruId wajib dikirim' }, { status: 400 })

    const data = await getDudiListForGuru(Number(guruId), { search: q, page, limit: 5 })
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Gagal ambil DUDI' }, { status: 500 })
  }
}
