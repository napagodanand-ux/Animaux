import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SurveyWizard } from '@/components/survey/survey-wizard'

export default async function QuestionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('survey_submitted')
    .eq('id', user.id)
    .single()

  if (profile?.survey_submitted) redirect('/survey/thankyou')

  return <SurveyWizard />
}
