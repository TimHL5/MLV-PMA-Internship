'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const revenueExamples = [
  { revenue: 30000, contribution: 'Meets Expectations', rate: 5, earnings: 1500 },
  { revenue: 50000, contribution: 'Exceeds Expectations', rate: 7.5, earnings: 3750 },
  { revenue: 75000, contribution: 'Outstanding', rate: 10, earnings: 7500 },
  { revenue: 100000, contribution: 'Exceptional', rate: 10, earnings: 10000 },
]

export default function Compensation() {
  const [revenue, setRevenue] = useState(50000)
  const [contributionLevel, setContributionLevel] = useState(7.5)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const calculateEarnings = () => {
    return (revenue * contributionLevel) / 100
  }

  return (
    <section
      id="compensation"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-dark-lighter" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      {/* Gradient accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-secondary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Compensation
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Earn While You </span>
            <span className="gradient-text-orange">Build</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Your summer capstone isn&apos;t just an internship - it&apos;s your own venture.
            Share in the revenue you generate.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Phase breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Spring Phase */}
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent-cyan" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Spring Shadowing</h3>
                  <p className="text-gray-400 mb-4">January - May 2026</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-gray-500">$0</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-sm text-gray-400">Unpaid, Learning-Focused</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Real Experience', 'Network Access', 'Mentorship', 'Portfolio Building'].map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Summer Phase */}
            <div className="glass-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-accent-pink" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Summer Capstone</h3>
                    <p className="text-gray-400 mb-4">June - August 2026</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold gradient-text-orange">5-10%</span>
                      <span className="text-gray-400">Revenue Share</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Based on your contribution level and performance
                    </p>
                  </div>
                </div>

                {/* Formula */}
                <div className="mt-6 p-4 rounded-xl bg-dark border border-gray-800">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Formula</div>
                  <div className="font-mono text-white">
                    <span className="text-secondary">Earnings</span> = Program Revenue × <span className="text-accent-cyan">Contribution Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-secondary">💰</span>
              Earnings Calculator
            </h3>

            {/* Revenue Slider */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Program Revenue</label>
                <span className="text-xl font-bold text-white">
                  ${revenue.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="150000"
                step="5000"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full h-2 bg-dark rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-secondary [&::-webkit-slider-thumb]:to-accent-pink [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-secondary/30"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$10K</span>
                <span>$150K</span>
              </div>
            </div>

            {/* Contribution Level Selector */}
            <div className="mb-8">
              <label className="text-sm text-gray-400 block mb-3">Contribution Level</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { rate: 5, label: 'Meets' },
                  { rate: 7.5, label: 'Exceeds' },
                  { rate: 10, label: 'Outstanding' },
                ].map(({ rate, label }) => (
                  <button
                    key={rate}
                    onClick={() => setContributionLevel(rate)}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      contributionLevel === rate
                        ? 'border-secondary bg-secondary/20 text-white'
                        : 'border-gray-700 bg-dark text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl font-bold">{rate}%</div>
                    <div className="text-xs mt-1">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/20 to-accent-pink/10 border border-secondary/30">
              <div className="text-sm text-gray-400 mb-2">Your Potential Earnings</div>
              <motion.div
                key={calculateEarnings()}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-5xl font-bold gradient-text-orange"
              >
                ${calculateEarnings().toLocaleString()}
              </motion.div>
              <p className="text-gray-500 text-sm mt-2">
                Based on ${revenue.toLocaleString()} revenue at {contributionLevel}% share
              </p>
            </div>

            {/* Visual breakdown */}
            <div className="mt-6">
              <div className="h-4 rounded-full bg-dark overflow-hidden flex">
                <motion.div
                  className="h-full bg-gradient-to-r from-secondary to-accent-pink"
                  initial={{ width: 0 }}
                  animate={{ width: `${contributionLevel}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Your Share: {contributionLevel}%</span>
                <span>Revenue: ${revenue.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Example scenarios table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">Example Scenarios</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Revenue</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Contribution</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Rate</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {revenueExamples.map((example, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-800/50 hover:bg-dark-lighter/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="text-white font-medium">${example.revenue.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        example.contribution === 'Outstanding' || example.contribution === 'Exceptional'
                          ? 'bg-green-500/20 text-green-400'
                          : example.contribution === 'Exceeds Expectations'
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {example.contribution}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-accent-cyan">{example.rate}%</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-xl font-bold gradient-text-orange group-hover:scale-110 inline-block transition-transform">
                        ${example.earnings.toLocaleString()}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          * Revenue share is determined by your overall contribution to program success,
          including customer acquisition, program delivery, and operational excellence.
        </motion.p>
      </div>
    </section>
  )
}
