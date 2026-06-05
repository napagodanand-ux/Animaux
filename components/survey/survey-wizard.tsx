'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SURVEY_QUESTIONS, TOTAL_QUESTIONS } from '@/lib/survey-questions'
import { MultiSelectQuestion } from './question-types/multi-select-question'
import { NumberQuestion } from './question-types/number-question'
import { StepperQuestion } from './question-types/stepper-question'
import { SliderQuestion } from './question-types/slider-question'
import { SelectQuestion } from './question-types/select-question'
import { ScaleQuestion } from './question-types/scale-question'
import { TextQuestion } from './question-types/text-question'
import { StarRatingQuestion } from './question-types/star-rating-question'
import { SurveyProgress } from './survey-progress'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'

const STORAGE_KEY = 'animaux_survey_draft'

export function SurveyWizard() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})

  // Load saved draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setAnswers(parsed.answers || {})
        setCurrentIndex(parsed.currentIndex || 0)
      }
    } catch {}
  }, [])

  // Auto-save draft
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentIndex }))
  }, [answers, currentIndex])

  const question = SURVEY_QUESTIONS[currentIndex]
  const currentValue = answers[question.field]
  const isAnswered =
    currentValue !== undefined &&
    currentValue !== '' &&
    !(Array.isArray(currentValue) && currentValue.length === 0)

  const goNext = useCallback(() => {
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setDirection(1)
      setCurrentIndex(i => i + 1)
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentIndex }))
      router.push('/survey/review')
    }
  }, [currentIndex, answers, router])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(i => i - 1)
    }
  }, [currentIndex])

  const handleAnswer = (value: unknown) => {
    setAnswers(prev => ({ ...prev, [question.field]: value }))
  }

  // Keyboard navigation (skip Enter for slider/stepper — they handle their own events)
  useEffect(() => {
    const skipEnter = question.type === 'slider' || question.type === 'stepper' || question.type === 'text'
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !skipEnter && isAnswered) goNext()
      if (e.key === 'Backspace' && e.altKey) goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isAnswered, goNext, goPrev, question.type])

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <div className="min-h-screen bg-gradient-page flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <span className="text-sm font-semibold text-pink-500 dark:text-purple-400">
          {question.section}
        </span>
        <ThemeSwitcher />
      </div>

      {/* Progress */}
      <SurveyProgress current={currentIndex + 1} total={TOTAL_QUESTIONS} />

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Question meta */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                {currentIndex + 1} / {TOTAL_QUESTIONS}
              </p>

              {/* Question text */}
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 leading-snug">
                {question.question}
              </h2>

              {/* ── Input based on type ── */}
              <div className="mb-8">

                {question.type === 'multiselect' && (
                  <MultiSelectQuestion
                    options={question.options!}
                    value={(currentValue as string[]) || []}
                    onChange={handleAnswer}
                  />
                )}

                {question.type === 'stepper' && (
                  <StepperQuestion
                    value={currentValue as number | undefined}
                    onChange={v => handleAnswer(v)}
                    min={question.min}
                    max={question.max}
                  />
                )}

                {question.type === 'slider' && (
                  <SliderQuestion
                    value={currentValue as number | undefined}
                    onChange={v => handleAnswer(v)}
                    min={question.min}
                    max={question.max}
                    field={question.field}
                  />
                )}

                {question.type === 'number' && (
                  <NumberQuestion
                    value={currentValue as number | undefined}
                    onChange={handleAnswer}
                    min={question.min}
                    max={question.max}
                    placeholder={question.placeholder}
                  />
                )}

                {question.type === 'select' && (
                  <SelectQuestion
                    options={question.options!}
                    value={currentValue as string | undefined}
                    onChange={handleAnswer}
                  />
                )}

                {question.type === 'scale' && (
                  <ScaleQuestion
                    options={question.options!}
                    value={currentValue as string | undefined}
                    onChange={handleAnswer}
                  />
                )}

                {question.type === 'text' && (
                  <TextQuestion
                    value={currentValue as string | undefined}
                    onChange={handleAnswer}
                    placeholder={question.placeholder}
                  />
                )}

                {question.type === 'star_rating' && (
                  <StarRatingQuestion
                    value={currentValue as number | undefined}
                    onChange={handleAnswer}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border
                    text-sm font-medium text-muted-foreground
                    hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed
                    transition-all duration-200"
                  id="survey-prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <motion.button
                  onClick={goNext}
                  disabled={!isAnswered}
                  whileHover={isAnswered ? { scale: 1.03, y: -1 } : {}}
                  whileTap={isAnswered ? { scale: 0.97 } : {}}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white
                    bg-gradient-to-r from-pink-500 to-purple-600 dark:from-purple-500 dark:to-pink-500
                    disabled:opacity-40 disabled:cursor-not-allowed
                    shadow-md hover:shadow-lg hover:shadow-pink-500/30 dark:hover:shadow-purple-500/30
                    transition-all duration-200"
                  id="survey-next"
                >
                  {currentIndex === TOTAL_QUESTIONS - 1 ? 'Review Answers' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Keyboard hint — only for non-interactive types */}
              {!['slider', 'stepper'].includes(question.type) && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Enter</kbd> to continue
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
