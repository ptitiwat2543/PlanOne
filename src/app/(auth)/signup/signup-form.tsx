'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Info, AlertCircle } from 'lucide-react';
import { signUpWithEmail } from '@/lib/supabase/auth';
import { motion } from 'framer-motion';
import { CleanAuthCard } from '@/components/auth/clean-auth-card';
import { CleanInput } from '@/components/auth/clean-input';
import { CleanButton } from '@/components/auth/clean-button';
import Link from 'next/link';
import GoogleIcon from '@/components/icons/google';

const SignUpSchema = z.object({
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
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

type SignUpValues = z.infer<typeof SignUpSchema>;

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
    case 0: return 'bg-gray-200'; // ไม่มีรหัสผ่าน
    case 1: return 'bg-red-500';  // ต่ำมาก
    case 2: return 'bg-orange-500'; // ต่ำ
    case 3: return 'bg-yellow-500'; // ปานกลาง
    case 4: return 'bg-lime-500';  // สูง
    case 5: return 'bg-green-500'; // สูงมาก
    default: return 'bg-gray-200';
  }
};

const getStrengthLabel = (strength: number): string => {
  switch (strength) {
    case 0: return '';
    case 1: return 'รหัสผ่านอ่อนแอมาก';
    case 2: return 'รหัสผ่านอ่อนแอ';
    case 3: return 'รหัสผ่านปานกลาง';
    case 4: return 'รหัสผ่านแข็งแรง';
    case 5: return 'รหัสผ่านแข็งแรงมาก';
    default: return '';
  }
};

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // อัพเดทความแข็งแกร่งของรหัสผ่านเมื่อรหัสผ่านเปลี่ยน
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'password' || name === undefined) {
        const newPassword = value.password as string || '';
        setPassword(newPassword);
        setPasswordStrength(calculatePasswordStrength(newPassword));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (values: SignUpValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { user } = await signUpWithEmail({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      
      if (user) {
        setSuccess(true);
      } else {
        // สมัครสมาชิกต้องยืนยันอีเมล
        setSuccess(true);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <div className="text-center">
      <p className="text-sm text-gray-600">
        มีบัญชีอยู่แล้ว?{' '}
        <Link href="/signin" className="text-blue-600 font-medium hover:text-blue-700">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );

  if (success) {
    return (
      <CleanAuthCard title="สมัครสมาชิกสำเร็จ">
        <div className="text-center">
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันการสมัครสมาชิก
          </motion.p>

          <CleanButton 
            onClick={() => router.push('/signin')}
            className="w-full text-lg"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </CleanButton>
        </div>
      </CleanAuthCard>
    );
  }

  return (
    <CleanAuthCard 
      title="สมัครสมาชิก" 
      subtitle="เริ่มใช้งาน Plan One ระบบจัดการการก่อสร้าง"
      footer={footer}
    >
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
        <CleanInput
          label="อีเมล"
          type="email"
          placeholder="name@company.com"
          icon={<Mail size={18} />}
          error={errors.email?.message}
          {...register('email')}
        />
        
        <CleanInput
          label="รหัสผ่าน"
          type="password"
          placeholder="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
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
                initial={{ width: "0%" }}
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
        
        <CleanInput
          label="ยืนยันรหัสผ่าน"
          type="password"
          placeholder="ยืนยันรหัสผ่าน"
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
        
        <div className="flex items-center text-blue-600 text-xs my-1">
          <Info size={12} className="mr-1.5" />
          <span>เพื่อความปลอดภัย กรุณาพิมพ์รหัสผ่านยืนยันด้วยตนเอง</span>
        </div>
        
        <CleanButton
          type="submit"
          isLoading={isLoading}
          className="w-full py-3 mt-4"
        >
          สมัครสมาชิกทันที
        </CleanButton>
        
        <div className="relative mt-6 mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">หรือสมัครด้วย</span>
          </div>
        </div>
        
        <CleanButton
          type="button"
          variant="outline"
          className="w-full"
          icon={<GoogleIcon className="w-4 h-4" />}
        >
          สมัครด้วย Google
        </CleanButton>
      </form>
    </CleanAuthCard>
  );
}