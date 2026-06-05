import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!

export default async function AdminPage() {
  // 1. Verify the logged-in user is admin via the session client
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) redirect('/survey/welcome')

  // 2. Fetch ALL survey responses using the admin client (bypasses RLS)
  const admin = createAdminClient()
  const { data: responses, error } = await admin
    .from('survey_responses')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) {
    console.error('[Admin] survey_responses fetch error:', error.message, error.code)
  }

  console.log(`[Admin] Loaded ${responses?.length ?? 0} responses`)

  return <AdminDashboard initialData={responses ?? []} />
}
