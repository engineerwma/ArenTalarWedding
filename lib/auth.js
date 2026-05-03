import bcrypt from 'bcryptjs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Simple password verification
export async function verifyPassword(password) {
  return password === ADMIN_PASSWORD;
}

// For more security, use bcrypt:
// export async function verifyPassword(password) {
//   return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
// }