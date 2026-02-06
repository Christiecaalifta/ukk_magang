'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Eye,
  Pencil,
  FileText,
  Plus,
  BookOpen,
} from 'lucide-react'


export default function LogbookClient({
  data,
  total,
  stats,
  page,
  search,
}: any) {

  const router = useRouter()


  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }


  function handleSearch(e: any) {
    router.push(`/siswa/logbook?search=${e.target.value}`)
  }


  return (
    <>

      {/* ================= CARD ================= */}
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">


        {/* HEADER */}
        <div className="flex justify-between items-center">

          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <BookOpen size={22} className="text-cyan-600" />
            Jurnal Harian Magang
          </h1>

          <Link
            href="/siswa/logbook/tambah"
            className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
          >
            <Plus size={18} />
            Tambah
          </Link>

        </div>


        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <StatBox title="Total" value={stats.total} />
          <StatBox title="Disetujui" value={stats.approved} />
          <StatBox title="Pending" value={stats.pending} />
          <StatBox title="Ditolak" value={stats.rejected} />

        </div>


        {/* SEARCH */}
        <input
          defaultValue={search}
          onChange={handleSearch}
          placeholder="Cari kegiatan / kendala..."
          className="border px-3 py-2 rounded-lg w-full md:w-1/3 text-sm"
        />


        {/* TABLE */}
        <div className="bg-white rounded-xl p-5 shadow-sm border">

          <table className="w-full text-sm">

            <thead className="border-b text-gray-500">
              <tr>
                <th className="text-left py-2">Tanggal</th>
                <th className="text-left py-2">Kegiatan</th>
                <th className="text-center py-2">Status</th>
                <th className="text-center py-2">File</th>
                <th className="text-center py-2">Aksi</th>
              </tr>
            </thead>


            <tbody className="divide-y">

              {data.map((d: any) => (

                <tr
                  key={d.id}
                  className="hover:bg-gray-50"
                >

                  <td className="py-3">
                    {formatDate(d.tanggal)}
                  </td>


                  <td className="py-3">

                    <p className="font-medium">
                      {d.kegiatan}
                    </p>

                    {d.kendala && (
                      <p className="text-xs text-gray-400">
                        Kendala: {d.kendala}
                      </p>
                    )}

                  </td>


                  <td className="py-3 text-center">
                    <StatusBadge status={d.status_verifikasi} />
                  </td>


                  <td className="py-3 text-center">

                    {d.file ? (

                      <a
                        href={d.file}
                        target="_blank"
                        className="text-cyan-600"
                      >
                        <FileText size={16} />
                      </a>

                    ) : '-'}

                  </td>


                  <td className="py-3">

                    <div className="flex justify-center gap-3">

                      <Link
                        href={`/siswa/logbook/${d.id}`}
                        className="text-gray-400 hover:text-cyan-600"
                      >
                        <Eye size={16} />
                      </Link>


                      {d.status_verifikasi === 'pending' && (

                        <Link
                          href={`/siswa/logbook/edit/${d.id}`}
                          className="text-gray-400 hover:text-yellow-600"
                        >
                          <Pencil size={16} />
                        </Link>

                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          <p className="text-xs text-gray-400 mt-4">
            Menampilkan {data.length} dari {total} data
          </p>

        </div>

      </div>

    </>
  )
}


/* ================= SUB ================= */

function StatBox({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">

      <p className="text-gray-500 text-xs">
        {title}
      </p>

      <h2 className="text-xl font-bold">
        {value}
      </h2>

    </div>
  )
}


function StatusBadge({ status }: any) {

  const map: any = {
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs ${map[status]}`}
    >
      {status}
    </span>
  )
}
