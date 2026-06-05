'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface NumberQuestionProps {
  value: number | undefined
  onChange: (value: number) => void
  min?: number
  max?: number
  placeholder?: string
}

export function NumberQuestion({ value, onChange, min = 0, max = 100, placeholder }: NumberQuestionProps) {
  const [inputValue, setInputValue] = useState(value?.toString() ?? '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)
    const num = parseFloat(raw)
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xs"
    >
      <input
        type="number"
        min={min}
        max={max}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder ?? `${min} – ${max}`}
        autoFocus
        className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-card text-foreground
          text-2xl font-bold text-center focus:outline-none focus:border-pink-500
          dark:focus:border-purple-500 transition-colors duration-200
          placeholder:text-muted-foreground placeholder:font-normal placeholder:text-base"
        id="number-input"
      />
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Valid range: {min} – {max}
      </p>
    </motion.div>
  )
}
