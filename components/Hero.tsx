'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

// Main Hero Component - Clean static gradient background (no moving bubbles)
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0e27]"
    >
      {/* Static gradient background - NO moving elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1a2e] to-[#0a0e27]" />

      {/* Static gradient orbs - very subtle, no animation */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-[#6AC670]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#F2CF07]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6AC670]/5 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto pt-20"
        style={{ y, opacity, scale }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6AC670]/20 border border-[#6AC670]/30 mb-8"
        >
          <span className="w-2 h-2 bg-[#6AC670] rounded-full animate-pulse" />
          <span className="text-[#6AC670] font-medium text-sm">Applications Open for 2026 Cohort</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="block text-white">Don&apos;t Just Learn</span>
          <span className="block bg-gradient-to-r from-[#6AC670] to-[#F2CF07] bg-clip-text text-transparent">
            Startups.
          </span>
          <span className="block text-white mt-1 sm:mt-2">Build One.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-3 mb-8"
        >
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300">
            <span className="text-white font-medium">MLV Product Management Associate Program</span>
            <span className="mx-2 sm:mx-3 text-[#6AC670]">|</span>
            <span className="text-gray-400">2026 Cohort</span>
          </p>
          <p className="text-sm sm:text-base text-gray-400 max-w-3xl mx-auto">
            For US college students with roots in Hong Kong, Vietnam, or Singapore.
            <br className="hidden sm:block" />
            Remote spring shadowing → On-ground summer venture building in Asia.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/apply"
            className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#6AC670] to-[#F2CF07] text-black text-lg font-bold rounded-full
                     hover:scale-105 hover:shadow-[0_0_30px_rgba(106,198,112,0.5)] transition-all duration-300
                     flex items-center justify-center gap-2"
          >
            Apply Now
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <a
            href="#overview"
            className="w-full sm:w-auto px-8 py-4 border-2 border-[#6AC670] text-[#6AC670] text-lg font-bold rounded-full
                     hover:bg-[#6AC670]/10 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn More
          </a>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: '8', label: 'Months' },
            { value: '$50K+', label: 'Revenue Target' },
            { value: '3', label: 'Countries' },
            { value: '2', label: 'Phases' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#6AC670] to-[#F2CF07] bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 sm:mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-sm text-gray-400 uppercase tracking-wide">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-[#6AC670]/50 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 bg-[#6AC670] rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark to-transparent pointer-events-none z-5" />
    </section>
  )
}
