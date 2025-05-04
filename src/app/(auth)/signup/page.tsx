import { Metadata } from 'next';
import SignUpForm from './signup-form';

export const metadata: Metadata = {
  title: 'สมัครสมาชิก | Plan One',
  description: 'สมัครสมาชิก Plan One ระบบจัดการการก่อสร้าง',
};

export default function SignUpPage() {
  return <SignUpForm />;
}
