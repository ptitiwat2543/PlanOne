import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ยืนยันอีเมลสำเร็จ | Plan One',
  description: 'ยืนยันอีเมลเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบได้ทันที',
};

export default function VerificationSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mb-2">
          <span>P1</span>
        </div>
        <h1 className="text-blue-500 text-2xl font-bold">Plan One</h1>
      </div>
      
      <div className="w-full max-w-md rounded-xl bg-white shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ยืนยันอีเมลสำเร็จ!</h2>
        
        <p className="text-gray-600 mb-6">
          ขอบคุณที่ยืนยันอีเมลของคุณ คุณสามารถเข้าสู่ระบบและเริ่มใช้งาน Plan One ได้ทันที
        </p>
        
        <div className="flex justify-center">
          <Link
            href="/signin"
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            เข้าสู่ระบบเพื่อเริ่มต้นใช้งาน
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">มีปัญหาการเข้าสู่ระบบ?</h3>
          <p className="text-gray-600 text-sm mb-4">
            หากคุณมีปัญหาในการเข้าสู่ระบบ คุณสามารถลองวิธีดังต่อไปนี้:
          </p>
          <ul className="text-sm text-gray-600 space-y-2 mb-4 text-left list-disc list-inside">
            <li>ตรวจสอบว่าคุณใช้อีเมลและรหัสผ่านที่ถูกต้อง</li>
            <li>ลองรีเฟรชเบราว์เซอร์ของคุณ</li>
            <li>ลบคุกกี้และแคชของเบราว์เซอร์</li>
            <li>
              <Link href="/forgot-password" className="text-blue-700 hover:underline">
                ลืมรหัสผ่าน?
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}