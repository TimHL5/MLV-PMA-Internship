'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-dark-pure">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-pure via-dark-lighter/50 to-dark-pure" />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(106,198,112,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(106,198,112,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-24 pb-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Image
            src="/MLV Logo (white).png"
            alt="MLV"
            width={100}
            height={40}
            className="mx-auto"
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/10 border border-brand-green/30 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-sm text-brand-green font-medium">2026 PM Associate Program</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
        >
          Welcome to{' '}
          <span className="text-brand-green">faMLV</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-xl text-gray-400 mb-4 max-w-2xl mx-auto"
        >
          Building the next generation of entrepreneurial leaders across Asia
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base text-gray-500 mb-10 max-w-xl mx-auto"
        >
          8 months. 3 phases. From shadowing to launching your own venture.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/apply"
            className="px-8 py-4 bg-brand-green hover:bg-primary-dark text-dark-pure font-semibold rounded-xl transition-all duration-200 hover:scale-105"
          >
            Apply Now
          </Link>
          <a
            href="#program"
            className="px-8 py-4 border border-brand-green/30 text-brand-green hover:bg-brand-green/10 font-medium rounded-xl transition-all duration-200"
          >
            Learn More
          </a>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {[
            { value: '$50K+', label: 'Revenue to Date' },
            { value: '50+', label: 'Startups Launched' },
            { value: '7', label: 'Program Cycles' },
            { value: '3', label: 'Cities in Asia' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-brand-green">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Backed by */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Backed by</p>
          <p className="text-sm text-gray-500">SSC Venture Partners • Do Ventures • Thien Viet Securities</p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-gray-600 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
