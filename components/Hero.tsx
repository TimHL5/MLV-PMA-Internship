'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Image
            src="/MLV Logo (white).png"
            alt="MLV"
            width={80}
            height={32}
            className="mx-auto opacity-90"
          />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[2.75rem] sm:text-5xl md:text-6xl font-semibold text-white mb-6 leading-[1.1] tracking-tight"
        >
          Product Management
          <br />
          <span className="text-[#6AC670]">Associate Program</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-[#888] mb-4 font-light"
        >
          January — August 2026
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base text-[#666] mb-10 max-w-md mx-auto leading-relaxed"
        >
          8 months building real products across Hong Kong, 
          Ho Chi Minh City, and Hanoi.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link
            href="/internal"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6AC670] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#5ab560] transition-colors"
          >
            Intern Portal
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 flex items-center justify-center gap-12 sm:gap-16"
        >
          {[
            { value: '$50K+', label: 'Revenue' },
            { value: '50+', label: 'Startups' },
            { value: '3', label: 'Cities' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-semibold text-white">{stat.value}</div>
              <div className="text-xs text-[#555] mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-[#333] rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-1.5 bg-[#444] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
