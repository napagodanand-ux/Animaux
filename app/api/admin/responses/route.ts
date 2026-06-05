import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!

export async function GET() {
  // 1. Auth check — must be the admin
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Fetch all responses using the admin (service role) client — bypasses RLS
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('survey_responses')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) {
    console.error('[/api/admin/responses]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count: data?.length ?? 0 })
}
