'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { PawPrint } from 'lucide-react'

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 
                dark:from-purple-500 dark:to-pink-400 flex items-center justify-center shadow-lg"
            >
              <PawPrint className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Animaux
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
