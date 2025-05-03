'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/supabase/auth';
import { User } from '@supabase/supabase-js';

interface DashboardClientProps {
  user: User | null;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/signin');
      router.refresh(); // เพื่อให้ middleware อัพเดท session
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">แดชบอร์ด</h1>
              <p className="text-gray-600">ยินดีต้อนรับกลับมา {user.email}</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">ออกจากระบบ</Button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">คุณได้เข้าสู่ระบบสำเร็จแล้ว</h2>
          <p>นี่เป็นหน้าแดชบอร์ดเบื้องต้น สามารถปรับแต่งเพิ่มเติมได้ตามต้องการ</p>
        </div>
      </div>
    </main>
  );
}