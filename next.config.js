import dotenv from 'dotenv';

/**
 * @type {import('next').NextConfig}
 */

// โหลด environment variables ตามสภาพแวดล้อม
const loadEnvForCurrentEnvironment = () => {
  const { NODE_ENV } = process.env;

  // ใช้การกำหนดค่า env ตามสภาพแวดล้อม
  if (NODE_ENV === 'production') {
    console.warn('📦 Loading production environment config...');
    dotenv.config({ path: '.env.production' });
  } else if (NODE_ENV === 'preview') {
    console.warn('📦 Loading preview environment config...');
    dotenv.config({ path: '.env.preview' });
  } else {
    console.warn('📦 Loading development environment config...');
    dotenv.config({ path: '.env.development' });
  }
};

// โหลด env ก่อนสร้างค่าคอนฟิก
loadEnvForCurrentEnvironment();

// ตั้งค่า Next.js
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // การตั้งค่าเพิ่มเติมตามสภาพแวดล้อม
  env: {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV || 'development',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_AUTH_REDIRECT_URL: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL,
  },
  // ป้องกันการสร้าง 404.html ในสภาพแวดล้อมการผลิต
  output: process.env.NEXT_PUBLIC_ENV === 'production' ? 'standalone' : undefined,
};

export default nextConfig;
