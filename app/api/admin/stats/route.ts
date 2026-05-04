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

    const allRsvps = await prisma.rSVP.findMany()
    const wishes = await prisma.wish.count()
    
    let totalGuests = 0
    let attendingCount = 0
    
    allRsvps.forEach(rsvp => {
      if (rsvp.attending) {
        attendingCount++
        const guests = typeof rsvp.guests === 'string' ? JSON.parse(rsvp.guests) : rsvp.guests
        totalGuests += 1 + (guests?.length || 0)
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalRsvps: allRsvps.length,
        attending: attendingCount,
        notAttending: allRsvps.length - attendingCount,
        totalGuests,
        wishes,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}