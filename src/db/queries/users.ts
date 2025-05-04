import { eq } from 'drizzle-orm';
import { db } from '..';
import { NewUser, NewUserProfile, users, userProfiles, type User } from '../schema';
import { generatePasswordHash } from '@/lib/utils/auth';

/**
 * ค้นหาผู้ใช้ตาม email
 * @param email อีเมลที่ต้องการค้นหา
 * @returns ข้อมูลผู้ใช้งานหรือ undefined ถ้าไม่พบ
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
}

/**
 * ค้นหาผู้ใช้ตาม username
 * @param username ชื่อผู้ใช้ที่ต้องการค้นหา
 * @returns ข้อมูลผู้ใช้งานหรือ undefined ถ้าไม่พบ
 */
export async function getUserByUsername(username: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.username, username));
  return result[0];
}

/**
 * ค้นหาผู้ใช้ตาม ID
 * @param id ID ของผู้ใช้ที่ต้องการค้นหา
 * @returns ข้อมูลผู้ใช้งานหรือ undefined ถ้าไม่พบ
 */
export async function getUserById(id: number): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}

/**
 * สร้างผู้ใช้งานใหม่
 * @param userData ข้อมูลผู้ใช้งานที่ต้องการสร้าง
 * @returns ข้อมูลผู้ใช้งานที่สร้าง
 */
export async function createUser(userData: Omit<NewUser, 'passwordHash'> & { password: string }): Promise<User> {
  // ตรวจสอบว่า email หรือ username ซ้ำหรือไม่
  const existingEmail = await getUserByEmail(userData.email);
  if (existingEmail) {
    throw new Error('Email already exists');
  }

  const existingUsername = await getUserByUsername(userData.username);
  if (existingUsername) {
    throw new Error('Username already exists');
  }

  // สร้าง hash จาก password
  const passwordHash = await generatePasswordHash(userData.password);

  // สร้างข้อมูลสำหรับบันทึกลงฐานข้อมูล
  const { password, ...userDataWithoutPassword } = userData;
  const newUserData: NewUser = {
    ...userDataWithoutPassword,
    passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // บันทึกข้อมูลลงฐานข้อมูล
  const result = await db.insert(users).values(newUserData).returning();
  return result[0];
}

/**
 * สร้างหรืออัปเดตโปรไฟล์ของผู้ใช้
 * @param profileData ข้อมูลโปรไฟล์ที่ต้องการบันทึก
 * @returns ข้อมูลโปรไฟล์ที่บันทึก
 */
export async function upsertUserProfile(profileData: NewUserProfile) {
  // ตรวจสอบว่ามีโปรไฟล์อยู่แล้วหรือไม่
  const existingProfile = await db.select().from(userProfiles).where(eq(userProfiles.userId, profileData.userId));

  if (existingProfile.length > 0) {
    // ถ้ามีแล้วให้อัปเดต
    return await db
      .update(userProfiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(userProfiles.userId, profileData.userId))
      .returning();
  } else {
    // ถ้ายังไม่มีให้สร้างใหม่
    return await db.insert(userProfiles).values(profileData).returning();
  }
}

/**
 * ยืนยันอีเมลของผู้ใช้งาน
 * @param userId ID ของผู้ใช้
 * @param token token สำหรับยืนยันอีเมล
 * @returns true ถ้าสำเร็จ, false ถ้าไม่สำเร็จ
 */
export async function verifyEmail(userId: number, token: string): Promise<boolean> {
  const user = await getUserById(userId);
  
  if (!user || user.verificationToken !== token) {
    return false;
  }

  await db
    .update(users)
    .set({ 
      isVerified: true, 
      verificationToken: null, 
      updatedAt: new Date() 
    })
    .where(eq(users.id, userId));

  return true;
}
