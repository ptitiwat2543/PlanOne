import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import 'dotenv/config';

// ดึงค่า connection string จาก environment variable
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// ปิดการใช้งาน prefetch เนื่องจาก Transaction pool mode ของ Supabase ไม่รองรับ
// ตามคำแนะนำจากเอกสาร Drizzle ORM และ Supabase
export const client = postgres(connectionString, { prepare: false });

// สร้าง Drizzle instance พร้อมกับ schema
export const db = drizzle(client, { schema });
