import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// โหลด .env ไฟล์เพื่อใช้งาน environment variables
config();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});