// app/api/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const RSVP_FILE_PATH = path.join(process.cwd(), 'data', 'rsvp.xlsx');
const WISHES_FILE_PATH = path.join(process.cwd(), 'data', 'wishes.xlsx');

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  let filePath: string;
  let fileName: string;

  if (type === 'wishes') {
    filePath = WISHES_FILE_PATH;
    fileName = `wishes_${new Date().toISOString().split('T')[0]}.xlsx`;
  } else {
    filePath = RSVP_FILE_PATH;
    fileName = `rsvp_${new Date().toISOString().split('T')[0]}.xlsx`;
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}"`
    }
  });
}