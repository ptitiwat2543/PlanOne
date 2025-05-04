import crypto from 'crypto';

/**
 * สร้าง hash สำหรับ password
 * @param password รหัสผ่านที่ต้องการทำ hash
 * @returns รหัสผ่านที่ผ่านการทำ hash แล้ว
 */
export async function generatePasswordHash(password: string): Promise<string> {
  // สร้าง salt แบบสุ่ม
  const salt = crypto.randomBytes(16).toString('hex');

  // สร้าง hash จาก password และ salt ด้วย PBKDF2
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  // ส่งคืนค่าในรูปแบบ salt:hash
  return `${salt}:${hash}`;
}

/**
 * ตรวจสอบ password ว่าตรงกับ hash หรือไม่
 * @param password รหัสผ่านที่ต้องการตรวจสอบ
 * @param hashedPassword รหัสผ่านที่ผ่านการ hash แล้ว
 * @returns true ถ้ารหัสผ่านถูกต้อง, false ถ้าไม่ถูกต้อง
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // แยก salt และ hash จากรหัสผ่านที่ hash แล้ว
  const parts = hashedPassword.split(':');
  if (parts.length !== 2) {
    return false; // รูปแบบ hash ไม่ถูกต้อง
  }

  const salt = parts[0];
  const originalHash = parts[1];

  // สร้าง hash จาก password ที่ส่งเข้ามาและ salt เดิม
  // แก้ไขให้ salt เป็น string เสมอเพื่อแก้ไขปัญหา Type
  if (!salt) {
    return false;
  }

  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  // เปรียบเทียบ hash
  return hash === originalHash;
}

/**
 * สร้าง token สำหรับการยืนยันอีเมล
 * @returns token สำหรับการยืนยันอีเมล
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * สร้าง token สำหรับการรีเซ็ตรหัสผ่าน
 * @returns token สำหรับการรีเซ็ตรหัสผ่าน
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
