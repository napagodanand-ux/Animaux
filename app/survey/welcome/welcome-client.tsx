'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ClipboardList, Clock, Shield, ArrowRight, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'

const highlights = [
  { icon: ClipboardList, label: '14 Questions', desc: 'Covering your pet relationship' },
  { icon: Clock, label: '~5 Minutes', desc: 'Quick and engaging experience' },
  { icon: Shield, label: '100% Private', desc: 'Anonymous & encrypted data' },
]

export function WelcomeClient({ userEmail }: { userEmail: string }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl bg-pink-300 dark:bg-purple-600 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl bg-purple-300 dark:bg-pink-600 pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeSwitcher />
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
            px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          id="welcome-signout"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg text-center"
      >
        {/* Paw icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-7xl mb-6 block"
        >
          🐾
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-3xl sm:text-4xl font-black mb-3"
        >
          Welcome to the Survey
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-muted-foreground mb-2"
        >
          Signed in as <span className="font-medium text-foreground">{userEmail}</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm max-w-sm mx-auto mb-10 leading-relaxed"
        >
          You&apos;re about to contribute to groundbreaking research on human-pet relationships.
          Your answers help scientists understand the emotional bonds between people and animals.
        </motion.p>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          {highlights.map((h) => {
            const Icon = h.icon
            return (
              <div key={h.label} className="card-premium p-4 text-center">
                <Icon className="w-5 h-5 mx-auto mb-2 text-pink-500 dark:text-purple-400" />
                <p className="font-semibold text-sm">{h.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
              </div>
            )
          })}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/survey/questions')}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg
            bg-gradient-to-r from-pink-500 to-purple-600 dark:from-purple-500 dark:to-pink-500
            shadow-lg shadow-pink-500/30 dark:shadow-purple-500/30
            hover:shadow-xl transition-shadow duration-300"
          id="welcome-begin-survey"
        >
          Begin Survey
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  )
}
