'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const mustHaves = [
  'Currently enrolled at a US college or university',
  'Have roots or ties to Hong Kong, Vietnam, or Singapore (family, citizenship, etc.)',
  'Able to be physically present in Asia during summer (May-August 2026)',
  'Available 5-8 hrs/week (spring, remote) and 20-30 hrs/week (summer, on-ground)',
  'Fluent in English (spoken + written)',
  'Entrepreneurial mindset - excited to build and ship',
]

const weCareAbout = [
  { text: 'Resourcefulness over polish', icon: '🔧' },
  { text: 'Execution speed over perfection', icon: '⚡' },
  { text: 'Customer obsession', icon: '🎯' },
  { text: 'Comfort with ambiguity', icon: '🌊' },
  { text: 'Hunger to learn', icon: '📚' },
  { text: 'Grit and resilience', icon: '💪' },
]

const weDontCare = [
  'Prior startup experience',
  'Perfect GPA',
  'Business major',
  'Previous internships',
  'Coding skills',
]

const cities = [
  { name: 'Hong Kong', flag: '🇭🇰', description: 'Summer base' },
  { name: 'Ho Chi Minh City', flag: '🇻🇳', description: 'Summer base' },
  { name: 'Hanoi', flag: '🇻🇳', description: 'Summer base' },
  { name: 'Singapore', flag: '🇸🇬', description: 'Summer base' },
]

export default function IdealCandidate() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section
      id="candidate"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-dark" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Who We&apos;re Looking For
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">The Ideal </span>
            <span className="gradient-text">Candidate</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-4">
            We&apos;re not looking for perfect resumes. We&apos;re looking for builders,
            hustlers, and learners who are ready to dive in.
          </p>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            This program is designed for US college students who have roots in Asia and want
            to spend their summer building something meaningful in their home region.
          </p>
        </motion.div>

        {/* Geographic requirement callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 md:p-8 mb-12 max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-3xl">🌏</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                Why US College + Asia Roots?
              </h3>
              <p className="text-gray-400">
                You bring a unique dual perspective - American education and Asian market intuition.
                This lets you build products that bridge both worlds. Plus, you&apos;ll be home for summer
                anyway - why not build something while you&apos;re there?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold text-white text-center mb-6">
            Summer Locations (You must be able to work on-ground in one of these cities)
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-4 glass-card flex items-center gap-3"
              >
                <span className="text-2xl">{city.flag}</span>
                <div>
                  <span className="text-white font-medium block">{city.name}</span>
                  <span className="text-gray-500 text-xs">{city.description}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Must Haves */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-400" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Must Haves</h3>
            </div>

            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="space-y-4"
            >
              {mustHaves.map((item, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* What We Care About */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent-cyan" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">What We Value</h3>
            </div>

            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="space-y-4"
            >
              {weCareAbout.map((item, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-3 p-3 rounded-xl bg-dark/50 hover:bg-primary/10 transition-colors group"
                >
                  <span className="text-xl group-hover:scale-125 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* What We DON'T Care About */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-400" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">NOT Required</h3>
            </div>

            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="space-y-4"
            >
              {weDontCare.map((item, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-gray-400 line-through decoration-red-500/50">{item}</span>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-400">
                We hire based on potential, not pedigree. Show us your hunger to learn and build.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Profile cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            You Might Be a Great Fit If...
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: '🎓',
                title: 'The Bridge Builder',
                description: 'You understand both US and Asian markets and want to leverage that unique perspective',
              },
              {
                emoji: '🚀',
                title: 'The Side Hustler',
                description: 'You\'ve already tried starting something - even if it failed',
              },
              {
                emoji: '🏠',
                title: 'The Home Comer',
                description: 'You\'re excited to spend summer in Asia building something meaningful',
              },
              {
                emoji: '🤝',
                title: 'The Connector',
                description: 'You naturally bring people together and make things happen',
              },
            ].map((profile, index) => (
              <motion.div
                key={profile.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-card glass-card-hover p-6 text-center"
              >
                <div className="text-4xl mb-4">{profile.emoji}</div>
                <h4 className="text-lg font-bold text-white mb-2">{profile.title}</h4>
                <p className="text-gray-400 text-sm">{profile.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
