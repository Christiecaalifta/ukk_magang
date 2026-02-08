import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'

export function getCurrentUser() {
  const token = cookies().get('token')?.value

  if (!token) return null

  try {
    return verifyJwt(token)
  } catch {
    return null
  }
}
