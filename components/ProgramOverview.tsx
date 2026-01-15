'use client'

import { motion } from 'framer-motion'

const cohort = [
  { name: 'Tina', role: 'Marketing', school: 'Skidmore' },
  { name: 'Phuong Linh', role: 'Legacy', school: 'Minerva' },
  { name: 'Kim Ha', role: 'Legacy', school: 'UC Irvine' },
  { name: 'Vanessa', role: 'Finance', school: 'Purdue' },
  { name: 'Tiffany', role: 'AI Product', school: 'UMich' },
]

const products = [
  {
    name: 'MLV Ignite',
    description: '2-week intensive bootcamp with live pitch day',
    metric: '$650/student',
  },
  {
    name: 'MLV Sprint',
    description: '3-day entrepreneurship conference',
    metric: '$50/student',
  },
  {
    name: 'Capstone Project',
    description: 'Your venture, your ownership',
    metric: '$50K goal',
  },
  {
    name: 'AI Co-Pilot',
    description: 'Personalized learning companion',
    metric: '2026 focus',
  },
]

export default function ProgramOverview() {
  return (
    <section id="program" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6">
        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-sm font-medium text-[#6AC670] uppercase tracking-wider mb-4">About MLV</h2>
          <p className="text-2xl sm:text-3xl text-white font-light leading-relaxed mb-6">
            Hands-on entrepreneurship programs for students across Asia, 
            at a fraction of the cost of US alternatives.
          </p>
          <p className="text-[#666] leading-relaxed">
            We&apos;ve launched 50+ startups, generated $50K+ in revenue, and run 7 program cycles 
            across Hong Kong, Ho Chi Minh City, and Hanoi.
          </p>
        </motion.div>

        {/* 2026 Cohort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h3 className="text-sm font-medium text-[#888] uppercase tracking-wider mb-8">2026 Cohort</h3>
          
          <div className="grid grid-cols-5 gap-4">
            {cohort.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full mx-auto mb-3 flex items-center justify-center border border-[#222]">
                  <span className="text-[#6AC670] font-medium">{person.name[0]}</span>
                </div>
                <p className="text-white text-sm font-medium">{person.name}</p>
                <p className="text-[#555] text-xs mt-0.5">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-sm font-medium text-[#888] uppercase tracking-wider mb-8">What You&apos;ll Build</h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {products.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 bg-[#111] rounded-xl border border-[#1a1a1a] hover:border-[#252525] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-medium">{product.name}</h4>
                  <span className="text-xs text-[#6AC670]">{product.metric}</span>
                </div>
                <p className="text-[#666] text-sm">{product.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
