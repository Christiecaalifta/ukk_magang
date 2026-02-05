'use client'

import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  User,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

export default function DudiTableClient({ data, total }: any) {
  const [loading, setLoading] = useState(false)

  async function softDelete(id: string) {
    if (!confirm('Yakin ingin menghapus DUDI ini?')) return
    setLoading(true)
    await supabase.from('dudi').update({ deleted_at: new Date() }).eq('id', id)
    location.reload()
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold flex items-center gap-2">
          <Building2 className="text-cyan-500" size={18} />
          Daftar DUDI
        </h2>

        <Link
          href="/admin/dudi/tambah"
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700"
        >
          + Tambah DUDI
        </Link>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari nama perusahaan..."
          className="border rounded-lg px-4 py-2 text-sm w-full md:w-64"
          onChange={(e) => {
            const q = e.target.value
            window.location.href = `?q=${q}`
          }}
        />

        <select
          className="border rounded-lg px-3 py-2 text-sm w-full md:w-48"
          onChange={(e) => {
            window.location.href = `?status=${e.target.value}`
          }}
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Tidak Aktif</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left py-2">Perusahaan</th>
            <th className="text-left">Kontak</th>
            <th className="text-left">Penanggung Jawab</th>
            <th className="text-center">Status</th>
            <th className="text-center">Siswa</th>
            <th className="text-center">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.map((d: any) => (
            <tr key={d.id} className="hover:bg-gray-50">

              {/* PERUSAHAAN */}
              <td className="py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center">
                  <Building2 size={18} />
                </div>

                <div>
                  <p className="font-semibold">{d.nama_perusahaan}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin size={12} />
                    {d.alamat}
                  </p>
                </div>
              </td>

              {/* KONTAK */}
              <td>
                <p className="flex items-center gap-1 text-sm">
                  <Mail size={14} className="text-gray-400" />
                  {d.email}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <Phone size={14} />
                  {d.telepon}
                </p>
              </td>

              {/* PENANGGUNG JAWAB */}
              <td className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} className="text-gray-400" />
                {d.penanggung_jawab || '—'}
              </td>

              {/* STATUS */}
              <td className="text-center">
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium
      ${d.status === 'aktif'
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700'
      }`}
  >
    {d.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
  </span>
</td>


              {/* SISWA */}
              <td className="text-center">
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                  {d.magang?.length || 0}
                </span>
              </td>

              {/* AKSI */}
              <td className="flex gap-3 justify-center">
                <Link
                  href={`/admin/dudi/${d.id}/edit`}
                  className="text-gray-400 hover:text-cyan-600"
                >
                  <Pencil size={16} />
                </Link>

                <button
                  disabled={loading}
                  onClick={() => softDelete(d.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* FOOTER */}
      <p className="text-xs text-gray-400 mt-4">
        Menampilkan {data.length} dari {total} data
      </p>
    </div>
  )
}
