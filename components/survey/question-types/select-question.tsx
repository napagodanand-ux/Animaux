'use client'

import { motion } from 'framer-motion'

interface SelectQuestionProps {
  options: string[]
  value: string | undefined
  onChange: (value: string) => void
}

export function SelectQuestion({ options, value, onChange }: SelectQuestionProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt, i) => {
        const selected = value === opt
        return (
          <motion.button
            key={opt}
            type="button"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onChange(opt)}
            className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-sm font-medium
              text-left transition-all duration-200 ${
                selected
                  ? 'border-pink-500 bg-pink-50 text-pink-700 dark:border-purple-500 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'border-border bg-card text-foreground hover:border-pink-300 dark:hover:border-purple-700 hover:bg-muted/50'
              }`}
            id={`select-${opt.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()}`}
          >
            <span>{opt}</span>
            {selected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 rounded-full bg-pink-500 dark:bg-purple-500 flex items-center justify-center shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-white" />
              </motion.span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
