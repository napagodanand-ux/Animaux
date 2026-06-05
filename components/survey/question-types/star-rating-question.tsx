'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface StarRatingQuestionProps {
  value: number | undefined
  onChange: (value: number) => void
}

const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent']

export function StarRatingQuestion({ value, onChange }: StarRatingQuestionProps) {
  const [hovered, setHovered] = useState(0)

  const display = hovered || value || 0

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3" role="group" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map(star => (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full p-1"
            id={`star-${star}`}
          >
            <motion.div
              animate={{
                scale: display >= star ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <Star
                className={`w-12 h-12 transition-colors duration-150 ${
                  display >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-muted text-muted-foreground/30'
                }`}
              />
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Label */}
      <motion.div
        key={display}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-8"
      >
        {display > 0 && (
          <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600
            dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            {labels[display]}
          </span>
        )}
        {display === 0 && (
          <span className="text-muted-foreground text-sm">Click a star to rate</span>
        )}
      </motion.div>
    </div>
  )
}
