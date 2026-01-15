'use client'

import { motion } from 'framer-motion'

const cohort = [
  { name: 'Tina', role: 'Marketing', school: 'Skidmore College' },
  { name: 'Phuong Linh', role: 'Legacy', school: 'Minerva University' },
  { name: 'Kim Ha', role: 'Legacy / Marketing', school: 'UC Irvine' },
  { name: 'Vanessa', role: 'Finance', school: 'Purdue University' },
  { name: 'Tiffany', role: 'AI Product', school: 'UMich Ann Arbor' },
]

const products = [
  {
    name: 'MLV Ignite',
    tag: 'FLAGSHIP',
    description: '2-week intensive bootcamp. Students build real ventures with expert mentorship, ending with a live pitch day.',
    price: '$650 / student',
  },
  {
    name: 'MLV Sprint',
    tag: 'GATEWAY',
    description: '3-day entrepreneurship conference. Fast-paced intro to startup thinking, accessible entry point to MLV.',
    price: '$50 / student',
  },
  {
    name: 'Intern Capstone',
    tag: 'YOUR PROJECT',
    description: 'Founder-supported product built by YOU. Designed to generate revenue while giving you real ownership.',
    price: 'Goal: $50K revenue',
  },
  {
    name: 'MLV AI Co-Pilot',
    tag: '2026 FOCUS',
    description: 'AI-powered learning companion. Guides students through startup fundamentals with personalized feedback.',
    price: '1000 MAU target',
  },
]

export default function ProgramOverview() {
  return (
    <section id="program" className="py-20 sm:py-28 bg-dark-pure relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(106,198,112,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(106,198,112,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* What is MLV */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What is MLV?</h2>
          <p className="text-gray-400 text-lg max-w-3xl mb-8">
            Ambitious students in Asia lack affordable, accessible entrepreneurship education. 
            Programs like Launch cost $10,000+ and are US-focused.
          </p>
          <p className="text-gray-300 text-lg max-w-3xl">
            <span className="text-brand-green font-medium">Our solution:</span> Hands-on entrepreneurship programs 
            for high school students across Asia at a fraction of the cost, taught by people who understand 
            both US and Asian markets.
          </p>
        </motion.div>

        {/* 2026 Cohort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-white mb-2">2026 PM Associate Class</h3>
          <p className="text-gray-500 mb-6">Hong Kong • Ho Chi Minh City • Hanoi</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {cohort.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-dark-card/50 border border-brand-green/10 rounded-xl p-4 text-center"
              >
                <div className="w-12 h-12 bg-brand-green/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-brand-green font-bold text-lg">{person.name[0]}</span>
                </div>
                <p className="text-white font-medium text-sm">{person.name}</p>
                <p className="text-brand-green text-xs mt-1">{person.role}</p>
                <p className="text-gray-500 text-xs mt-1">{person.school}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Product Verticals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">What MLV Offers</h3>
          <p className="text-gray-500 mb-6">Product verticals you&apos;ll work on</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {products.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-dark-card/30 border border-brand-green/10 rounded-xl p-5 hover:border-brand-green/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-white font-semibold">{product.name}</h4>
                  <span className="text-xs px-2 py-1 bg-brand-yellow/10 text-brand-yellow rounded-full">
                    {product.tag}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{product.description}</p>
                <p className="text-brand-green text-sm font-medium">{product.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 2026 Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-6">2026 Vision</h3>
          <p className="text-gray-400 mb-8">Scale through technology, lead through community</p>
          
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div>
              <div className="text-3xl font-bold text-brand-green">$100K</div>
              <div className="text-xs text-gray-500 mt-1">Revenue Goal</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-yellow">50+</div>
              <div className="text-xs text-gray-500 mt-1">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">10M+</div>
              <div className="text-xs text-gray-500 mt-1">Impressions</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
