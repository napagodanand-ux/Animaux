'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { PawPrint, Users, Star, TrendingUp, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// ── Lazy-load Recharts (fixes SSR script-tag warning) ────────
const Charts = dynamic(() => import('./charts'), { ssr: false })

// ── Types ────────────────────────────────────────────────────
export interface SurveyResponse {
  id: string
  pet_types: string[]
  pet_count: number
  ownership_duration: string
  hours_per_day: number
  play_frequency: string
  talk_frequency: string
  emotional_connection: string
  mood_improvement: string
  pet_happiness: string
  biggest_challenge: string
  enjoy_most: string
  experience_rating: number
  would_recommend: string
  age_range: string
  submitted_at: string
}

// ── Helpers ──────────────────────────────────────────────────
function avgRating(arr: SurveyResponse[]) {
  if (!arr.length) return '—'
  return (arr.reduce((s, r) => s + (r.experience_rating || 0), 0) / arr.length).toFixed(1)
}

function countMultiSelect(arr: SurveyResponse[], field: keyof SurveyResponse) {
  const map: Record<string, number> = {}
  arr.forEach(item => {
    const vals = item[field] as string[]
    if (Array.isArray(vals)) vals.forEach(v => { map[v] = (map[v] || 0) + 1 })
  })
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }))
}


// ── Stat Card ────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="card-premium p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-[18px] h-[18px] text-white" />
        </div>
      </div>
      <p className="text-3xl font-black">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </motion.div>
  )
}

// ── Main Dashboard ───────────────────────────────────────────
export function AdminDashboard({ initialData }: { initialData: SurveyResponse[] }) {
  const [data, setData] = useState<SurveyResponse[]>(initialData)
  // ✅ Fix: only render time on client to avoid hydration mismatch
  const [updatedTime, setUpdatedTime] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Set initial time on client only
  useEffect(() => {
    setUpdatedTime(new Date().toLocaleTimeString())
  }, [])

  // (Dark mode detection removed — charts now use a fixed vibrant palette)

  // Realtime subscription + fresh fetch on connect
  useEffect(() => {
    // Re-fetch all data fresh from the API (catches any gap between SSR and subscription)
    const refetch = async () => {
      const res = await fetch('/api/admin/responses')
      if (res.ok) {
        const json = await res.json()
        if (Array.isArray(json.data)) {
          setData(json.data)
          setUpdatedTime(new Date().toLocaleTimeString())
        }
      }
    }
    refetch()

    const channel = supabase
      .channel('survey_responses_admin')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'survey_responses' },
        (payload) => {
          setData(prev => [payload.new as SurveyResponse, ...prev])
          setUpdatedTime(new Date().toLocaleTimeString())
          toast.success('New response received! 📊')
        })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Extra refetch once realtime is confirmed live
          refetch()
        }
      })
    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const total = data.length
  const avgRat = avgRating(data)
  const topPet = countMultiSelect(data, 'pet_types')[0]?.name ?? '—'
  const recommendYes = data.filter(r => r.would_recommend === 'Yes').length
  const recommendPct = total ? Math.round((recommendYes / total) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-page">
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-purple-600
              dark:from-purple-500 dark:to-pink-400 flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-black text-base leading-none">Animaux Admin</h1>
              <p className="text-xs text-muted-foreground">Analytics Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* ✅ Only render time client-side */}
            {updatedTime && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live · Updated {updatedTime}
              </div>
            )}
            <ThemeSwitcher />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
                px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              id="admin-signout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Responses" value={total} sub="All time"
            color="bg-gradient-to-br from-pink-400 to-pink-600" />
          <StatCard icon={Star} label="Avg. Rating" value={total ? `${avgRat} / 5` : '—'}
            sub="Experience score" color="bg-gradient-to-br from-yellow-400 to-orange-500" />
          <StatCard icon={PawPrint} label="Top Pet" value={topPet}
            sub="Most common" color="bg-gradient-to-br from-purple-400 to-purple-600" />
          <StatCard icon={TrendingUp} label="Would Recommend" value={total ? `${recommendPct}%` : '—'}
            sub={total ? `${recommendYes} of ${total}` : 'No data yet'}
            color="bg-gradient-to-br from-emerald-400 to-teal-600" />
        </div>

        {total === 0 ? (
          <div className="card-premium p-16 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-bold mb-2">No responses yet</h2>
            <p className="text-muted-foreground">
              Analytics will appear here once users complete the survey.
            </p>
          </div>
        ) : (
          // ✅ Recharts loaded client-only — no SSR script-tag warning
          <Charts data={data} />
        )}

        <p className="text-center text-xs text-muted-foreground pb-8">
          All data is anonymized and aggregated. No individual user information is displayed.
        </p>
      </div>
    </div>
  )
}
