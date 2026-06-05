import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WelcomeClient } from './welcome-client'

export default async function WelcomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check if already submitted
  const { data: profile } = await supabase
    .from('profiles')
    .select('survey_submitted')
    .eq('id', user.id)
    .single()

  if (profile?.survey_submitted) {
    redirect('/survey/thankyou')
  }

  return <WelcomeClient userEmail={user.email!} />
}
