import { Metadata } from 'next';
import ResetPasswordForm from './reset-password-form';

export const metadata: Metadata = {
  title: 'ตั้งรหัสผ่านใหม่ | Plan One',
  description: 'ตั้งรหัสผ่านใหม่สำหรับ Plan One',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}