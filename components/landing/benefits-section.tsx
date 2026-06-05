'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, Brain, Clock, BarChart3, Shield, Users } from 'lucide-react'

const benefits = [
  {
    icon: Heart,
    title: 'Measure Emotional Bonds',
    description: 'Quantify the depth of human-pet connections through validated research methodology.',
    color: 'from-pink-400 to-rose-500',
  },
  {
    icon: Brain,
    title: 'Advance Pet Science',
    description: 'Your insights directly contribute to published research on animal behavior and welfare.',
    color: 'from-purple-400 to-indigo-500',
  },
  {
    icon: Clock,
    title: 'Track Interaction Habits',
    description: 'Understand how daily routines shape the quality of pet-owner relationships.',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Real Analytical Insights',
    description: 'Contribute to a living dataset that reveals patterns across species and demographics.',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your personal data is never shared. Only anonymized, aggregated analytics are published.',
    color: 'from-orange-400 to-amber-500',
  },
  {
    icon: Users,
    title: 'Global Community',
    description: 'Join pet owners worldwide united by a love for their animals and a desire to understand them better.',
    color: 'from-fuchsia-400 to-pink-500',
  },
]

export function BenefitsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Your Participation Matters
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every answer you share helps researchers better understand the profound
            impact pets have on human wellbeing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="card-premium p-6 group cursor-default"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${benefit.color} 
                  flex items-center justify-center mb-4 shadow-lg
                  group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
