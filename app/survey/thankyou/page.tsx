'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'

const confettiItems = ['🐾', '❤️', '✨', '🌟', '🐕', '🐈', '🎉', '💜']

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-page flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Floating confetti */}
      {confettiItems.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none select-none"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `-5%`,
          }}
          animate={{
            y: ['0%', '110vh'],
            rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4 + i * 0.3,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'linear',
          }}
        >
          {item}
        </motion.div>
      ))}

      {/* Theme switcher */}
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 120 }}
        className="text-center max-w-lg relative z-10"
      >
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-8xl mb-6 block"
        >
          🐾
        </motion.div>

        {/* Checkmark ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center
            bg-gradient-to-br from-pink-500 to-purple-600 dark:from-purple-500 dark:to-pink-500
            shadow-xl shadow-pink-500/30 dark:shadow-purple-500/30"
        >
          <motion.svg
            viewBox="0 0 24 24"
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
          </motion.svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl sm:text-4xl font-black mb-4"
        >
          Thank You For Contributing
          <br />
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 dark:from-purple-400 dark:to-pink-400
            bg-clip-text text-transparent">
            To Pet Research
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-muted-foreground text-base leading-relaxed mb-3 max-w-sm mx-auto"
        >
          Your responses have been securely recorded and will contribute to our
          ongoing research on human-pet relationships.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="text-muted-foreground text-sm mb-10"
        >
          Together, we&apos;re building a deeper understanding of the science behind pet happiness. 🌟
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-white
                bg-gradient-to-r from-pink-500 to-purple-600 dark:from-purple-500 dark:to-pink-500
                shadow-lg hover:shadow-xl transition-shadow duration-300"
              id="thankyou-home"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
