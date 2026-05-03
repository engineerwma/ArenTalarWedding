import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const EXCEL_PATH = path.join(process.cwd(), 'data', 'rsvps.xlsx');

export async function GET() {
  if (!fs.existsSync(EXCEL_PATH)) {
    return NextResponse.json({ error: 'No RSVP file found' }, { status: 404 });
  }
  const file = fs.readFileSync(EXCEL_PATH);
  return new NextResponse(file, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="wedding-rsvps.xlsx"',
    },
  });
}
