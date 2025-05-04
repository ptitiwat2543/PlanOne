import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client-server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const type = searchParams.get('type');

  // ประมวลผล token hash สำหรับการยืนยันอีเมล
  const token_hash = searchParams.get('token_hash');
  const email = searchParams.get('email');

  if (code) {
    const supabase = await createClient();

    // ตรวจสอบเพื่อทำการแลกเปลี่ยน code เป็น session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // ถ้ามีการระบุหน้าที่ต้องการไปต่อให้ redirect ไปที่นั่น
      return NextResponse.redirect(`${origin}${next}`);
    }
  } else if (token_hash && email && type === 'email') {
    // กรณีเป็นการยืนยันอีเมลผ่าน token_hash
    const supabase = await createClient();

    // ทำการยืนยันอีเมล
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: token_hash,
      type: 'email',
    });

    if (!error) {
      // การยืนยันอีเมลสำเร็จ ให้ไปที่หน้า success
      return NextResponse.redirect(`${origin}/auth/verification-success`);
    }
  }

  // ถ้าไม่สำเร็จให้กลับไปหน้า error
  return NextResponse.redirect(`${origin}/auth/auth-error`);
}
