import jwt, { JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export interface AppJwtPayload extends JwtPayload {
  email: string
  role: string
}

export function signJwt(payload: AppJwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d',
  })
}

export function verifyJwt(token: string): AppJwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET)

  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload')
  }

  return decoded as AppJwtPayload
}
