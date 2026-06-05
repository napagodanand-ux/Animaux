'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Lock, FlaskConical, Globe, ShieldCheck } from 'lucide-react'
import type { PublicStats } from '@/app/page'

interface TrustSectionProps {
  stats: PublicStats
}

const trustItems = [
  { icon: Lock, label: 'Data Encrypted', desc: 'End-to-end secure storage' },
  { icon: ShieldCheck, label: 'No Personal Data Shared', desc: 'Fully anonymized analytics' },
  { icon: FlaskConical, label: 'Evidence-Based', desc: 'Science-first methodology' },
  { icon: Globe, label: 'Open Research', desc: 'Results benefit everyone' },
]

export function TrustSection({ stats }: TrustSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const hasData = stats.total_responses > 0

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-20"
        >
          {trustItems.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl glass"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20
                  dark:from-purple-500/30 dark:to-pink-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-pink-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Real aggregate insights — only shown when there's real data */}
        {hasData && (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-bold text-center mb-10"
            >
              What the Data Shows
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  emoji: '❤️',
                  headline: `${stats.strong_bond_pct}% report a strong bond`,
                  body: 'The majority of pet owners describe their emotional connection as "Strong" or "Very Strong."',
                },
                {
                  emoji: '⭐',
                  headline: `${stats.avg_rating.toFixed(1)} / 5 average rating`,
                  body: 'Pet owners consistently rate their overall ownership experience highly across all demographics.',
                },
                {
                  emoji: '🙌',
                  headline: `${stats.recommend_pct}% would recommend it`,
                  body: 'An overwhelming majority of respondents would encourage others to experience pet ownership.',
                },
              ].map((insight, i) => (
                <motion.div
                  key={insight.headline}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="card-premium p-6"
                >
                  <div className="text-4xl mb-4">{insight.emoji}</div>
                  <p className="font-bold text-lg mb-2">{insight.headline}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{insight.body}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Empty state message */}
        {!hasData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-center py-10"
          >
            <p className="text-4xl mb-4">🔬</p>
            <p className="font-semibold text-lg mb-2">Research In Progress</p>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm">
              Aggregate insights from real survey responses will appear here as our dataset grows.
              Be one of the first to contribute!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
