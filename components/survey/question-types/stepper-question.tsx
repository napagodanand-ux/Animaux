'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface StepperQuestionProps {
  value: number | undefined
  onChange: (value: number) => void
  min?: number
  max?: number
}

// Emoji + vibe changes based on pet count
const PET_STAGES = [
  { count: 1,  emoji: '🐾',              label: 'Just the one!',   sub: 'A special companion' },
  { count: 2,  emoji: '🐾🐾',            label: 'A dynamic duo!',  sub: 'Double the love' },
  { count: 3,  emoji: '🐾🐾🐾',          label: 'A little crew!',  sub: 'Party of three' },
  { count: 4,  emoji: '🐕🐈',            label: 'A full house!',   sub: 'Big pet family' },
  { count: 5,  emoji: '🏡',              label: 'Pawsome squad!',  sub: 'The gang\'s all here' },
  { count: 7,  emoji: '🎪',              label: 'A whole zoo!',    sub: 'Legend status' },
  { count: Infinity, emoji: '🏆', label: 'Super parent!',  sub: 'Officially a pet sanctuary' },
]

function getStage(count: number) {
  return PET_STAGES.find(s => count <= s.count) ?? PET_STAGES[PET_STAGES.length - 1]
}

export function StepperQuestion({ value, onChange, min = 1, max = 20 }: StepperQuestionProps) {
  const current = value ?? 1
  const hasValue = value !== undefined
  const stage = getStage(current)

  const decrement = () => onChange(Math.max(min, current - 1))
  const increment = () => onChange(Math.min(max, current + 1))

  return (
    <div className="flex flex-col items-center gap-8 py-4" id="stepper-question">

      {/* Emoji + label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.label}
          initial={{ scale: 0.8, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="text-center"
        >
          <motion.div
            className="text-5xl sm:text-6xl mb-3"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            key={current}
          >
            {stage.emoji}
          </motion.div>
          <p className="font-bold text-lg text-foreground">{stage.label}</p>
          <p className="text-sm text-muted-foreground">{stage.sub}</p>
        </motion.div>
      </AnimatePresence>

      {/* Stepper controls */}
      <div className="flex items-center gap-6 sm:gap-8">
        {/* Minus */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={decrement}
          disabled={current <= min}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-3xl font-bold
            border-2 border-border bg-card disabled:opacity-30 disabled:cursor-not-allowed
            hover:border-pink-400 dark:hover:border-purple-500 hover:bg-muted
            transition-colors duration-150 flex items-center justify-center shadow-sm"
          id="stepper-minus"
          aria-label="Decrease"
        >
          −
        </motion.button>

        {/* Count display */}
        <div className="relative w-28 sm:w-36 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="text-6xl sm:text-7xl font-black bg-gradient-to-br from-pink-500 to-purple-600
                dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent text-center"
            >
              {hasValue ? current : '?'}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Plus */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={increment}
          disabled={current >= max}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-3xl font-bold
            border-2 border-pink-400 dark:border-purple-500 bg-pink-50 dark:bg-purple-900/20
            disabled:opacity-30 disabled:cursor-not-allowed
            hover:bg-pink-100 dark:hover:bg-purple-900/40
            transition-colors duration-150 flex items-center justify-center shadow-sm
            text-pink-600 dark:text-purple-400"
          id="stepper-plus"
          aria-label="Increase"
        >
          +
        </motion.button>
      </div>

      {/* Pet count word */}
      <p className="text-sm text-muted-foreground text-center">
        {current === 1 ? '1 pet' : `${current} pets`} · tap + or − to adjust
      </p>

      {/* Quick select bubbles */}
      <div className="flex flex-wrap justify-center gap-2">
        {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
          <motion.button
            key={n}
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onChange(n)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-150 ${
              current === n && hasValue
                ? 'border-pink-500 bg-pink-50 text-pink-700 dark:border-purple-500 dark:bg-purple-900/30 dark:text-purple-300'
                : 'border-border bg-card text-muted-foreground hover:border-pink-300 dark:hover:border-purple-600'
            }`}
            id={`stepper-quick-${n}`}
          >
            {n}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
