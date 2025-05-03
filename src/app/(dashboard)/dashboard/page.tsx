import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import DashboardClient from './dashboard-client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
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
          // This method should not be called in Server Components
          // But in case it is, we'll make it a no-op
        },
        remove(name: string, options: any) {
          // This method should not be called in Server Components
          // But in case it is, we'll make it a no-op
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <DashboardClient user={user} />;
}