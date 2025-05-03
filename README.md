# Plan One - ระบบจัดการธุรกิจภายในครอบครัว

Plan One เป็นระบบจัดการธุรกิจภายในครอบครัวสำหรับงานจำหน่ายและส่ง หิน ดิน ทราย

## คุณสมบัติหลัก

- 🔐 **ระบบยืนยันตัวตน**
  - เข้าสู่ระบบด้วยอีเมล
  - สมัครสมาชิกด้วยอีเมล
  - รีเซ็ตรหัสผ่าน

## การติดตั้ง

1. คัดลอกไฟล์ `.env.local.example` เป็น `.env.local`

```bash
cp .env.local.example .env.local
```

2. แก้ไขไฟล์ `.env.local` และกำหนดค่า Supabase URL และ Anon Key

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback
```

3. ติดตั้ง dependencies

```bash
npm install
```

4. รันโปรเจ็ค

```bash
npm run dev
```

## โครงสร้างโปรเจ็ค

โปรเจ็คนี้ใช้ Next.js 15 และ Supabase สำหรับการจัดการฐานข้อมูลและการยืนยันตัวตน

### โครงสร้างไฟล์

- `/src/app` - หน้าต่างๆ ของแอปพลิเคชัน
  - `/(auth)` - หน้าเกี่ยวกับการยืนยันตัวตน (เข้าสู่ระบบ, สมัครสมาชิก, ลืมรหัสผ่าน)
  - `/(dashboard)` - หน้าสำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
- `/src/components` - React Components
  - `/ui` - UI Components
- `/src/lib` - Utilities และ Libraries
  - `/supabase` - Supabase client และ authentication

## การตั้งค่า Supabase

1. สร้างโปรเจ็คใหม่ใน [Supabase](https://supabase.io)
2. ในหน้า "Authentication" เปิดใช้งาน "Email Sign-In"
3. คัดลอก URL และ Anon Key จากหน้า "Settings > API" และใส่ในไฟล์ `.env.local`

## เทคโนโลยีที่ใช้

- **Next.js 15** - React Framework
- **Supabase** - ฐานข้อมูลและ Authentication
- **Tailwind CSS** - CSS Framework
- **React Hook Form** - จัดการฟอร์ม
- **Zod** - ตรวจสอบข้อมูล
- **Noto Sans Thai** - ฟอนต์ภาษาไทย
