import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เกิดข้อผิดพลาดในการยืนยันตัวตน | Plan One',
  description: 'เกิดข้อผิดพลาดในการยืนยันตัวตนกับ Plan One',
};

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mb-2">
          <span>P1</span>
        </div>
        <h1 className="text-blue-500 text-2xl font-bold">Plan One</h1>
      </div>
      
      <div className="w-full max-w-md rounded-xl bg-white shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาดในการยืนยันตัวตน</h2>
        <p className="text-gray-600 mb-6">
          ขออภัย เกิดข้อผิดพลาดในการยืนยันตัวตนของคุณ โปรดลองใหม่อีกครั้ง
        </p>
        <div className="flex justify-center">
          <Link
            href="/signin"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </main>
  );
}
