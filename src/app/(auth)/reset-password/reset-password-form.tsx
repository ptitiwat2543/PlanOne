'use client';

import { AuthCard } from '@/components/auth/auth-card';
import { Button } from '@/components/auth/button';
import { Input } from '@/components/auth/input';
import { supabase } from '@/lib/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, Info, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
      .regex(/[A-Z]/, 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว')
      .regex(/[a-z]/, 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว')
      .regex(/[0-9]/, 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว'),
    confirmPassword: z.string().min(1, 'กรุณายืนยันรหัสผ่าน'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  });

type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;

// ฟังก์ชันคำนวณความแข็งแกร่งของรหัสผ่าน
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;

  // ไม่มีรหัสผ่าน = 0
  if (password.length === 0) return 0;

  // ความยาวมากกว่า 8 = +1
  if (password.length >= 8) strength += 1;

  // ความยาวมากกว่า 12 = +1
  if (password.length >= 12) strength += 1;

  // มีตัวพิมพ์เล็ก = +1
  if (/[a-z]/.test(password)) strength += 1;

  // มีตัวพิมพ์ใหญ่ = +1
  if (/[A-Z]/.test(password)) strength += 1;

  // มีตัวเลข = +1
  if (/[0-9]/.test(password)) strength += 1;

  // มีอักขระพิเศษ = +1
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

  return Math.min(strength, 5); // คะแนนสูงสุด 5
};

const getStrengthColor = (strength: number): string => {
  switch (strength) {
    case 0:
      return 'bg-gray-200'; // ไม่มีรหัสผ่าน
    case 1:
      return 'bg-red-500'; // ต่ำมาก
    case 2:
      return 'bg-orange-500'; // ต่ำ
    case 3:
      return 'bg-yellow-500'; // ปานกลาง
    case 4:
      return 'bg-lime-500'; // สูง
    case 5:
      return 'bg-green-500'; // สูงมาก
    default:
      return 'bg-gray-200';
  }
};

const getStrengthLabel = (strength: number): string => {
  switch (strength) {
    case 0:
      return '';
    case 1:
      return 'รหัสผ่านอ่อนแอมาก';
    case 2:
      return 'รหัสผ่านอ่อนแอ';
    case 3:
      return 'รหัสผ่านปานกลาง';
    case 4:
      return 'รหัสผ่านแข็งแรง';
    case 5:
      return 'รหัสผ่านแข็งแรงมาก';
    default:
      return '';
  }
};

export default function ResetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<{
    id?: string;
    email?: string;
    token?: string;
  } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
      } else {
        setUser(user);
      }
    };

    checkUser();
  }, [router]);

  // อัพเดทความแข็งแกร่งของรหัสผ่านเมื่อรหัสผ่านเปลี่ยน
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'password' || name === undefined) {
        const newPassword = (value.password as string) || '';
        setPassword(newPassword);
        setPasswordStrength(calculatePasswordStrength(newPassword));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (error: Error | unknown) {
      console.error('Reset password error:', error);
      setError(
        error instanceof Error ? error.message : 'ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="เปลี่ยนรหัสผ่านสำเร็จ">
        <div className="text-center">
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
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

          <motion.p
            className="text-gray-600 mb-8 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            รหัสผ่านของคุณได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว
          </motion.p>

          <Button onClick={() => router.push('/dashboard')} className="w-full text-lg">
            ไปยังหน้าแดชบอร์ด
          </Button>
        </div>
      </AuthCard>
    );
  }

  if (!user) {
    return (
      <AuthCard title="ตั้งรหัสผ่านใหม่">
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="ตั้งรหัสผ่านใหม่" subtitle="กรุณากำหนดรหัสผ่านใหม่ของคุณ">
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
          label="รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)"
          type="password"
          placeholder="รหัสผ่านใหม่"
          icon={<Lock size={18} />}
          error={errors.password?.message}
          showPasswordToggle
          {...register('password')}
        />

        {/* แถบวัดความแข็งแกร่งของรหัสผ่าน */}
        {password && (
          <div className="mb-2">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${getStrengthColor(passwordStrength)}`}
                initial={{ width: '0%' }}
                animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {getStrengthLabel(passwordStrength) && (
              <p className="mt-1 text-xs font-medium text-gray-600">
                {getStrengthLabel(passwordStrength)}
              </p>
            )}
          </div>
        )}

        <Input
          label="ยืนยันรหัสผ่านใหม่"
          type="password"
          placeholder="ยืนยันรหัสผ่านใหม่"
          icon={<Lock size={18} />}
          error={errors.confirmPassword?.message}
          showPasswordToggle
          onPaste={(e) => {
            e.preventDefault();
            return false;
          }}
          onDrop={(e) => {
            e.preventDefault();
            return false;
          }}
          className="prevent-paste"
          {...register('confirmPassword')}
        />

        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md text-sm text-blue-800 mt-3">
          <Info size={16} />
          <p>เพื่อความปลอดภัย กรุณาตั้งรหัสผ่านที่มีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข</p>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full py-3 mt-6">
          ตั้งรหัสผ่านใหม่
        </Button>
      </form>
    </AuthCard>
  );
}
