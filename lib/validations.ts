import { z } from 'zod'

export const surveySchema = z.object({
  // Pet Ownership
  pet_types: z.array(z.string()).min(1, 'Please select at least one pet type'),
  pet_count: z.number().min(1).max(100),
  ownership_duration: z.string().min(1),

  // Time & Interaction
  hours_per_day: z.number().min(0).max(24),
  play_frequency: z.string().min(1),
  talk_frequency: z.string().min(1),

  // Emotional Bond
  emotional_connection: z.string().min(1),
  mood_improvement: z.string().min(1),
  pet_happiness: z.string().min(1),

  // Challenges
  biggest_challenge: z.string().min(1),
  enjoy_most: z.string().min(1).max(500),

  // Rating
  experience_rating: z.number().min(1).max(5),
  would_recommend: z.string().min(1),

  // Demographics
  age_range: z.string().min(1),
})

export type SurveyData = z.infer<typeof surveySchema>
