'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Star } from 'lucide-react'

interface CtaSectionProps {
  totalResponses: number
}

export function CtaSection({ totalResponses }: CtaSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const responseText = totalResponses > 0
    ? `Join ${totalResponses.toLocaleString()}+ pet owners`
    : 'Be among the first pet owners'

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden p-12 sm:p-16
            bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600
            dark:from-purple-700 dark:via-pink-600 dark:to-indigo-700
            shadow-2xl shadow-pink-500/30 dark:shadow-purple-500/30"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden>
            <div className="absolute top-4 left-8 text-6xl">🐾</div>
            <div className="absolute bottom-4 right-8 text-5xl">💜</div>
            <div className="absolute top-1/2 left-4 text-4xl">✨</div>
            <div className="absolute bottom-8 left-1/3 text-3xl">🐕</div>
            <div className="absolute top-8 right-1/4 text-4xl">🐈</div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.1 * i, type: 'spring' }}
                >
                  <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                </motion.div>
              ))}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Ready to Share Your Story?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {responseText} contributing to the world&apos;s most comprehensive
              study on human-animal bonds. It takes just 5 minutes.
            </p>

            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                  bg-white text-purple-700 font-bold text-lg
                  shadow-xl hover:shadow-2xl transition-shadow duration-300"
                id="footer-cta-start-survey"
              >
                Start the Survey
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </motion.button>
            </Link>

            <p className="text-white/60 text-sm mt-4">
              Free · Anonymous · 5 minutes
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground text-sm mt-10"
        >
          © {new Date().getFullYear()} Animaux Research Platform · Built with ❤️ for pet lovers
        </motion.p>
      </div>
    </section>
  )
}
