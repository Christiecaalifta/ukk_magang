'use client'

import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'

interface DudiDummy {
  id: number
  nama: string
  bidang: string
  alamat: string
  pic: string
  kuota: number
  terisi: number
  status: 'menunggu' | 'tersedia'
  deskripsi: string
}

const dummyData: DudiDummy[] = [
  {
    id: 1,
    nama: 'PT Kreatif Teknologi',
    bidang: 'Teknologi Informasi',
    alamat: 'Jl. Merdeka No. 123, Jakarta',
    pic: 'Andi Wijaya',
    kuota: 12,
    terisi: 8,
    status: 'menunggu',
    deskripsi: 'Perusahaan teknologi yang bergerak dalam pengembangan aplikasi web dan mobile. Memberikan kesempatan magang terbaik untuk siswa RPL & jurusan TI.'
  },
  {
    id: 2,
    nama: 'CV Digital Solusi',
    bidang: 'Digital Marketing',
    alamat: 'Jl. Sudirman No. 45, Surabaya',
    pic: 'Sari Dewi',
    kuota: 8,
    terisi: 5,
    status: 'tersedia',
    deskripsi: 'Konsultan digital marketing yang membantu UMKM berkembang di era digital. Menyediakan program magang untuk jurusan multimedia dan pemasaran.'
  },
  {
    id: 3,
    nama: 'PT Inovasi Mandiri',
    bidang: 'Software Development',
    alamat: 'Jl. Diponegoro No. 78, Surabaya',
    pic: 'Budi Santoso',
    kuota: 15,
    terisi: 12,
    status: 'tersedia',
    deskripsi: 'Perusahaan software house yang mengembangkan sistem informasi untuk berbagai industri. Menawarkan pengalaman magang yang komprehensif.'
  },
  {
    id: 4,
    nama: 'PT Teknologi Maju',
    bidang: 'Hardware & Networking',
    alamat: 'Jl. HR Rasuna Said No. 12, Jakarta',
    pic: 'Lisa Permata',
    kuota: 10,
    terisi: 6,
    status: 'tersedia',
    deskripsi: 'Spesialis dalam instalasi dan maintenance hardware komputer serta jaringan. Cocok untuk siswa jurusan TKJ dan multimedia.'
  },
  {
    id: 5,
    nama: 'CV Solusi Digital Prima',
    bidang: 'E-commerce',
    alamat: 'Jl. Gatot Subroto No. 88, Bandung',
    pic: 'Rahmat Hidayat',
    kuota: 12,
    terisi: 9,
    status: 'tersedia',
    deskripsi: 'Platform e-commerce yang melayani berbagai produk lokal. Memberikan pengalaman magang dalam bidang IT dan digital marketing.'
  },
  {
    id: 6,
    nama: 'PT Inovasi Global',
    bidang: 'Konsultan IT',
    alamat: 'Jl. Pemuda No. 156, Semarang',
    pic: 'Maya Sari',
    kuota: 20,
    terisi: 15,
    status: 'tersedia',
    deskripsi: 'Konsultan IT yang memberikan solusi teknologi untuk berbagai perusahaan. Program magang dengan mentoring intensif tersedia.'
  },
]

export default function DudiPage() {
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(6)

  const filtered = dummyData.filter(d => 
    d.nama.toLowerCase().includes(search.toLowerCase()) ||
    d.bidang.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Cari Tempat Magang</h1>

      {/* Search & Limit */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari perusahaan, bidang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={6}>6 per halaman</option>
          <option value={12}>12 per halaman</option>
          <option value={18}>18 per halaman</option>
        </select>
      </div>

      {/* DUDI Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.slice(0, limit).map(d => (
          <div key={d.id} className="border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-base">{d.nama}</h2>
              <span className={`text-xs px-2 py-1 rounded-full ${
                d.status === 'menunggu'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-cyan-100 text-cyan-700'
              }`}>
                {d.status === 'menunggu' ? 'Menunggu' : 'Tersedia'}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-1">📍 {d.alamat}</p>
            <p className="text-sm text-gray-500 mb-2">👤 PIC: {d.pic}</p>

            {/* Kuota */}
            <div className="mb-2 text-sm">
              Kuota Magang: {d.terisi}/{d.kuota}
              <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                <div
                  className="bg-cyan-600 h-2 rounded-full"
                  style={{ width: `${(d.terisi / d.kuota) * 100}%` }}
                ></div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{d.deskripsi}</p>

            <div className="flex justify-between mt-auto gap-2">
              <button className="flex-1 text-sm px-2 py-1 rounded-lg border text-gray-600 hover:underline">
                Detail
              </button>
              <button
                className={`flex-1 text-sm px-2 py-1 rounded-lg text-white ${
                  d.status === 'menunggu' ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'
                }`}
                disabled={d.status === 'menunggu'}
              >
                {d.status === 'menunggu' ? 'Sudah Mendaftar' : 'Daftar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dummy */}
      <div className="flex justify-center items-center mt-6 gap-3">
        <button className="px-3 py-1 border rounded disabled:opacity-50">&lt;</button>
        <span>1 / 1</span>
        <button className="px-3 py-1 border rounded disabled:opacity-50">&gt;</button>
      </div>
    </div>
  )
}
