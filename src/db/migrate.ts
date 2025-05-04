import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// สำหรับการรันเฉพาะการอัปเดตฐานข้อมูล
async function main() {
  // ตรวจสอบว่ามีการกำหนดค่า DATABASE_URL หรือไม่
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.warn('🚀 Starting database migration...');

  try {
    const connectionString = process.env.DATABASE_URL;

    // สร้าง Postgres client สำหรับการ migrate
    // ปิดการใช้งาน prefetch เนื่องจาก Transaction pool mode ของ Supabase ไม่รองรับ
    const client = postgres(connectionString, { prepare: false });

    // สร้าง Drizzle instance
    const db = drizzle(client);

    // ทำการ migrate โดยใช้ไฟล์ที่อยู่ใน supabase/migrations
    await migrate(db, { migrationsFolder: 'supabase/migrations' });

    console.warn('✅ Database migration completed successfully!');

    // ปิดการเชื่อมต่อ
    await client.end();

    process.exit(0);
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

// รันการ migrate
main();
