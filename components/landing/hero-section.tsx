'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

const floatingPets = [
  { emoji: '🐕', delay: 0, x: -60, y: -40 },
  { emoji: '🐈', delay: 0.3, x: 60, y: -60 },
  { emoji: '🐇', delay: 0.6, x: -80, y: 30 },
  { emoji: '🐠', delay: 0.9, x: 80, y: 40 },
  { emoji: '🦜', delay: 1.2, x: -40, y: 70 },
  { emoji: '🐹', delay: 1.5, x: 50, y: 70 },
]

function FloatingPet({ emoji, delay, x, y }: { emoji: string; delay: number; x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0.8, 1],
        scale: [0, 1.2, 1],
        y: [y, y - 10, y + 5, y - 8, y],
      }}
      transition={{
        opacity: { duration: 1, delay },
        scale: { duration: 0.6, delay },
        y: {
          duration: 4,
          delay: delay + 0.6,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
      }}
      className="absolute text-3xl sm:text-4xl select-none pointer-events-none"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {emoji}
    </motion.div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-4 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none bg-pink-300 dark:bg-purple-600" aria-hidden />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none bg-purple-300 dark:bg-pink-600" aria-hidden />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8
            bg-pink-100 text-pink-700 border border-pink-200
            dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700/50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Pet-Owner Research Platform
        </motion.div>

        {/* Floating pets */}
        <div className="relative flex justify-center items-center h-32 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="text-7xl sm:text-8xl"
          >
            🐾
          </motion.div>
          {floatingPets.map((pet) => (
            <FloatingPet key={pet.emoji} {...pet} />
          ))}
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
        >
          Discover the Science{' '}
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Behind Pet
          </span>
          <br />Happiness
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Join a global community of pet owners contributing to groundbreaking research
          on human-animal bonds, emotional wellbeing, and the true science of pet happiness.
          Your story matters.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-lg
                bg-gradient-to-r from-pink-500 to-purple-600 dark:from-purple-500 dark:to-pink-500
                shadow-lg shadow-pink-500/30 dark:shadow-purple-500/30
                hover:shadow-xl hover:shadow-pink-500/40 dark:hover:shadow-purple-500/40
                transition-shadow duration-300"
              id="hero-cta-start-survey"
            >
              Start Survey
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </motion.button>
          </Link>
          <span className="text-sm text-muted-foreground">Takes ~5 minutes · 100% anonymous</span>
        </motion.div>
      </div>
    </section>
  )
}
