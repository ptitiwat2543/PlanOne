import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const type = searchParams.get('type');
  
  // ประมวลผล token hash สำหรับการยืนยันอีเมล
  const token_hash = searchParams.get('token_hash');
  const email = searchParams.get('email');

  if (code) {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: any) {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );

    // ตรวจสอบเพื่อทำการแลกเปลี่ยน code เป็น session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // ถ้ามีการระบุหน้าที่ต้องการไปต่อให้ redirect ไปที่นั่น
      return NextResponse.redirect(`${origin}${next}`);
    }
  } else if (token_hash && email && type === 'email') {
    // กรณีเป็นการยืนยันอีเมลผ่าน token_hash
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: any) {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );

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