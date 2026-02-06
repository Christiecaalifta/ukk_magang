'use client'

import { useEffect, useState } from 'react'
import {jwtDecode} from 'jwt-decode'

interface JwtPayload {
  id: string
  name: string
  role: string
}

export default function DashboardPage() {
  const [name, setName] = useState('')

  useEffect(() => {
  const token = localStorage.getItem('token')

  if (!token) return

  const decoded = jwtDecode(token)

  console.log('JWT Payload:', decoded)
}, [])


  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-lg font-semibold">
        Selamat datang, {name}!
      </h2>
    </div>
  )
}
