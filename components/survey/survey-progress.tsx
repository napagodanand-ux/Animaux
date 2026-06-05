'use client'

import { motion } from 'framer-motion'

interface SurveyProgressProps {
  current: number
  total: number
}

export function SurveyProgress({ current, total }: SurveyProgressProps) {
  const pct = (current / total) * 100

  return (
    <div className="px-4 sm:px-8 pb-2">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            {current} / {total}
          </span>
          <span className="text-xs font-semibold text-pink-500 dark:text-purple-400">
            {Math.round(pct)}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600
              dark:from-purple-500 dark:to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}
