'use client';

import { CleanAuthCard } from '@/components/auth/clean-auth-card';
import { CleanButton } from '@/components/auth/clean-button';
import { CleanInput } from '@/components/auth/clean-input';
import GoogleIcon from '@/components/icons/google';
import { signInWithEmail } from '@/lib/supabase/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

  const onSubmit = async (values: SignInValues) => {
    try {
      setIsLoading(true);
      setError(null);

      await signInWithEmail({
        email: values.email,
        password: values.password,
      });

      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(
        error.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <div className='text-center'>
      <p className='text-sm text-gray-600'>
        ยังไม่มีบัญชี?{' '}
        <Link
          href='/signup'
          className='text-blue-700 font-medium hover:text-blue-800'
        >
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  );

  return (
    <CleanAuthCard
      title='เข้าสู่ระบบ'
      subtitle='Plan One ระบบจัดการการก่อสร้าง'
      footer={footer}
    >
      {error && (
        <motion.div
          className='mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className='flex items-center'>
            <AlertCircle className='h-5 w-5 mr-2 flex-shrink-0' />
            <span className='text-sm'>{error}</span>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <CleanInput
          label='อีเมล'
          type='email'
          placeholder='name@company.com'
          icon={<Mail size={18} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <CleanInput
          label='รหัสผ่าน'
          type='password'
          placeholder='รหัสผ่าน'
          icon={<Lock size={18} />}
          error={errors.password?.message}
          showPasswordToggle
          {...register('password')}
        />

        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <input
              id='remember'
              type='checkbox'
              className='h-4 w-4 text-blue-700 border-gray-300 rounded focus:ring-blue-700'
              {...register('remember')}
            />
            <label
              htmlFor='remember'
              className='ml-2 block text-sm text-gray-700'
            >
              จดจำฉัน
            </label>
          </div>

          <Link
            href='/forgot-password'
            className='text-sm text-blue-700 hover:text-blue-800 font-medium'
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>

        <CleanButton
          type='submit'
          isLoading={isLoading}
          className='w-full py-3 mt-4'
        >
          เข้าสู่ระบบ
        </CleanButton>

        <div className='relative mt-6 mb-4'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-200'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500'>
              หรือเข้าสู่ระบบด้วย
            </span>
          </div>
        </div>

        <CleanButton
          type='button'
          variant='outline'
          className='w-full'
          icon={<GoogleIcon className='w-4 h-4' />}
        >
          เข้าสู่ระบบด้วย Google
        </CleanButton>
      </form>
    </CleanAuthCard>
  );
}
