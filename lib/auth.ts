import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-at-least-32-characters-long'

interface TokenPayload {
  userId: string
  exp: number
}

export function generateToken(userId: string): string {
  const payload: TokenPayload = {
    userId,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  
  const payloadString = JSON.stringify(payload)
  const base64Payload = Buffer.from(payloadString).toString('base64')
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(base64Payload)
    .digest('base64')
  
  return `${base64Payload}.${signature}`
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const [base64Payload, signature] = token.split('.')
    
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(base64Payload)
      .digest('base64')
    
    if (signature !== expectedSignature) {
      return null
    }
    
    const payload: TokenPayload = JSON.parse(Buffer.from(base64Payload, 'base64').toString())
    
    if (payload.exp < Date.now()) {
      return null
    }
    
    return { userId: payload.userId }
  } catch {
    return null
  }
}