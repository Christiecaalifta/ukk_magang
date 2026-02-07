import jwt, { JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export interface AppJwtPayload extends JwtPayload {
  id: string
  name: string
  email: string
  role: string
}

// Generate token
export function signJwt(payload: AppJwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d',
  })
}

// Verify token
export function verifyJwt(token: string): AppJwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET)

  if (typeof decoded === 'string') {
    throw new Error('Invalid token')
  }

  return decoded as AppJwtPayload
}
