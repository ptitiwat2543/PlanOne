import { eq, lt } from 'drizzle-orm';
import { db } from '..';
import { NewUserSession, userSessions, type UserSession } from '../schema';
import crypto from 'crypto';

/**
 * สร้าง session ใหม่สำหรับผู้ใช้งาน
 * @param userId ID ของผู้ใช้
 * @param ipAddress IP address ของผู้ใช้ (optional)
 * @param userAgent User Agent ของผู้ใช้ (optional)
 * @param expiresIn ระยะเวลาหมดอายุในวินาที (default: 7 วัน)
 * @returns session ที่สร้างขึ้น
 */
export async function createSession(
  userId: number,
  ipAddress?: string,
  userAgent?: string,
  expiresIn: number = 7 * 24 * 60 * 60 // 7 วัน
): Promise<UserSession> {
  // สร้าง token สำหรับ session
  const token = crypto.randomBytes(32).toString('hex');
  
  // คำนวณเวลาหมดอายุ
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
  
  // สร้างข้อมูล session
  const sessionData: NewUserSession = {
    userId,
    token,
    expiresAt,
    ipAddress,
    userAgent,
    createdAt: new Date()
  };
  
  // บันทึกลงฐานข้อมูล
  const result = await db.insert(userSessions).values(sessionData).returning();
  return result[0];
}

/**
 * ดึงข้อมูล session จาก token
 * @param token token ของ session
 * @returns ข้อมูล session หรือ undefined ถ้าไม่พบหรือหมดอายุ
 */
export async function getSessionByToken(token: string): Promise<UserSession | undefined> {
  const now = new Date();
  
  // ค้นหา session ที่ตรงกับ token และยังไม่หมดอายุ
  const result = await db
    .select()
    .from(userSessions)
    .where(eq(userSessions.token, token));
  
  if (result.length === 0) {
    return undefined;
  }
  
  const session = result[0];
  
  // ตรวจสอบว่า session หมดอายุหรือยัง
  if (session.expiresAt < now) {
    // ถ้าหมดอายุแล้ว ให้ลบ session นั้นทิ้ง
    await db.delete(userSessions).where(eq(userSessions.id, session.id));
    return undefined;
  }
  
  return session;
}

/**
 * ลบ session
 * @param token token ของ session ที่ต้องการลบ
 * @returns จำนวน session ที่ถูกลบ
 */
export async function deleteSession(token: string): Promise<number> {
  const result = await db.delete(userSessions).where(eq(userSessions.token, token));
  return result.rowCount ?? 0;
}

/**
 * ลบ session ทั้งหมดของผู้ใช้
 * @param userId ID ของผู้ใช้
 * @returns จำนวน session ที่ถูกลบ
 */
export async function deleteAllUserSessions(userId: number): Promise<number> {
  const result = await db.delete(userSessions).where(eq(userSessions.userId, userId));
  return result.rowCount ?? 0;
}

/**
 * ลบ session ที่หมดอายุทั้งหมด
 * @returns จำนวน session ที่ถูกลบ
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const now = new Date();
  const result = await db.delete(userSessions).where(lt(userSessions.expiresAt, now));
  return result.rowCount ?? 0;
}
