import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  // เรียก cookies() แบบ asynchronous ใน Next.js 15+
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return await cookieStore.getAll();
        },
        async setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              await cookieStore.set({ name, value, ...options });
            }
          } catch {
            // การเรียก setAll จาก Server Component อาจถูกละเว้นได้
            // ถ้ามี middleware ที่ refresh user sessions
          }
        },
      },
    }
  );
};