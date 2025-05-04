import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options: _options }) => {
            request.cookies.set({ name, value });
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          });
        },
      },
    }
  );

  try {
    // ตรวจสอบว่ามี session หรือไม่
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // ตรวจสอบการยืนยันอีเมล (ถ้ามี session แล้ว)
    let isEmailVerified = false;
    if (session?.user) {
      isEmailVerified = !!session.user.email_confirmed_at;
    }

    // เส้นทางที่ต้องการให้ล็อกอินก่อน
    const protectedRoutes = ['/dashboard', '/profile', '/settings'];

    // เส้นทางสำหรับผู้ใช้ที่ยังไม่ได้ล็อกอิน
    const authRoutes = ['/signin', '/signup', '/forgot-password'];

    // เส้นทางสำหรับการยืนยันอีเมล
    const verificationRoutes = [
      '/auth/token',
      '/auth/verification-success',
      '/auth/auth-error',
      '/auth/callback',
    ];

    // ดึง pathname จาก URL
    const { pathname } = request.nextUrl;

    // ตรวจสอบว่าเป็นหน้าที่ต้องล็อกอินหรือไม่
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    // ตรวจสอบว่าเป็นหน้า auth หรือไม่
    const isAuthRoute = authRoutes.some((route) => pathname === route);

    // ตรวจสอบว่าเป็นหน้าสำหรับการยืนยันอีเมลหรือไม่
    const isVerificationRoute = verificationRoutes.some((route) => pathname.startsWith(route));

    // ถ้าเป็นหน้าที่ต้องล็อกอินและไม่มี session ให้ redirect ไปหน้า signin
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL('/signin', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // ถ้าเป็นหน้าที่ต้องล็อกอินและมี session แล้ว แต่ยังไม่ได้ยืนยันอีเมล
    if (isProtectedRoute && session && !isEmailVerified) {
      // สร้างหน้าแจ้งเตือนให้ยืนยันอีเมล
      const redirectUrl = new URL('/auth/verification-required', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // ถ้าเป็นหน้า auth และมี session แล้ว ให้ redirect ไปหน้า dashboard
    if (isAuthRoute && session) {
      // หากมี session แต่ยังไม่ยืนยันอีเมล ให้ไปหน้าแจ้งเตือนยืนยันอีเมล
      if (!isEmailVerified) {
        const redirectUrl = new URL('/auth/verification-required', request.url);
        return NextResponse.redirect(redirectUrl);
      } else {
        // ถ้ายืนยันแล้วให้ไปหน้า dashboard
        const redirectUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // อนุญาตให้เข้าถึงหน้าตรวจสอบการยืนยันอีเมลได้เสมอ
    if (isVerificationRoute) {
      return response;
    }
  } catch (error) {
    console.error('Middleware error:', error);
  }

  return response;
}

// กำหนดให้ middleware ทำงานกับทุก route ยกเว้นไฟล์ static และ API
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
