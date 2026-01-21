'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const cohort = [
  { 
    name: 'Tina', 
    role: 'Marketing', 
    school: 'Skidmore',
    image: '/tina.jpeg',
    linkedin: 'https://www.linkedin.com/in/tina-nguyen-9a6537326/'
  },
  { 
    name: 'Phuong Linh', 
    role: 'Legacy', 
    school: 'Minerva',
    image: '/linh.jpeg',
    linkedin: 'https://www.linkedin.com/in/phuong-linh-nguyen-/'
  },
  { 
    name: 'Kim Ha', 
    role: 'Legacy', 
    school: 'UC Irvine',
    image: '/kim.jpeg',
    linkedin: 'https://www.linkedin.com/in/kim-ha-trann/'
  },
  { 
    name: 'Vanessa', 
    role: 'Finance', 
    school: 'Purdue',
    image: '/vanessa.jpeg',
    linkedin: 'https://www.linkedin.com/in/vanessa-chan-1a0383232/'
  },
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
          
          <div className="grid grid-cols-4 gap-6">
            {cohort.map((person, i) => (
              <motion.a
                key={person.name}
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 overflow-hidden border-2 border-[#222] group-hover:border-[#6AC670] transition-colors">
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white text-sm font-medium group-hover:text-[#6AC670] transition-colors">{person.name}</p>
                <p className="text-[#555] text-xs mt-0.5">{person.role}</p>
              </motion.a>
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
