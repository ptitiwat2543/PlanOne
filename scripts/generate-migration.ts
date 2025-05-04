import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// สร้างโฟลเดอร์ supabase/migrations ถ้ายังไม่มี
const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

// รับชื่อ migration จาก command line arguments
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('❌ Please provide a migration name');
  console.error('Usage: npx tsx scripts/generate-migration.ts <migration-name>');
  process.exit(1);
}

console.log(`🚀 Generating migration for "${migrationName}"...`);

try {
  // รัน drizzle-kit generate command
  execSync('npx drizzle-kit generate', { stdio: 'inherit' });
  console.log('✅ Migration generated successfully!');
} catch (error) {
  console.error('❌ Migration generation failed:', error);
  process.exit(1);
}
