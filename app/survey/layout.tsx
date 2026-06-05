import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SurveyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gradient-page">
      {children}
    </div>
  )
}
