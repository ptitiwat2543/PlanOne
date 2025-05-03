# Plan One

ระบบบริหารจัดการธุรกิจภายในครอบครัวสำหรับงานจำหน่ายและส่ง หิน ดิน ทราย

## Features

- จัดการข้อมูลลูกค้า (Customers)
- จัดการข้อมูลท่าทราย/ซัพพลายเออร์ (Suppliers)
- จัดการข้อมูลวัสดุ (Materials)
- จัดการข้อมูลไซต์งาน (Sites)
- จัดการข้อมูลการส่งสินค้า (Delivery Orders)
- จัดการข้อมูลพนักงานและรถบรรทุก
- รายงานและแดชบอร์ด

## Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, React Hook Form + Zod
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Hosting**: Vercel (Frontend), Supabase Cloud (Backend)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/plan-one.git
cd plan-one
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with your Supabase credentials:
```bash
cp .env.local.example .env.local
# Edit the file with your credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Guidelines

- Follow the Git workflow and branch naming conventions as outlined in the documentation
- Use TypeScript for type safety
- Use React Hook Form + Zod for form validation
- Follow the coding standards outlined in the documentation
