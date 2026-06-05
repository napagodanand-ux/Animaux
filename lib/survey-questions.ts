export type QuestionType =
  | 'multiselect'
  | 'number'
  | 'stepper'
  | 'slider'
  | 'select'
  | 'scale'
  | 'text'
  | 'star_rating'

export interface Question {
  id: string
  section: string
  question: string
  type: QuestionType
  options?: string[]
  min?: number
  max?: number
  placeholder?: string
  field: string
}

export const SURVEY_QUESTIONS: Question[] = [
  // --- PET OWNERSHIP ---
  {
    id: 'q1',
    section: 'Pet Ownership',
    question: 'What pets do you currently own?',
    type: 'multiselect',
    field: 'pet_types',
    options: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Reptile', 'Turtle', 'Guinea Pig', 'Other'],
  },
  {
    id: 'q2',
    section: 'Pet Ownership',
    question: 'How many pets do you currently have?',
    type: 'stepper',
    field: 'pet_count',
    min: 1,
    max: 20,
  },
  {
    id: 'q3',
    section: 'Pet Ownership',
    question: 'How long have you been a pet owner?',
    type: 'select',
    field: 'ownership_duration',
    options: ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years'],
  },

  // --- TIME & INTERACTION ---
  {
    id: 'q4',
    section: 'Time & Interaction',
    question: 'How many hours per day do you spend with your pets?',
    type: 'slider',
    field: 'hours_per_day',
    min: 0,
    max: 18,
  },
  {
    id: 'q5',
    section: 'Time & Interaction',
    question: 'How often do you play with your pets?',
    type: 'scale',
    field: 'play_frequency',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
  },
  {
    id: 'q6',
    section: 'Time & Interaction',
    question: 'How often do you talk to your pets?',
    type: 'scale',
    field: 'talk_frequency',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
  },

  // --- EMOTIONAL BOND ---
  {
    id: 'q7',
    section: 'Emotional Bond',
    question: 'How emotionally connected do you feel to your pets?',
    type: 'scale',
    field: 'emotional_connection',
    options: ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'],
  },
  {
    id: 'q8',
    section: 'Emotional Bond',
    question: 'How much do your pets improve your mood?',
    type: 'scale',
    field: 'mood_improvement',
    options: ['Not At All', 'Slightly', 'Moderately', 'Significantly', 'Extremely'],
  },
  {
    id: 'q9',
    section: 'Emotional Bond',
    question: 'How happy do your pets seem most of the time?',
    type: 'scale',
    field: 'pet_happiness',
    options: ['Very Unhappy', 'Unhappy', 'Neutral', 'Happy', 'Very Happy'],
  },

  // --- CHALLENGES ---
  {
    id: 'q10',
    section: 'Challenges',
    question: 'What is the biggest challenge of owning pets?',
    type: 'select',
    field: 'biggest_challenge',
    options: ['Cleaning', 'Training', 'Cost', 'Noise', 'Health Issues', 'Time Commitment', 'Other'],
  },
  {
    id: 'q11',
    section: 'Challenges',
    question: 'What do you enjoy most about owning pets?',
    type: 'text',
    field: 'enjoy_most',
    placeholder: 'Share what brings you joy...',
  },

  // --- RATING ---
  {
    id: 'q12',
    section: 'Overall Rating',
    question: 'How would you rate your overall pet ownership experience?',
    type: 'star_rating',
    field: 'experience_rating',
  },
  {
    id: 'q13',
    section: 'Overall Rating',
    question: 'Would you recommend pet ownership to others?',
    type: 'select',
    field: 'would_recommend',
    options: ['Yes', 'No', 'Maybe'],
  },

  // --- DEMOGRAPHICS ---
  {
    id: 'q14',
    section: 'About You',
    question: 'What is your age range?',
    type: 'select',
    field: 'age_range',
    options: ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'],
  },
]

export const TOTAL_QUESTIONS = SURVEY_QUESTIONS.length
