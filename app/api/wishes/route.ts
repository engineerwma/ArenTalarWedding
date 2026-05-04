import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    const wish = await prisma.wish.create({
      data: { message: message.trim() },
    })

    return NextResponse.json({ success: true, data: wish })
  } catch (error) {
    console.error('Wish Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save wish' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const wishes = await prisma.wish.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ success: true, data: wishes })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishes' },
      { status: 500 }
    )
  }
}