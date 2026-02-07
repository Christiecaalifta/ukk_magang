'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  role: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include', // kirim cookie
        })

        if (!res.ok) return

        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user) {
    return <p>Unauthorized</p>
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-lg font-semibold">
        Selamat datang, {user.name}! 👋
      </h2>
    </div>
  )
}
