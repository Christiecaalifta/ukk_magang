import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 1️⃣ GET untuk ambil list guru (dropdown siswa)
// Di app/api/users/route.ts
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const role = url.searchParams.get('role')
    const userId = url.searchParams.get('userId')

    // ✅ Untuk fetch detail satu user
    if (userId) {
      const { data: user, error } = await supabase
        .from('users')
        .select(`
          *,
          siswa (
            kelas,
            jurusan,
            nis,
            guru:guru_id (
              user_id,
              nama
            )
          ),
          guru (
            nip,
            alamat,
            telepon
          )
        `)
        .eq('id', userId)
        .single()

      if (error) throw error
      return NextResponse.json(user)
    }

    // Untuk dropdown guru
    if (role === 'guru') {
      const { data: guru, error } = await supabase
        .from('guru')
        .select('id, nama, user_id')
        .order('nama', { ascending: true })

      if (error) throw error
      return NextResponse.json(guru)
    }

    return NextResponse.json([], { status: 200 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ message: err.message || 'Gagal fetch data' }, { status: 500 })
  }
}


// 2️⃣ POST untuk tambah user
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      role,
      password,
      email_verified_at,
      kelas,
      jurusan,
      nis,
      nip,
      alamat,
      telepon,
      pembimbing,
    } = body

    // Validasi wajib
    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { message: 'Lengkapi data wajib: name, email, role, password' },
        { status: 400 }
      )
    }

    // Cek email unik
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert ke tabel users
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        role,
        password: hashedPassword,
        email_verified_at,
      })
      .select()
      .single()

    if (userError) throw userError

    // Role-specific inserts
    if (role === 'siswa') {
      if (!kelas || !jurusan || !nis || !pembimbing) {
        return NextResponse.json(
          { message: 'Lengkapi data siswa: kelas, jurusan, nis, guru pembimbing' },
          { status: 400 }
        )
      }

      // Ambil guru.id dari user_id
      const { data: guruData, error: guruError } = await supabase
        .from('guru')
        .select('id')
        .eq('user_id', pembimbing)
        .single()

      if (guruError || !guruData) {
        return NextResponse.json(
          { message: 'Guru pembimbing tidak valid' },
          { status: 400 }
        )
      }

      const { error } = await supabase.from('siswa').insert({
        user_id: user.id,
        nama: name,
        kelas,
        jurusan,
        nis,
        guru_id: guruData.id,
      })
      if (error) throw error
    }

    if (role === 'guru') {
      if (!nip || !alamat || !telepon) {
        return NextResponse.json(
          { message: 'Lengkapi data guru: nip, alamat, telepon' },
          { status: 400 }
        )
      }

      // Cek NIP unik
      const { data: existingNip } = await supabase
        .from('guru')
        .select('id')
        .eq('nip', nip)
        .single()

      if (existingNip) {
        return NextResponse.json({ message: 'NIP sudah terdaftar' }, { status: 400 })
      }

      const { error } = await supabase.from('guru').insert({
        user_id: user.id,
        nama: name,
        nip,
        alamat,
        telepon,
      })
      if (error) throw error
    }

    return NextResponse.json({ success: true, user })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { message: err.message || 'Gagal menambah user' },
      { status: 400 }
    )
  }
}

// 3️⃣ PUT untuk update/edit user
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, name, email, role, verified, kelas, jurusan, nis, nip, alamat, telepon, pembimbing } = body

    // 1. Update Tabel Utama Users
    const { error: userError } = await supabase
      .from('users')
      .update({
        name,
        email,
        role,
        email_verified_at: verified === 'true' ? new Date().toISOString() : null,
      })
      .eq('id', id)

    if (userError) throw userError

    // 2. Bersihkan Data Role Lama & Masukkan Data Baru (Logika Upsert/Switch)
    // Hapus dari kedua tabel detail untuk memastikan tidak ada duplikasi jika role berubah
    await supabase.from('siswa').delete().eq('user_id', id)
    await supabase.from('guru').delete().eq('user_id', id)

    if (role === 'siswa') {
      // Ambil ID Guru (Bukan UserID) untuk Relasi
      const { data: guruData } = await supabase
        .from('guru')
        .select('id')
        .eq('user_id', pembimbing)
        .single()

      const { error } = await supabase.from('siswa').insert({
        user_id: id,
        nama: name,
        kelas,
        jurusan,
        nis,
        guru_id: guruData?.id || null
      })
      if (error) throw error
    }

    if (role === 'guru') {
      const { error } = await supabase.from('guru').insert({
        user_id: id,
        nama: name,
        nip,
        alamat,
        telepon
      })
      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}