'use client'

import { useState, useRef, useEffect } from 'react'
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
      'Participate in MLV Sprint (Jan 9-11, 2026) as observer',
      'Shadow Operations Leads during live event execution',
      'Learn customer engagement and event logistics',
      'Begin studying MLV\'s business model and product ecosystem',
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
      'Conduct customer discovery in your home cities (HK, HCMC, Hanoi, Singapore)',
      'Validate project idea with target audience interviews',
      'Recruit non-TA Brand Ambassadors to join your team at city hubs',
    ],
    keyFocus: 'Full-time begins - Selected TAs and Ops Leads focus on running Ignite Summer 2026',
    deliverable: 'Validated capstone project proposal with initial customer research',
  },
  {
    id: 'jun',
    month: 'June',
    year: '2026',
    phase: 'Summer Capstone',
    phaseColor: 'yellow',
    milestone: 'Build MVP & Recruit Team',
    activities: [
      'Onboard Brand Ambassadors at each city hub for operations and marketing support',
      'Build MVP (product, curriculum, or service offering)',
      'Create go-to-market strategy and marketing materials',
      'Set up operations infrastructure (payments, CRM, communications)',
    ],
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
    deliverable: 'Final revenue report + Operational playbook for future scalability + Team presentation',
    revenueGoal: 'Achieve revenue targets and demonstrate sustainable model',
  },
]

// Accordion Card Component
function TimelineCard({
  item,
  isExpanded,
  onToggle,
  index,
}: {
  item: typeof timelineData[0]
  isExpanded: boolean
  onToggle: () => void
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isGreen = item.phaseColor === 'green'

  useEffect(() => {
    if (isExpanded && cardRef.current) {
      // Scroll card into view on mobile
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    }
  }, [isExpanded])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="w-full lg:w-auto"
    >
      <motion.button
        onClick={onToggle}
        className={`relative w-full lg:w-[140px] xl:w-[150px] overflow-hidden rounded-xl transition-all duration-300 ${
          isExpanded ? 'lg:w-[500px] xl:w-[550px]' : ''
        }`}
        whileHover={{ scale: isExpanded ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: 'rgba(26, 26, 46, 0.9)',
        }}
        aria-expanded={isExpanded}
        aria-label={`${item.month} ${item.year} - ${isExpanded ? 'Click to collapse' : 'Click to expand'}`}
      >
        {/* Gradient border */}
        <div
          className={`absolute inset-0 rounded-xl p-[1px] transition-all duration-300 ${
            isExpanded ? 'p-[2px]' : ''
          }`}
          style={{
            background: isGreen
              ? 'linear-gradient(135deg, #6AC670, #F2CF07)'
              : 'linear-gradient(135deg, #F2CF07, #6AC670)',
            opacity: isExpanded ? 1 : 0.5,
          }}
        >
          <div className="w-full h-full rounded-xl bg-[#1a1a2e]" />
        </div>

        {/* Glow effect when expanded */}
        {isExpanded && (
          <div
            className="absolute inset-0 rounded-xl opacity-30 blur-xl"
            style={{
              background: isGreen
                ? 'linear-gradient(135deg, #6AC670, #F2CF07)'
                : 'linear-gradient(135deg, #F2CF07, #6AC670)',
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 p-4 lg:p-5">
          {/* Collapsed State */}
          <div className={`flex items-center justify-between lg:flex-col lg:items-center lg:text-center ${isExpanded ? 'lg:hidden' : ''}`}>
            <div className="flex items-center gap-3 lg:flex-col lg:gap-1">
              <h3
                className="text-xl lg:text-2xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #6AC670, #F2CF07)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {item.month.slice(0, 3)}
              </h3>
              <span className="text-gray-500 text-sm">{item.year}</span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="lg:mt-2"
            >
              <svg
                className={`w-5 h-5 ${isGreen ? 'text-primary' : 'text-secondary'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>

          {/* Expanded State */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                {/* Header with close button */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {/* Phase badge */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${
                        isGreen
                          ? 'bg-primary text-dark-pure'
                          : 'bg-secondary text-dark-pure'
                      }`}
                    >
                      {item.phase}
                    </span>
                    {/* Month and Year */}
                    <h3
                      className="text-2xl lg:text-3xl font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #6AC670, #F2CF07)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {item.month}
                    </h3>
                    <span className="text-gray-500 text-sm">{item.year}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggle()
                    }}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Divider */}
                <div
                  className="h-0.5 mb-4"
                  style={{
                    background: 'linear-gradient(90deg, #6AC670, transparent)',
                  }}
                />

                {/* Milestone */}
                <h4 className="text-lg lg:text-xl font-semibold text-white mb-4">
                  {item.milestone}
                </h4>

                {/* Activities */}
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Key Activities</p>
                  <ul className="space-y-2">
                    {item.activities.map((activity, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-400 text-sm text-left">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Focus */}
                {item.keyFocus && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 mb-3">
                    <p className="text-xs uppercase tracking-wider text-primary mb-1">Key Focus</p>
                    <p className="text-white text-sm text-left">{item.keyFocus}</p>
                  </div>
                )}

                {/* Deliverable */}
                {item.deliverable && (
                  <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs uppercase tracking-wider text-secondary">Deliverable</span>
                    </div>
                    <p className="text-white text-sm text-left">{item.deliverable}</p>
                  </div>
                )}

                {/* Revenue Goal */}
                {item.revenueGoal && (
                  <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-secondary/30">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs uppercase tracking-wider text-secondary">Revenue Goal</span>
                    </div>
                    <p className="text-white text-sm text-left">{item.revenueGoal}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </motion.div>
  )
}

export default function Timeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section id="timeline" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-40 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-40 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Your Journey
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="text-white">8 Months of </span>
            <span className="gradient-text">Transformation</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-6">
            From observer to entrepreneur. Click each month to see your journey.
          </p>

          {/* Phase Legend */}
          <div className="flex justify-center gap-6 sm:gap-8">
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

        {/* Timeline Cards - Accordion Style */}
        {/* Desktop: Horizontal row */}
        <div className="hidden lg:flex justify-center gap-3 flex-wrap">
          {timelineData.map((item, index) => (
            <TimelineCard
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() => handleToggle(item.id)}
              index={index}
            />
          ))}
        </div>

        {/* Mobile/Tablet: Vertical stack */}
        <div className="lg:hidden space-y-3">
          {timelineData.map((item, index) => (
            <TimelineCard
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() => handleToggle(item.id)}
              index={index}
            />
          ))}
        </div>

        {/* Keyboard hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-xs mt-6"
        >
          Click any month to expand • Press Escape to collapse
        </motion.p>
      </div>
    </section>
  )
}
