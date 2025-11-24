'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const applicationSteps = [
  {
    step: 1,
    title: 'Submit Application',
    date: 'Deadline: TBA',
    icon: '📝',
    description: 'Complete the online application form with your information and materials.',
  },
  {
    step: 2,
    title: 'Initial Review',
    date: '1-2 weeks',
    icon: '🔍',
    description: 'Our team reviews all applications and shortlists candidates.',
  },
  {
    step: 3,
    title: 'Video Interview',
    date: '30 minutes',
    icon: '🎥',
    description: 'Selected candidates complete a video interview with our team.',
  },
  {
    step: 4,
    title: 'Case Study',
    date: '48 hours',
    icon: '📊',
    description: 'Finalists complete a short case study to demonstrate thinking.',
  },
  {
    step: 5,
    title: 'Final Decision',
    date: 'December 2025',
    icon: '🎉',
    description: 'Offers extended to successful candidates.',
  },
]

const applicationRequirements = [
  {
    title: 'Video Introduction',
    icon: '🎬',
    description: '2-minute video telling us who you are and why you\'re excited about this program.',
    tips: ['Be authentic', 'Show your personality', 'Explain your "why"'],
  },
  {
    title: 'Written Responses',
    icon: '✍️',
    description: 'Short answers to questions about your experience, goals, and problem-solving approach.',
    tips: ['Be specific', 'Use examples', 'Keep it concise'],
  },
  {
    title: 'LinkedIn Profile',
    icon: '💼',
    description: 'Updated LinkedIn profile showcasing your experiences and interests.',
    tips: ['Complete profile', 'Recent photo', 'Highlight relevant work'],
  },
  {
    title: 'Resume/CV',
    icon: '📄',
    description: 'One-page resume highlighting your relevant experiences and skills.',
    tips: ['Clear format', 'Quantify impact', 'Tailor to role'],
  },
]

// Expandable Card Component
function RequirementCard({
  requirement,
  index,
  isExpanded,
  onToggle,
}: {
  requirement: typeof applicationRequirements[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-primary/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{requirement.icon}</span>
          <div>
            <h4 className="text-lg font-semibold text-white">{requirement.title}</h4>
            <p className="text-gray-400 text-sm mt-1">{requirement.description}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-4"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-gray-800 pt-4">
            <p className="text-sm text-gray-400 mb-3">Tips for success:</p>
            <ul className="space-y-2">
              {requirement.tips.map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ApplicationProcess() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  return (
    <section
      id="application"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-dark-lighter" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      {/* Gradient orbs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

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
            How to Apply
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Application </span>
            <span className="gradient-text-orange">Process</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Ready to start your entrepreneurial journey? Here&apos;s everything you need
            to know about our application process.
          </p>
        </motion.div>

        {/* Horizontal Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          {/* Desktop horizontal timeline */}
          <div className="hidden lg:block relative">
            {/* Timeline line */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-dark">
              <motion.div
                className="h-full bg-gradient-to-r from-secondary via-accent-pink to-primary"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>

            <div className="grid grid-cols-5 gap-4">
              {applicationSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Step icon */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-accent-pink flex items-center justify-center text-2xl mb-4 relative z-10"
                    >
                      {step.icon}
                    </motion.div>

                    {/* Connector dot */}
                    <div className="w-4 h-4 rounded-full bg-secondary border-4 border-dark-lighter relative z-10" />

                    {/* Content */}
                    <div className="text-center mt-6">
                      <span className="text-secondary text-xs font-semibold uppercase tracking-wider">
                        Step {step.step}
                      </span>
                      <h4 className="text-white font-semibold mt-1">{step.title}</h4>
                      <p className="text-gray-500 text-sm mt-1">{step.date}</p>
                      <p className="text-gray-400 text-xs mt-2 max-w-[150px] mx-auto">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="lg:hidden space-y-6">
            {applicationSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent-pink flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  {index < applicationSteps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-secondary to-transparent mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <span className="text-secondary text-xs font-semibold uppercase tracking-wider">
                    Step {step.step} • {step.date}
                  </span>
                  <h4 className="text-white font-semibold mt-1">{step.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Application Requirements */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-white text-center mb-8"
          >
            What You&apos;ll Need to Submit
          </motion.h3>

          <div className="grid md:grid-cols-2 gap-4">
            {applicationRequirements.map((req, index) => (
              <RequirementCard
                key={req.title}
                requirement={req}
                index={index}
                isExpanded={expandedCard === index}
                onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="glass-card p-8 md:p-12 max-w-3xl mx-auto relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10" />

            <div className="relative z-10">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join a community of builders, learners, and future entrepreneurs.
                Applications for the 2026 cohort are now open.
              </p>

              <motion.a
                href="https://forms.gle/example" // Replace with actual form link
                target="_blank"
                rel="noopener noreferrer"
                className="glow-button inline-flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Start Your Application</span>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.a>

              <p className="text-gray-500 text-sm mt-6">
                Questions? Check the FAQs below or reach out to us directly.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
