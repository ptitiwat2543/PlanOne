import { Metadata } from 'next';
import ForgotPasswordForm from './forgot-password-form';

export const metadata: Metadata = {
  title: 'ลืมรหัสผ่าน | Plan One',
  description: 'รีเซ็ตรหัสผ่าน Plan One ระบบจัดการการก่อสร้าง',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
