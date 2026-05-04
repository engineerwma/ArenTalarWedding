import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const rsvps = await prisma.rSVP.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const formattedRsvps = rsvps.map(rsvp => ({
      ...rsvp,
      guests: typeof rsvp.guests === 'string' ? JSON.parse(rsvp.guests) : rsvp.guests,
    }))

    return NextResponse.json({ success: true, data: formattedRsvps })
  } catch (error) {
    console.error('Fetch RSVPs Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RSVPs' },
      { status: 500 }
    )
  }
}