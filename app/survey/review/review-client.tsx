'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SURVEY_QUESTIONS } from '@/lib/survey-questions'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Pencil, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'

const STORAGE_KEY = 'animaux_survey_draft'

export function ReviewClient({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setAnswers(parsed.answers || {})
      } else {
        router.push('/survey/questions')
      }
    } catch {
      router.push('/survey/questions')
    }
  }, [router])

  const goEdit = (questionIndex: number) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentIndex: questionIndex }))
    router.push('/survey/questions')
  }

  const formatValue = (field: string, value: unknown): string => {
    if (Array.isArray(value)) return value.join(', ')
    if (value === undefined || value === null || value === '') return '—'
    return String(value)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const payload = {
        user_id: userId,
        pet_types: (answers.pet_types as string[]) || [],
        pet_count: answers.pet_count as number,
        ownership_duration: answers.ownership_duration as string,
        hours_per_day: answers.hours_per_day as number,
        play_frequency: answers.play_frequency as string,
        talk_frequency: answers.talk_frequency as string,
        emotional_connection: answers.emotional_connection as string,
        mood_improvement: answers.mood_improvement as string,
        pet_happiness: answers.pet_happiness as string,
        biggest_challenge: answers.biggest_challenge as string,
        enjoy_most: answers.enjoy_most as string,
        experience_rating: answers.experience_rating as number,
        would_recommend: answers.would_recommend as string,
        age_range: answers.age_range as string,
      }

      // Insert survey response
      const { error: surveyError } = await supabase
        .from('survey_responses')
        .insert(payload)

      if (surveyError) throw surveyError

      // Mark profile as submitted
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ survey_submitted: true })
        .eq('id', userId)

      if (profileError) throw profileError

      // Clear draft
      localStorage.removeItem(STORAGE_KEY)

      toast.success('Survey submitted! Thank you! 🐾')
      router.push('/survey/thankyou')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed. Please try again.'
      toast.error(message)
      setSubmitting(false)
      setShowConfirm(false)
    }
  }

  const allAnswered = SURVEY_QUESTIONS.every(q => {
    const val = answers[q.field]
    if (q.type === 'multiselect') return Array.isArray(val) && val.length > 0
    return val !== undefined && val !== ''
  })

  return (
    <div className="min-h-screen bg-gradient-page">
      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg">Review Your Answers</h1>
            <p className="text-xs text-muted-foreground">Check everything before submitting</p>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-3">
        {SURVEY_QUESTIONS.map((q, i) => {
          const val = answers[q.field]
          const displayVal = formatValue(q.field, val)
          const isEmpty = displayVal === '—'

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card-premium p-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-pink-500 dark:text-purple-400 mb-0.5">
                  {q.section} · Q{i + 1}
                </p>
                <p className="text-sm font-medium text-foreground mb-1 leading-snug">{q.question}</p>
                <p className={`text-sm ${isEmpty ? 'text-destructive italic' : 'text-muted-foreground'}`}>
                  {isEmpty ? 'Not answered' : displayVal}
                </p>
              </div>
              <button
                onClick={() => goEdit(i)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  border border-border hover:bg-muted hover:text-foreground text-muted-foreground
                  transition-colors"
                id={`review-edit-q${i + 1}`}
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
            </motion.div>
          )
        })}

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-4 pb-8"
        >
          {!allAnswered && (
            <p className="text-sm text-destructive text-center mb-4">
              ⚠️ Some questions are unanswered. Please edit and complete them before submitting.
            </p>
          )}

          {!showConfirm ? (
            <motion.button
              whileHover={allAnswered ? { scale: 1.02, y: -2 } : {}}
              whileTap={allAnswered ? { scale: 0.98 } : {}}
              onClick={() => setShowConfirm(true)}
              disabled={!allAnswered}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white
                bg-gradient-to-r from-pink-500 to-purple-600 dark:from-purple-500 dark:to-pink-500
                disabled:opacity-40 disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl hover:shadow-pink-500/30 dark:hover:shadow-purple-500/30
                transition-all duration-200"
              id="review-submit"
            >
              <Send className="w-5 h-5" />
              Submit Survey
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-premium p-6 text-center space-y-4"
            >
              <CheckCircle2 className="w-10 h-10 mx-auto text-pink-500 dark:text-purple-400" />
              <p className="font-semibold">Ready to submit?</p>
              <p className="text-sm text-muted-foreground">
                Once submitted, your answers are locked and cannot be changed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-sm font-medium
                    hover:bg-muted transition-colors"
                  id="confirm-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm text-white
                    bg-gradient-to-r from-pink-500 to-purple-600 dark:from-purple-500 dark:to-pink-500
                    disabled:opacity-60 flex items-center justify-center gap-2"
                  id="confirm-submit"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {submitting ? 'Submitting...' : 'Confirm & Submit'}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
