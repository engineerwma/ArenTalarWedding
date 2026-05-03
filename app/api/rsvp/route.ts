// app/api/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Use a writable directory that Next.js can access
const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const RSVP_FILE_PATH = path.join(DATA_DIR, 'rsvp.xlsx');
const WISHES_FILE_PATH = path.join(DATA_DIR, 'wishes.xlsx');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initialize RSVP Excel file if not exists
function initRSVPFile() {
  ensureDataDir();
  if (!fs.existsSync(RSVP_FILE_PATH)) {
    const headers = [
      'Timestamp',
      'Attending',
      'Full Name',
      'Guests',
      'Song Request',
      'Traveling From Abroad',
      'Travel From Location'
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RSVPs');
    // Use write instead of writeFile for better error handling
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    fs.writeFileSync(RSVP_FILE_PATH, buffer);
  }
}

// Read RSVP data from Excel
function readRSVPData(): any[] {
  try {
    initRSVPFile();
    const fileBuffer = fs.readFileSync(RSVP_FILE_PATH);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
  } catch (error) {
    console.error('Error reading RSVP data:', error);
    return [];
  }
}

// Append RSVP to Excel
async function appendRSVP(data: any) {
  initRSVPFile();
  
  let existingData: any[] = [];
  try {
    existingData = readRSVPData();
  } catch (error) {
    console.error('Error reading existing data:', error);
  }
  
  existingData.push(data);
  
  const ws = XLSX.utils.json_to_sheet(existingData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'RSVPs');
  
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  fs.writeFileSync(RSVP_FILE_PATH, buffer);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attending, name, guests, song, traveling, travelFrom, timestamp } = body;

    const rsvpData = {
      Timestamp: timestamp || new Date().toISOString(),
      Attending: attending ? 'Yes' : 'No',
      'Full Name': name,
      'Guests': guests && guests.length > 0 ? guests.join(', ') : '',
      'Song Request': song || '',
      'Traveling From Abroad': traveling ? 'Yes' : 'No',
      'Travel From Location': travelFrom || ''
    };

    await appendRSVP(rsvpData);

    return NextResponse.json({ success: true, message: 'RSVP saved successfully' });
  } catch (error) {
    console.error('Error saving RSVP:', error);
    return NextResponse.json({ success: false, message: 'Failed to save RSVP' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = readRSVPData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error reading RSVP data:', error);
    return NextResponse.json({ success: false, message: 'Failed to read RSVP data', data: [] }, { status: 500 });
  }
}