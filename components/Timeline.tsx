'use client'

import { motion } from 'framer-motion'

const phases = [
  {
    phase: '01',
    name: 'Shadow',
    period: 'Jan — Mar',
    commitment: '4-6 hrs/week',
    location: 'Remote',
    items: ['Weekly team calls', 'Shadow all departments', 'Support MLV Sprint'],
  },
  {
    phase: '02',
    name: 'Scope',
    period: 'Apr — May',
    commitment: '4-6 hrs/week',
    location: 'Remote',
    items: ['Define capstone project', 'Customer discovery', 'Finalize GTM plan'],
  },
  {
    phase: '03',
    name: 'Execute',
    period: 'Jun — Aug',
    commitment: 'Full-time',
    location: 'Asia',
    items: ['Build & launch MVP', 'Support Ignite programs', 'Hit $50K revenue goal'],
  },
]

export default function Timeline() {
  return (
    <section id="timeline" className="py-24 bg-[#0f0f0f]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-sm font-medium text-[#6AC670] uppercase tracking-wider mb-4">Timeline</h2>
          <p className="text-2xl sm:text-3xl text-white font-light">
            Three phases over eight months
          </p>
        </motion.div>

        <div className="space-y-6">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-[#111] rounded-xl border border-[#1a1a1a]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                {/* Phase number */}
                <div className="flex-shrink-0">
                  <span className="text-[#333] text-4xl font-light">{phase.phase}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-xl text-white font-medium">{phase.name}</h3>
                      <p className="text-[#6AC670] text-sm">{phase.period}</p>
                    </div>
                    <div className="flex gap-4 mt-2 sm:mt-0 text-xs text-[#555]">
                      <span>{phase.commitment}</span>
                      <span>•</span>
                      <span>{phase.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {phase.items.map((item, j) => (
                      <span 
                        key={j} 
                        className="px-3 py-1.5 bg-[#1a1a1a] text-[#888] text-sm rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summer highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 bg-gradient-to-r from-[#6AC670]/5 to-transparent rounded-xl border border-[#6AC670]/20"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white font-medium mb-1">Summer Revenue Target</p>
              <p className="text-[#666] text-sm">$50K Legacy + $50K Capstone</p>
            </div>
            <div className="text-3xl font-semibold text-[#6AC670]">$100K</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
