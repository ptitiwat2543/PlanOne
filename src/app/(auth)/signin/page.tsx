import { Metadata } from 'next';
import SignInForm from './signin-form';

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ | Plan One',
  description: 'เข้าสู่ระบบ Plan One ระบบจัดการการก่อสร้าง',
};

export default function SignInPage() {
  return <SignInForm />;
}
