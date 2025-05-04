'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Info, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { signUpWithEmail, checkEmailExists, resendVerificationEmail } from '@/lib/supabase/auth';
import { motion } from 'framer-motion';
import { AuthCard } from '@/components/auth/auth-card';
import { Input } from '@/components/auth/input';
import { Button } from '@/components/auth/button';
import Link from 'next/link';
import { debounce } from 'lodash';
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
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  
  // สำหรับการส่งอีเมลยืนยันอีกครั้ง
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const resendTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues
  } = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange', // เพิ่ม validate ระหว่างการพิมพ์
  });

  // ตรวจสอบอีเมลซ้ำเมื่อกรอกอีเมลเสร็จแล้ว
  const debouncedCheckEmail = useRef(
    debounce(async (email: string) => {
      try {
        if (!email || !email.includes('@') || errors.email) {
          setEmailExists(null);
          return;
        }
        
        setIsCheckingEmail(true);
        const exists = await checkEmailExists(email);
        setEmailExists(exists);
      } catch (error) {
        console.error('Error checking email:', error);
        setEmailExists(null);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 500)
  ).current;

  // อัพเดทความแข็งแกร่งของรหัสผ่านเมื่อรหัสผ่านเปลี่ยน
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'password' || name === undefined) {
        const newPassword = value.password as string || '';
        setPassword(newPassword);
        setPasswordStrength(calculatePasswordStrength(newPassword));
      }

      if (name === 'email' || name === undefined) {
        const email = value.email as string || '';
        debouncedCheckEmail(email);
      }
    });
    
    return () => {
      subscription.unsubscribe();
      debouncedCheckEmail.cancel();
      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
      }
    };
  }, [watch, debouncedCheckEmail]);

  // ส่งอีเมลยืนยันอีกครั้ง
  const handleResendEmail = async () => {
    try {
      setResendLoading(true);
      setResendError(null);
      
      await resendVerificationEmail(registeredEmail);
      
      setResendSuccess(true);
      // ตั้ง countdown เพื่อป้องกันการส่งซ้ำบ่อยเกินไป
      setResendCountdown(60);
      
      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
      }
      
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
      
    } catch (error: any) {
      console.error('Resend verification email error:', error);
      setResendError(error.message || 'ไม่สามารถส่งอีเมลยืนยันได้ กรุณาลองอีกครั้งในภายหลัง');
    } finally {
      setResendLoading(false);
    }
  };

  const onSubmit = async (values: SignUpValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // ตรวจสอบอีเมลซ้ำอีกครั้งก่อนสมัคร
      const exists = await checkEmailExists(values.email);
      if (exists) {
        setError('อีเมลนี้มีการใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่น');
        return;
      }
      
      const { user } = await signUpWithEmail({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      
      // เก็บอีเมลไว้สำหรับการส่งอีเมลยืนยันอีกครั้ง
      setRegisteredEmail(values.email);
      
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
        <Link href="/signin" className="text-blue-700 font-medium hover:text-blue-800">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );

  if (success) {
    return (
      <AuthCard title="สมัครสมาชิกสำเร็จ">
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

          <motion.h3
            className="text-xl font-bold mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            กรุณายืนยันอีเมลเพื่อเริ่มใช้งาน
          </motion.h3>

          <motion.p 
            className="text-gray-600 mb-6 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            เราได้ส่งอีเมลยืนยันไปที่ <strong>{registeredEmail}</strong> โปรดตรวจสอบกล่องจดหมายของคุณและคลิกที่ลิงก์ยืนยันเพื่อเริ่มใช้งาน
          </motion.p>
          
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Info size={18} className="mr-2" /> สิ่งที่ควรทราบ
            </h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• ลิงก์ยืนยันจะมีอายุ 24 ชั่วโมง</li>
              <li>• หากไม่พบอีเมล โปรดตรวจสอบในโฟลเดอร์จดหมายขยะ</li>
              <li>• คุณไม่สามารถเข้าสู่ระบบได้จนกว่าจะยืนยันอีเมล</li>
            </ul>
          </motion.div>

          {/* ปุ่มส่งอีเมลยืนยันอีกครั้ง */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {resendSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-green-700 flex items-start">
                <CheckCircle2 size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">ส่งอีเมลยืนยันอีกครั้งเรียบร้อยแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ</p>
              </div>
            )}
            
            {resendError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 flex items-start">
                <XCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
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
          </motion.div>

          <Button 
            onClick={() => router.push('/signin')}
            className="w-full text-lg"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
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
        <div className="relative">
          <Input
            label="อีเมล"
            type="email"
            placeholder="name@company.com"
            icon={<Mail size={18} />}
            error={errors.email?.message}
            {...register('email')}
          />
          
          {/* แสดงสถานะการตรวจสอบอีเมล */}
          {getValues('email') && !errors.email && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400" style={{ top: 'calc(50% - 9px)' }}>
              {isCheckingEmail ? (
                <Loader2 size={18} className="text-blue-500 animate-spin" />
              ) : emailExists === true ? (
                <div className="flex items-center text-red-500">
                  <XCircle size={18} className="mr-1" />
                  <span className="text-xs">มีอีเมลนี้ในระบบแล้ว</span>
                </div>
              ) : emailExists === false ? (
                <CheckCircle2 size={18} className="text-green-500" />
              ) : null}
            </div>
          )}
        </div>
        
        <Input
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
        
        <Input
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
        
        <div className="flex items-center text-blue-700 text-xs my-1">
          <Info size={12} className="mr-1.5" />
          <span>เพื่อความปลอดภัย กรุณาพิมพ์รหัสผ่านยืนยันด้วยตนเอง</span>
        </div>
        
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full py-3 mt-4"
          disabled={isLoading || emailExists === true}
        >
          สมัครสมาชิกทันที
        </Button>
      </form>
    </AuthCard>
  );
}