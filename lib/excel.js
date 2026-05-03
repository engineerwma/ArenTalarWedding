import fs from 'fs-extra';
import path from 'path';
import XLSX from 'xlsx';

const DATA_DIR = path.join(process.cwd(), 'data');
const EXCEL_PATH = path.join(DATA_DIR, 'rsvp.xlsx');

// Ensure data directory exists
export async function ensureDataDir() {
  await fs.ensureDir(DATA_DIR);
}

// Initialize Excel file if it doesn't exist
export async function initExcel() {
  await ensureDataDir();
  
  if (!fs.existsSync(EXCEL_PATH)) {
    const headers = [
      'Timestamp',
      'Full Name',
      'Attending',
      'Guests',
      'Song Request',
      'Traveling From',
      'Notes'
    ];
    
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RSVP');
    XLSX.writeFile(wb, EXCEL_PATH);
  }
}

// Add RSVP entry to Excel
export async function addRSVPEntry(data) {
  await initExcel();
  
  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets['RSVP'];
  const existingData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  
  const timestamp = new Date().toISOString();
  const guests = data.guests ? data.guests.join(', ') : '';
  const travelingFrom = data.traveling === 'yes' ? data.travel_from : 'From Armenia';
  
  const newRow = [
    timestamp,
    data.name,
    data.attending === 'yes' ? 'Yes' : 'No',
    guests,
    data.song || '',
    travelingFrom,
    data.notes || ''
  ];
  
  existingData.push(newRow);
  const newWs = XLSX.utils.aoa_to_sheet(existingData);
  wb.Sheets['RSVP'] = newWs;
  XLSX.writeFile(wb, EXCEL_PATH);
  
  return true;
}

// Get all RSVP entries
export async function getRSVPEntries() {
  await initExcel();
  
  if (!fs.existsSync(EXCEL_PATH)) {
    return [];
  }
  
  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets['RSVP'];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = data.slice(1).filter(row => row[0] && row[0].trim());
  
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] || '';
    });
    return obj;
  });
}