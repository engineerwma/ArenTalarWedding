// app/api/wishes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const WISHES_FILE_PATH = path.join(process.cwd(), 'data', 'wishes.xlsx');

function initWishesFile() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(WISHES_FILE_PATH)) {
    const headers = ['Timestamp', 'Message'];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Wishes');
    XLSX.writeFile(wb, WISHES_FILE_PATH);
  }
}

function readWishesData(): any[] {
  initWishesFile();
  const fileBuffer = fs.readFileSync(WISHES_FILE_PATH);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
}

function appendWish(data: any) {
  initWishesFile();
  const existingData = readWishesData();
  const ws = XLSX.utils.json_to_sheet([data], { header: Object.keys(data) });
  
  if (existingData.length > 0) {
    const existingWs = XLSX.utils.json_to_sheet(existingData);
    const newWs = XLSX.utils.sheet_add_json(existingWs, [data], { skipHeader: true });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, newWs, 'Wishes');
    XLSX.writeFile(wb, WISHES_FILE_PATH);
  } else {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Wishes');
    XLSX.writeFile(wb, WISHES_FILE_PATH);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, timestamp } = body;

    const wishData = {
      Timestamp: timestamp || new Date().toISOString(),
      Message: message
    };

    appendWish(wishData);

    return NextResponse.json({ success: true, message: 'Wish saved successfully' });
  } catch (error) {
    console.error('Error saving wish:', error);
    return NextResponse.json({ success: false, message: 'Failed to save wish' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = readWishesData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error reading wishes data:', error);
    return NextResponse.json({ success: false, message: 'Failed to read wishes data' }, { status: 500 });
  }
}