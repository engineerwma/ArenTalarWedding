import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { attending, fullName, guests, songRequest, travelingFrom } = body

    // Validate required fields
    if (!fullName) {
      return NextResponse.json(
        { success: false, error: 'Full name is required' },
        { status: 400 }
      )
    }

    const rsvp = await prisma.rSVP.create({
      data: {
        attending: attending === 'yes',
        fullName: fullName.trim(),
        guests: JSON.stringify(guests || []),
        songRequest: songRequest || null,
        travelingFrom: travelingFrom || null,
      },
    })

    return NextResponse.json({ 
      success: true, 
      data: { id: rsvp.id, attending: rsvp.attending } 
    })
  } catch (error) {
    console.error('RSVP Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save RSVP. Please try again.' },
      { status: 500 }
    )
  }
}