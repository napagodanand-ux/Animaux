'use client'

import { motion } from 'framer-motion'

interface ScaleQuestionProps {
  options: string[]
  value: string | undefined
  onChange: (value: string) => void
}

export function ScaleQuestion({ options, value, onChange }: ScaleQuestionProps) {
  return (
    <div className="space-y-4">
      {/* Visual scale buttons */}
      <div className="flex gap-2">
        {options.map((opt, i) => {
          const selected = value === opt
          const intensity = (i / (options.length - 1))
          return (
            <motion.button
              key={opt}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(opt)}
              title={opt}
              className={`flex-1 py-4 rounded-xl border-2 text-xs font-semibold transition-all duration-200
                flex flex-col items-center gap-1.5 ${
                  selected
                    ? 'border-pink-500 bg-pink-50 text-pink-700 dark:border-purple-500 dark:bg-purple-900/30 dark:text-purple-300 shadow-md'
                    : 'border-border bg-card text-muted-foreground hover:border-pink-300 dark:hover:border-purple-700'
                }`}
              id={`scale-${i + 1}`}
            >
              {/* Intensity dot */}
              <span
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  selected
                    ? 'bg-pink-500 dark:bg-purple-500 scale-125'
                    : 'bg-muted-foreground/30'
                }`}
                style={{ opacity: 0.4 + intensity * 0.6 }}
              />
              <span className="hidden sm:block text-center leading-tight">{opt}</span>
              <span className="sm:hidden font-bold">{i + 1}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Labels row */}
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{options[0]}</span>
        <span>{options[options.length - 1]}</span>
      </div>

      {/* Selected label */}
      {value && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
            bg-pink-100 text-pink-700 dark:bg-purple-900/40 dark:text-purple-300">
            Selected: {value}
          </span>
        </motion.div>
      )}
    </div>
  )
}
