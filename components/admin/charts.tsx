'use client'

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { SurveyResponse } from './admin-dashboard'

// ── Vibrant, maximally-distinct palette ─────────────────────
// Each colour at positions 0-3 is as different as possible so
// even charts with just 2-3 slices look colourful.
const PALETTE = [
  '#FF6B6B', // 0  Coral Red
  '#4ECDC4', // 1  Teal
  '#FFD93D', // 2  Sunny Yellow
  '#6BCB77', // 3  Lime Green
  '#4D96FF', // 4  Ocean Blue
  '#FF9F1C', // 5  Amber Orange
  '#C77DFF', // 6  Lavender Purple
  '#F72585', // 7  Hot Magenta
  '#43AA8B', // 8  Emerald
  '#F4A261', // 9  Peach
  '#457B9D', // 10 Steel Blue
  '#E76F51', // 11 Terracotta
]

// ── Helpers ──────────────────────────────────────────────────
function countBy<T>(arr: T[], key: (item: T) => string) {
  const map: Record<string, number> = {}
  arr.forEach(item => {
    const k = key(item) || 'Unknown'
    map[k] = (map[k] || 0) + 1
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))
}

function countMultiSelect(arr: SurveyResponse[], field: keyof SurveyResponse) {
  const map: Record<string, number> = {}
  arr.forEach(item => {
    const vals = item[field] as string[]
    if (Array.isArray(vals)) vals.forEach(v => { map[v] = (map[v] || 0) + 1 })
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))
}

// ── Custom Tooltip ───────────────────────────────────────────
function CustomTooltip({
  active, payload, label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color?: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="card-premium px-3 py-2 text-xs shadow-2xl min-w-[120px]">
      {label && <p className="font-semibold mb-1 text-foreground">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="font-medium" style={{ color: p.color }}>
          {p.name !== 'value' ? `${p.name}: ` : ''}<strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

// ── Chart Card ───────────────────────────────────────────────
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-premium p-5">
      <h3 className="font-bold text-sm mb-4 text-muted-foreground uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  )
}

// ── Reusable Renderers ───────────────────────────────────────
function PieChartView({ data, donut = false }: { data: { name: string; value: number }[]; donut?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" cy="50%"
          innerRadius={donut ? 52 : 0}
          outerRadius={donut ? 82 : 88}
          paddingAngle={3}
          dataKey="value"
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={PALETTE[i % PALETTE.length]}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconSize={10}
          iconType="circle"
          formatter={(value) => (
            <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

function BarChartView({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={52}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={PALETTE[i % PALETTE.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Main Export ──────────────────────────────────────────────
export default function Charts({ data }: { data: SurveyResponse[] }) {
  const petTypeData    = countMultiSelect(data, 'pet_types').slice(0, 9)
  const durationData   = countBy(data, r => r.ownership_duration)
  const emotionalData  = countBy(data, r => r.emotional_connection)
  const hoursData      = countBy(data, r => {
    const h = r.hours_per_day
    if (h <= 1)  return '0–1 h'
    if (h <= 3)  return '1–3 h'
    if (h <= 6)  return '3–6 h'
    if (h <= 10) return '6–10 h'
    return '10 h+'
  })
  const challengeData  = countBy(data, r => r.biggest_challenge)
  const happinessData  = countBy(data, r => r.pet_happiness)
  const ratingData     = [1, 2, 3, 4, 5].map(r => ({
    name: `${r}★`,
    value: data.filter(d => d.experience_rating === r).length,
  }))
  const recommendData  = countBy(data, r => r.would_recommend)
  const ageData        = countBy(data, r => r.age_range)

  return (
    <>
      {/* Row 1 — Pies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard title="🐾 Pet Types">
          <PieChartView data={petTypeData} />
        </ChartCard>
        <ChartCard title="📅 Ownership Duration">
          <PieChartView data={durationData} />
        </ChartCard>
        <ChartCard title="❤️ Emotional Connection">
          <PieChartView data={emotionalData} />
        </ChartCard>
      </div>

      {/* Row 2 — Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="⏱️ Daily Time With Pets">
          <BarChartView data={hoursData} />
        </ChartCard>
        <ChartCard title="🧩 Biggest Challenges">
          <BarChartView data={challengeData} />
        </ChartCard>
      </div>

      {/* Row 3 — Mixed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard title="😊 Pet Happiness">
          <PieChartView data={happinessData} />
        </ChartCard>
        <ChartCard title="⭐ Experience Rating">
          <PieChartView data={ratingData} donut />
        </ChartCard>
        <ChartCard title="🙌 Would Recommend?">
          <PieChartView data={recommendData} />
        </ChartCard>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ChartCard title="🎂 Age Distribution">
          <PieChartView data={ageData} />
        </ChartCard>
        <ChartCard title="📊 Rating Breakdown">
          <BarChartView data={ratingData} />
        </ChartCard>
      </div>
    </>
  )
}
