'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const timelineData = [
  {
    id: 'jan',
    month: 'January',
    year: '2026',
    phase: 'Spring Shadowing',
    phaseColor: 'green',
    milestone: 'Program Kickoff & Sprint Immersion',
    activities: [
      'Participate in MLV Sprint (Jan 9-11) as observer',
      'Shadow Operations Leads during live event execution',
      'Learn customer engagement and event logistics',
      'Study MLV\'s business model and product ecosystem',
    ],
    keyFocus: 'Understanding MLV\'s target audience and culture',
  },
  {
    id: 'feb',
    month: 'February',
    year: '2026',
    phase: 'Spring Shadowing',
    phaseColor: 'green',
    milestone: 'Ignite Preparation Begins',
    activities: [
      'Work with Operations Leads on Summer Virtual Ignite planning',
      'Help identify new customer acquisition funnels',
      'Shadow speaker outreach and instructor recruitment process',
      'Assist with market research for virtual program positioning',
    ],
    keyFocus: 'Customer acquisition strategies and operational workflows',
  },
  {
    id: 'mar',
    month: 'March',
    year: '2026',
    phase: 'Spring Shadowing',
    phaseColor: 'green',
    milestone: 'Marketing & Customer Discovery',
    activities: [
      'Support Ops Leads with marketing campaign development',
      'Help analyze customer feedback and pain points',
      'Assist with social media content planning',
      'Shadow pricing strategy and financial modeling discussions',
    ],
    keyFocus: 'Understanding MLV\'s go-to-market approach',
  },
  {
    id: 'apr',
    month: 'April',
    year: '2026',
    phase: 'Spring Shadowing',
    phaseColor: 'green',
    milestone: 'Operations Deep Dive',
    activities: [
      'Assist Ops Leads with Ignite pre-launch operations',
      'Help coordinate instructor onboarding and scheduling',
      'Support student recruitment and application processing',
      'Begin brainstorming capstone project ideas',
    ],
    keyFocus: 'End-to-end program operations and preparation for summer',
  },
  {
    id: 'may',
    month: 'May',
    year: '2026',
    phase: 'Summer Capstone',
    phaseColor: 'yellow',
    milestone: 'Capstone Ideation & Validation',
    activities: [
      'Brainstorm entrepreneurial project initiatives under MLV brand',
      'Conduct customer discovery in your home cities',
      'Validate project idea with target audience interviews',
      'Recruit non-TA Brand Ambassadors to join your team at city hubs',
    ],
    keyFocus: 'Customer discovery and team building in your home city',
    deliverable: 'Validated capstone project proposal with initial customer research',
    note: 'Full-time begins - Selected TAs and Ops Leads focus on running Ignite Summer 2026',
  },
  {
    id: 'jun',
    month: 'June',
    year: '2026',
    phase: 'Summer Capstone',
    phaseColor: 'yellow',
    milestone: 'Build MVP & Recruit Team',
    activities: [
      'Onboard Brand Ambassadors at each city hub for operations and marketing',
      'Build MVP (product, curriculum, or service offering)',
      'Create go-to-market strategy and marketing materials',
      'Set up operations infrastructure (payments, CRM, communications)',
    ],
    keyFocus: 'Building and preparing for launch',
    deliverable: 'MVP ready to launch + Brand Ambassador team activated',
    revenueGoal: 'Begin customer acquisition',
  },
  {
    id: 'jul',
    month: 'July',
    year: '2026',
    phase: 'Summer Capstone',
    phaseColor: 'yellow',
    milestone: 'Launch & Customer Acquisition',
    activities: [
      'Launch capstone project in your cities',
      'Lead Brand Ambassador team in marketing and outreach campaigns',
      'Drive customer acquisition through multiple channels',
      'Iterate based on early customer feedback',
    ],
    keyFocus: 'Execution and customer acquisition',
    deliverable: 'First paying customers + refined product offering',
    revenueGoal: 'Generate measurable revenue and track unit economics',
  },
  {
    id: 'aug',
    month: 'August',
    year: '2026',
    phase: 'Summer Capstone',
    phaseColor: 'yellow',
    milestone: 'Scale & Optimize',
    activities: [
      'Optimize operations based on performance data',
      'Scale customer acquisition efforts',
      'Track financial performance (revenue, CAC, profitability)',
      'Prepare final presentation and operational handoff',
    ],
    keyFocus: 'Scaling and demonstrating sustainable model',
    deliverable: 'Final revenue report + Operational playbook + Team presentation',
    revenueGoal: 'Achieve revenue targets and demonstrate sustainable model',
  },
]

// Interactive Timeline Card Component
function TimelineCard({
  item,
  index,
  isExpanded,
  onToggle,
}: {
  item: typeof timelineData[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const isGreen = item.phaseColor === 'green'

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="mb-4"
    >
      <div
        className={`
          border rounded-xl overflow-hidden cursor-pointer transition-all duration-300
          ${isExpanded
            ? 'border-2 shadow-[0_0_30px_rgba(106,198,112,0.3)]'
            : 'border hover:border-opacity-60'
          }
        `}
        style={{
          borderColor: isExpanded
            ? (isGreen ? '#6AC670' : '#F2CF07')
            : (isGreen ? 'rgba(106, 198, 112, 0.4)' : 'rgba(242, 207, 7, 0.4)'),
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
        }}
        onClick={onToggle}
      >
        {/* Collapsed View - Always Visible */}
        <div className="p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Month Badge */}
            <div
              className="px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold text-base md:text-lg"
              style={{
                backgroundColor: isGreen ? 'rgba(106, 198, 112, 0.2)' : 'rgba(242, 207, 7, 0.2)',
                color: isGreen ? '#6AC670' : '#F2CF07',
              }}
            >
              {item.month}
            </div>

            {/* Milestone */}
            <div className="hidden sm:block">
              <h3 className="text-white font-bold text-lg md:text-xl mb-1">
                {item.milestone}
              </h3>
              <p className="text-gray-400 text-sm">
                {item.phase} • {item.year}
              </p>
            </div>
          </div>

          {/* Mobile milestone */}
          <div className="sm:hidden flex-1 ml-3">
            <h3 className="text-white font-bold text-sm leading-tight">
              {item.milestone}
            </h3>
          </div>

          {/* Expand/Collapse Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-400 flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>

        {/* Expanded View - Animated */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className="px-4 md:px-6 pb-6 border-t"
                style={{ borderColor: isGreen ? 'rgba(106, 198, 112, 0.2)' : 'rgba(242, 207, 7, 0.2)' }}
              >
                {/* Note (for May) */}
                {item.note && (
                  <div className="mt-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                    <p className="text-secondary text-sm italic">{item.note}</p>
                  </div>
                )}

                {/* Activities */}
                <div className="mt-4 md:mt-6">
                  <h4 className="text-white font-semibold mb-3">What You&apos;ll Do:</h4>
                  <ul className="space-y-2">
                    {item.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span style={{ color: isGreen ? '#6AC670' : '#F2CF07' }}>✓</span>
                        <span className="text-gray-300 text-sm md:text-base">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Focus */}
                {item.keyFocus && (
                  <div
                    className="mt-4 md:mt-6 p-4 rounded-lg"
                    style={{ backgroundColor: isGreen ? 'rgba(106, 198, 112, 0.1)' : 'rgba(242, 207, 7, 0.1)' }}
                  >
                    <p className="text-sm font-semibold mb-1" style={{ color: isGreen ? '#6AC670' : '#F2CF07' }}>
                      KEY FOCUS:
                    </p>
                    <p className="text-white text-sm md:text-base">{item.keyFocus}</p>
                  </div>
                )}

                {/* Deliverable (Summer months) */}
                {item.deliverable && (
                  <div
                    className="mt-4 p-4 rounded-lg border"
                    style={{
                      backgroundColor: isGreen ? 'rgba(106, 198, 112, 0.05)' : 'rgba(242, 207, 7, 0.05)',
                      borderColor: isGreen ? 'rgba(106, 198, 112, 0.3)' : 'rgba(242, 207, 7, 0.3)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4" style={{ color: isGreen ? '#6AC670' : '#F2CF07' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: isGreen ? '#6AC670' : '#F2CF07' }}>
                        Deliverable
                      </span>
                    </div>
                    <p className="text-white text-sm md:text-base">{item.deliverable}</p>
                  </div>
                )}

                {/* Revenue Goal (Summer months) */}
                {item.revenueGoal && (
                  <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-secondary/30">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs uppercase tracking-wider text-secondary font-semibold">Revenue Goal</span>
                    </div>
                    <p className="text-white text-sm md:text-base">{item.revenueGoal}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function Timeline() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleCard = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section id="timeline" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-40 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-40 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Your Journey
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="text-white">8 Months of </span>
            <span className="gradient-text">Transformation</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-8">
            From observer to entrepreneur. Click any month to explore the details.
          </p>

          {/* Phase Legend */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-gray-400 text-xs sm:text-sm">Spring Shadowing (Jan-Apr)</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-gray-400 text-xs sm:text-sm">Summer Capstone (May-Aug)</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Interactive Timeline Cards */}
        <div className="space-y-0">
          {timelineData.map((item, index) => (
            <TimelineCard
              key={item.id}
              item={item}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => toggleCard(index)}
            />
          ))}
        </div>

        {/* Helper Text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Click any month to expand details
        </motion.p>

        {/* End marker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mt-8"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #6AC670, #F2CF07)',
            }}
          >
            <svg className="w-6 h-6 text-dark-pure" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm mt-4"
        >
          Program Complete — Launch Your Career
        </motion.p>
      </div>
    </section>
  )
}
