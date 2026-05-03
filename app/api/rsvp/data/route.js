import { getRSVPEntries } from '@/lib/excel';
import { verifyPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  // Get password from Authorization header
  const authHeader = request.headers.get('authorization');
  const password = authHeader?.split(' ')[1];
  
  if (!password || !verifyPassword(password)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const entries = await getRSVPEntries();
    return NextResponse.json({ entries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching RSVP data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVP data' },
      { status: 500 }
    );
  }
}