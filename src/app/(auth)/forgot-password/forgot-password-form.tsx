'use client';

import { AuthCard } from '@/components/auth/auth-card';
import { Button } from '@/components/auth/button';
import { Input } from '@/components/auth/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ForgotPasswordSchema = z.object({
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
});

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (_values: ForgotPasswordValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // ส่งอีเมลรีเซ็ตรหัสผ่าน - ระบบจำลอง
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
    } catch (error: unknown) {
      console.error('Forgot password error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="ส่งอีเมลสำเร็จ">
        <div className="text-center">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </motion.div>

          <p className="text-gray-600 mb-8">
            เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ
          </p>

          <Link
            href="/signin"
            className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="ลืมรหัสผ่าน" subtitle="Plan One ระบบจัดการการก่อสร้าง">
      {error && (
        <motion.div
          className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        </motion.div>
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

        <Button type="submit" isLoading={isLoading} className="w-full py-3">
          ส่งอีเมลรีเซ็ตรหัสผ่าน
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/signin"
          className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
        >
          <ArrowLeft size={16} className="mr-1" />
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    </AuthCard>
  );
}
