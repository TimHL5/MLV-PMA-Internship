'use client'

import { motion } from 'framer-motion'

export default function Compensation() {
  return (
    <section id="compensation" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-sm font-medium text-[#6AC670] uppercase tracking-wider mb-4">Compensation</h2>
          <p className="text-2xl sm:text-3xl text-white font-light">
            Earn while you build
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 bg-[#111] rounded-xl border border-[#1a1a1a]"
          >
            <div className="text-3xl font-semibold text-white mb-2">5-10%</div>
            <p className="text-[#888] text-sm mb-4">Revenue share</p>
            <p className="text-[#555] text-sm">
              Percentage of revenue you generate from capstone and contributions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-[#111] rounded-xl border border-[#1a1a1a]"
          >
            <div className="text-3xl mb-2">🏠</div>
            <p className="text-[#888] text-sm mb-4">Accommodation</p>
            <p className="text-[#555] text-sm">
              Housing during office weeks in HCMC and at the Mansion
            </p>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#444] text-sm mt-8 text-center"
        >
          Spring phase (Jan-May) is unpaid and learning-focused
        </motion.p>
      </div>
    </section>
  )
}
