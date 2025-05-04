'use client';

import { useState, useEffect, useRef } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { getUser, resendVerificationEmail, signOut } from '@/lib/supabase/auth';
import { CleanButton } from '@/components/auth/clean-button';

export default function VerificationRequiredPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getUser();
        if (user?.email) {
          setEmail(user.email);
        } else {
          // ถ้าไม่มีข้อมูลผู้ใช้ให้กลับไปหน้า login
          router.push('/signin');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [router]);

  const handleResendEmail = async () => {
    if (!email || resendLoading || countdown > 0) return;

    try {
      setResendLoading(true);
      setResendError(null);
      
      await resendVerificationEmail(email);
      
      setResendSuccess(true);
      setCountdown(60); // นับถอยหลัง 60 วินาที
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // ตั้งการนับถอยหลัง
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      setResendError(error.message || 'ไม่สามารถส่งอีเมลยืนยันได้ กรุณาลองใหม่ภายหลัง');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
        <div className="flex flex-col items-center">
          <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
          <p className="text-gray-700">กำลังโหลด...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mb-2">
          <span>P1</span>
        </div>
        <h1 className="text-blue-500 text-2xl font-bold">Plan One</h1>
      </div>
      
      <div className="w-full max-w-md rounded-xl bg-white shadow-md p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
            <Mail size={32} />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
          กรุณายืนยันอีเมลของคุณ
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          เราได้ส่งลิงก์ยืนยันไปที่ <strong>{email}</strong> โปรดตรวจสอบกล่องจดหมายของคุณและคลิกที่ลิงก์เพื่อยืนยันอีเมล
        </p>
        
        {resendSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-green-700 flex items-start">
            <CheckCircle2 size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">ส่งอีเมลยืนยันอีกครั้งเรียบร้อยแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ</p>
          </div>
        )}
        
        {resendError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 flex items-start">
            <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{resendError}</p>
          </div>
        )}
        
        <div className="flex flex-col space-y-3 mb-6">
          <CleanButton
            onClick={handleResendEmail}
            disabled={resendLoading || countdown > 0}
            className={`${
              resendLoading || countdown > 0 ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {resendLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                กำลังส่งอีเมลยืนยัน...
              </>
            ) : countdown > 0 ? (
              `ส่งอีเมลอีกครั้งใน ${countdown} วินาที`
            ) : (
              'ส่งอีเมลยืนยันอีกครั้ง'
            )}
          </CleanButton>
          
          <div className="text-center relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">หรือ</span>
            </div>
          </div>
          
          <CleanButton
            onClick={handleSignOut}
            variant="outline"
          >
            ออกจากระบบ
          </CleanButton>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center text-sm">
            ไม่พบอีเมลยืนยัน?
          </h3>
          <ul className="text-xs text-blue-700 space-y-1.5">
            <li>• ตรวจสอบโฟลเดอร์จดหมายขยะหรือสแปม</li>
            <li>• ตรวจสอบว่าพิมพ์อีเมลถูกต้อง</li>
            <li>• ลิงก์ยืนยันมีอายุ 24 ชั่วโมง</li>
            <li>• หากทุกอย่างไม่สำเร็จ ให้ลองสมัครใหม่ด้วยอีเมลอื่น</li>
          </ul>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-700 hover:text-blue-800 inline-flex items-center text-sm">
            <ArrowLeft size={16} className="mr-1" />
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    </main>
  );
}