'use client'

import { motion } from 'framer-motion'

interface TextQuestionProps {
  value: string | undefined
  onChange: (value: string) => void
  placeholder?: string
}

export function TextQuestion({ value, onChange, placeholder }: TextQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <textarea
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? 'Type your answer here...'}
        rows={4}
        autoFocus
        maxLength={500}
        className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-card text-foreground
          text-base resize-none focus:outline-none focus:border-pink-500 dark:focus:border-purple-500
          transition-colors duration-200 placeholder:text-muted-foreground leading-relaxed"
        id="text-input"
      />
      <div className="flex justify-end mt-1.5">
        <span className={`text-xs ${(value?.length ?? 0) > 450 ? 'text-destructive' : 'text-muted-foreground'}`}>
          {value?.length ?? 0} / 500
        </span>
      </div>
    </motion.div>
  )
}
