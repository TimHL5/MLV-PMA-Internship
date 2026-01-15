'use client'

import { motion } from 'framer-motion'

const values = [
  {
    title: 'Speak Your Mind',
    description: 'Give feedback freely. Challenge ideas constructively.',
  },
  {
    title: 'Guidance, Not Control',
    description: 'We set direction, you find the path.',
  },
  {
    title: 'Be An Entrepreneur',
    description: 'Take ownership. Ship fast. Learn faster.',
  },
]

const expectations = [
  'Weekly team calls (Sundays, flexible around exams)',
  'Manage your own sprint cycle',
  'Communicate proactively — no ghosting',
  'Have fun and build real relationships',
]

export default function IdealCandidate() {
  return (
    <section id="culture" className="py-24 bg-[#0f0f0f]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-sm font-medium text-[#6AC670] uppercase tracking-wider mb-4">Values</h2>
          <p className="text-2xl sm:text-3xl text-white font-light mb-12">
            How we work together
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="text-white font-medium mb-2">{value.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Expectations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-sm font-medium text-[#888] uppercase tracking-wider mb-6">Expectations</h3>
          
          <div className="grid sm:grid-cols-2 gap-3">
            {expectations.map((item, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-4 bg-[#111] rounded-lg border border-[#1a1a1a]"
              >
                <div className="w-1.5 h-1.5 bg-[#6AC670] rounded-full flex-shrink-0" />
                <span className="text-[#888] text-sm">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
