'use client'

import { useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SliderQuestionProps {
  value: number | undefined
  onChange: (value: number) => void
  min?: number
  max?: number
  field?: string
}

// Emoji + label that changes based on hours
const HOUR_STAGES = [
  { max: 0,  emoji: '😴', label: 'None today',        color: 'from-slate-400 to-slate-500' },
  { max: 1,  emoji: '🙂', label: 'Just a little',     color: 'from-blue-400 to-blue-500' },
  { max: 3,  emoji: '😊', label: 'Some quality time', color: 'from-cyan-400 to-teal-500' },
  { max: 5,  emoji: '🐾', label: 'Great bonding time',color: 'from-pink-400 to-pink-500' },
  { max: 8,  emoji: '❤️', label: 'Really close!',     color: 'from-pink-500 to-rose-500' },
  { max: 12, emoji: '🏡', label: 'Inseparable!',      color: 'from-purple-500 to-pink-500' },
  { max: Infinity, emoji: '🏆', label: 'True pet parent!', color: 'from-yellow-400 to-orange-500' },
]

function getStage(hours: number) {
  return HOUR_STAGES.find(s => hours <= s.max) ?? HOUR_STAGES[HOUR_STAGES.length - 1]
}

// Tick positions for visual reference
const TICKS = [0, 3, 6, 9, 12, 15, 18]

export function SliderQuestion({ value, onChange, min = 0, max = 18 }: SliderQuestionProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const current = value ?? -1
  const hasValue = current >= 0
  const stage = hasValue ? getStage(current) : null
  const pct = hasValue ? ((current - min) / (max - min)) * 100 : 0

  // ── Drag / touch calculation ──────────────────────────────
  const calcValue = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return
    const raw = (clientX - rect.left) / rect.width
    const clamped = Math.max(0, Math.min(1, raw))
    const val = Math.round(clamped * (max - min) + min)
    onChange(val)
  }, [max, min, onChange])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    calcValue(e.clientX)
    const move = (ev: MouseEvent) => calcValue(ev.clientX)
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    const move = (ev: TouchEvent) => { ev.preventDefault(); calcValue(ev.touches[0].clientX) }
    const end = () => { window.removeEventListener('touchmove', move); window.removeEventListener('touchend', end) }
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('touchend', end)
    calcValue(e.touches[0].clientX)
  }

  return (
    <div className="w-full select-none" id="slider-question">

      {/* Emoji + label display */}
      <div className="flex flex-col items-center mb-10 h-28 justify-center">
        <AnimatePresence mode="wait">
          {hasValue ? (
            <motion.div
              key={current}
              initial={{ scale: 0.5, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-7xl leading-none drop-shadow-sm">{stage?.emoji}</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-5xl font-black bg-gradient-to-r ${stage?.color} bg-clip-text text-transparent`}>
                  {current}
                </span>
                <span className="text-xl font-semibold text-muted-foreground">
                  {current === 1 ? 'hour' : 'hours'}
                </span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{stage?.label}</span>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="text-5xl mb-2">👆</div>
              <p className="text-sm text-muted-foreground">Drag the slider or tap the track</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slider track */}
      <div className="relative pt-6 pb-8 px-2">
        {/* Thumb label above */}
        {hasValue && (
          <motion.div
            className="absolute -top-0 text-xs font-bold text-pink-500 dark:text-purple-400 pointer-events-none"
            style={{ left: `calc(${pct}% + 8px - 16px)` }}
            layoutId="thumb-label"
          >
            {current}h
          </motion.div>
        )}

        {/* Track background */}
        <div
          ref={trackRef}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          className="relative h-5 rounded-full cursor-pointer touch-none"
          style={{ background: 'var(--muted)' }}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={hasValue ? current : undefined}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(Math.min(max, (current >= 0 ? current : 0) + 1))
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(Math.max(min, (current >= 0 ? current : 0) - 1))
          }}
        >
          {/* Filled portion */}
          {hasValue && (
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${stage?.color}`}
              style={{ width: `${pct}%` }}
              layoutId="fill"
            />
          )}

          {/* Thumb */}
          {hasValue && (
            <motion.div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full
                shadow-xl border-4 border-white dark:border-gray-900 cursor-grab active:cursor-grabbing
                bg-gradient-to-br ${stage?.color} flex items-center justify-center`}
              style={{ left: `${pct}%` }}
              layoutId="thumb"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">{stage?.emoji}</span>
            </motion.div>
          )}
        </div>

        {/* Tick marks */}
        <div className="flex justify-between mt-3 px-0">
          {TICKS.map(t => {
            const tickPct = ((t - min) / (max - min)) * 100
            return (
              <button
                key={t}
                type="button"
                onClick={() => onChange(t)}
                className="flex flex-col items-center gap-1 group -mx-1"
                style={{ width: '2rem' }}
              >
                <div className={`w-0.5 h-2 rounded-full transition-colors ${
                  hasValue && current >= t
                    ? 'bg-pink-400 dark:bg-purple-400'
                    : 'bg-muted-foreground/30'
                }`} />
                <span className={`text-xs font-medium transition-colors ${
                  hasValue && current === t
                    ? 'text-pink-500 dark:text-purple-400 font-bold'
                    : 'text-muted-foreground/60'
                }`}>{t}h</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
