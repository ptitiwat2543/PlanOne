'use client';

import { AuthCard } from '@/components/auth/auth-card';
import { Button } from '@/components/auth/button';
import { Input } from '@/components/auth/input';
import { signInWithEmail, resendVerificationEmail } from '@/lib/supabase/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, Lock, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SignInSchema = z.object({
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
  remember: z.boolean().optional(),
});

type SignInValues = z.infer<typeof SignInSchema>;

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const resendTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const handleResendEmail = async () => {
    if (!unverifiedEmail || resendLoading || resendCountdown > 0) return;

    try {
      setResendLoading(true);
      setResendError(null);

      await resendVerificationEmail(unverifiedEmail);

      setResendSuccess(true);
      setResendCountdown(60); // นับถอยหลัง 60 วินาที

      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
      }

      // ตั้งการนับถอยหลัง
      resendTimerRef.current = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            if (resendTimerRef.current) {
              clearInterval(resendTimerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: unknown) {
      console.error('Error resending verification email:', error);
      setResendError(
        error instanceof Error ? error.message : 'ไม่สามารถส่งอีเมลยืนยันได้ กรุณาลองใหม่ภายหลัง'
      );
    } finally {
      setResendLoading(false);
    }
  };

  const onSubmit = async (values: SignInValues) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsEmailUnverified(false);

      await signInWithEmail({
        email: values.email,
        password: values.password,
      });

      router.push('/dashboard');
      router.refresh();
    } catch (error: unknown) {
      console.error('Sign in error:', error);

      // ตรวจสอบว่าเป็น error การยืนยันอีเมลหรือไม่
      if (
        error instanceof Error &&
        error.message &&
        (error.message.includes('Email not confirmed') ||
          error.message.includes('กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ'))
      ) {
        setIsEmailUnverified(true);
        setUnverifiedEmail(values.email);
        setError(
          'บัญชีนี้ยังไม่ได้ยืนยันอีเมล กรุณาตรวจสอบอีเมลของคุณและคลิกลิงก์ยืนยัน หรือคลิกปุ่ม "ส่งอีเมลยืนยันอีกครั้ง" ด้านล่าง'
        );
      } else {
        setError(
          error instanceof Error ? error.message : 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <div className="text-center">
      <p className="text-sm text-gray-600">
        ยังไม่มีบัญชี?{' '}
        <Link href="/signup" className="text-blue-700 font-medium hover:text-blue-800">
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  );

  return (
    <AuthCard title="เข้าสู่ระบบ" subtitle="Plan One ระบบจัดการการก่อสร้าง" footer={footer}>
      {error && (
        <motion.div
          className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        </motion.div>
      )}

      {isEmailUnverified && (
        <div className="space-y-3 mb-4">
          {resendSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <p className="text-sm">
                ส่งอีเมลยืนยันอีกครั้งเรียบร้อยแล้ว โปรดตรวจสอบกล่องจดหมายของคุณ
                (รวมถึงโฟลเดอร์สแปม)
              </p>
            </div>
          )}

          {resendError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{resendError}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleResendEmail}
            disabled={resendLoading || resendCountdown > 0}
            className={`w-full py-2.5 px-4 rounded-md border border-blue-300 text-blue-700 flex items-center justify-center transition-colors ${
              resendLoading || resendCountdown > 0
                ? 'opacity-60 cursor-not-allowed bg-gray-50'
                : 'hover:bg-blue-50'
            }`}
          >
            {resendLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                กำลังส่งอีเมลยืนยัน...
              </>
            ) : resendCountdown > 0 ? (
              `ส่งอีเมลอีกครั้งใน ${resendCountdown} วินาที`
            ) : (
              'ส่งอีเมลยืนยันอีกครั้ง'
            )}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="อีเมล"
          type="email"
          placeholder="name@company.com"
          icon={<Mail size={18} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="รหัสผ่าน"
          type="password"
          placeholder="รหัสผ่าน"
          icon={<Lock size={18} />}
          error={errors.password?.message}
          showPasswordToggle
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-700 border-gray-300 rounded focus:ring-blue-700"
              {...register('remember')}
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              จดจำฉัน
            </label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm text-blue-700 hover:text-blue-800 font-medium"
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full py-3 mt-4">
          เข้าสู่ระบบ
        </Button>
      </form>
    </AuthCard>
  );
}
