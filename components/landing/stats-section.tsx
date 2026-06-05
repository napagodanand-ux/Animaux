'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { PublicStats } from '@/app/page'

interface StatsSectionProps {
  stats: PublicStats
}

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || value === 0) {
      setCount(value)
      return
    }
    let start = 0
    const increment = value / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, value, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export function StatsSection({ stats }: StatsSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const hasData = stats.total_responses > 0

  const statCards = [
    {
      value: stats.total_responses,
      label: 'Responses Collected',
      suffix: hasData ? '+' : '',
      emoji: '📊',
      empty: 'Be the first!',
    },
    {
      value: stats.avg_rating,
      label: 'Average Experience Rating',
      suffix: hasData ? ' / 5' : '',
      emoji: '⭐',
      empty: 'Awaiting data',
      isDecimal: true,
    },
    {
      value: stats.recommend_pct,
      label: 'Would Recommend Pet Ownership',
      suffix: hasData ? '%' : '',
      emoji: '❤️',
      empty: 'Awaiting data',
    },
    {
      value: stats.strong_bond_pct,
      label: 'Report Strong Emotional Bond',
      suffix: hasData ? '%' : '',
      emoji: '🐾',
      empty: 'Awaiting data',
    },
  ]

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Research at Scale</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every response contributes to a growing body of real pet-owner science.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="card-premium p-6 text-center group cursor-default"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {stat.emoji}
              </div>
              {hasData ? (
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-pink-500 to-purple-600
                  dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  {stat.isDecimal
                    ? stat.value.toFixed(1)
                    : <AnimatedCounter value={stat.value} />
                  }
                  {stat.suffix}
                </div>
              ) : (
                <div className="text-sm font-semibold text-muted-foreground italic">{stat.empty}</div>
              )}
              <div className="text-sm text-muted-foreground mt-2 font-medium leading-snug">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {!hasData && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            📡 Live data — stats update automatically as responses come in.
          </motion.p>
        )}
      </div>
    </section>
  )
}
