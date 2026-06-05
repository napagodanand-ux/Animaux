import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/shared/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { StatsSection } from '@/components/landing/stats-section'
import { BenefitsSection } from '@/components/landing/benefits-section'
import { TrustSection } from '@/components/landing/trust-section'
import { CtaSection } from '@/components/landing/cta-section'

export interface PublicStats {
  total_responses: number
  avg_rating: number
  recommend_pct: number
  strong_bond_pct: number
}

async function getPublicStats(): Promise<PublicStats> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_public_stats')
    if (error || !data) throw error
    return data as PublicStats
  } catch {
    // Return zeros if DB not yet seeded / function not yet applied
    return { total_responses: 0, avg_rating: 0, recommend_pct: 0, strong_bond_pct: 0 }
  }
}

export default async function HomePage() {
  const stats = await getPublicStats()

  return (
    <main className="min-h-screen bg-gradient-page overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <StatsSection stats={stats} />
      <BenefitsSection />
      <TrustSection stats={stats} />
      <CtaSection totalResponses={stats.total_responses} />
    </main>
  )
}
