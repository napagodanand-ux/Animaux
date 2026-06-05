'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface MultiSelectQuestionProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
}

export function MultiSelectQuestion({ options, value, onChange }: MultiSelectQuestionProps) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter(v => v !== opt))
    } else {
      onChange([...value, opt])
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map((opt, i) => {
        const selected = value.includes(opt)
        return (
          <motion.button
            key={opt}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => toggle(opt)}
            className={`relative flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium
              text-left transition-all duration-200 ${
                selected
                  ? 'border-pink-500 bg-pink-50 text-pink-700 dark:border-purple-500 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'border-border bg-card text-foreground hover:border-pink-300 dark:hover:border-purple-700'
              }`}
            id={`multiselect-${opt.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0
              transition-all duration-200 ${
                selected
                  ? 'border-pink-500 bg-pink-500 dark:border-purple-500 dark:bg-purple-500'
                  : 'border-muted-foreground'
              }`}>
              {selected && <Check className="w-3 h-3 text-white" />}
            </span>
            {opt}
          </motion.button>
        )
      })}
    </div>
  )
}
