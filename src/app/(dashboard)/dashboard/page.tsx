import { createClient } from '@/lib/supabase/client-server';
import DashboardClient from './dashboard-client';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <DashboardClient user={user} />;
}
