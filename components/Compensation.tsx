'use client'

import { motion } from 'framer-motion'

export default function Compensation() {
  return (
    <section id="compensation" className="py-20 sm:py-28 bg-dark-pure relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Compensation</h2>
          <p className="text-gray-400">What you get for your work</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Revenue Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-dark-card/50 border border-brand-green/20 rounded-xl p-6"
          >
            <div className="text-4xl font-bold text-brand-green mb-2">5-10%</div>
            <h3 className="text-lg font-semibold text-white mb-2">Revenue Share</h3>
            <p className="text-gray-400 text-sm">
              Percentage of revenue you generate from your capstone project and contributions
            </p>
          </motion.div>

          {/* Accommodation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-dark-card/50 border border-brand-yellow/20 rounded-xl p-6"
          >
            <div className="text-4xl mb-2">🏠</div>
            <h3 className="text-lg font-semibold text-white mb-2">Accommodation Support</h3>
            <p className="text-gray-400 text-sm">
              Housing provided during office immersion weeks in HCMC and at the Mansion
            </p>
          </motion.div>
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Spring shadowing (Jan-May) is unpaid and learning-focused. 
          Compensation applies to summer execution phase.
        </motion.p>
      </div>
    </section>
  )
}
