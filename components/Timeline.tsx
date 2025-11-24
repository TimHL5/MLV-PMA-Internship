'use client'

import { motion } from 'framer-motion'

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
    deliverable: 'Final revenue report + Operational playbook + Team presentation',
    revenueGoal: 'Achieve revenue targets and demonstrate sustainable model',
  },
]

// Timeline Card Component
function TimelineCard({
  item,
  index,
}: {
  item: typeof timelineData[0]
  index: number
}) {
  const isGreen = item.phaseColor === 'green'
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative flex items-start gap-4 md:gap-8 mb-8 md:mb-12"
    >
      {/* Timeline dot and connector */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div
          className={`relative z-10 w-4 h-4 md:w-5 md:h-5 rounded-full flex-shrink-0 ${
            isGreen ? 'bg-primary' : 'bg-secondary'
          }`}
          style={{
            boxShadow: isGreen
              ? '0 0 20px rgba(106, 198, 112, 0.5)'
              : '0 0 20px rgba(242, 207, 7, 0.5)',
          }}
        />
        {/* Connector line (horizontal) */}
        <div
          className="hidden md:block absolute left-[10px] top-[10px] w-8 h-[2px]"
          style={{
            background: isGreen
              ? 'linear-gradient(90deg, #6AC670, rgba(106, 198, 112, 0.3))'
              : 'linear-gradient(90deg, #F2CF07, rgba(242, 207, 7, 0.3))',
          }}
        />
      </div>

      {/* Card */}
      <div
        className="flex-1 rounded-xl p-5 md:p-6 lg:p-8 backdrop-blur-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${isGreen ? 'rgba(106, 198, 112, 0.3)' : 'rgba(242, 207, 7, 0.3)'}`,
        }}
      >
        {/* Card Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            {/* Month and Year */}
            <h3
              className="text-2xl md:text-3xl lg:text-4xl font-bold inline"
              style={{
                background: 'linear-gradient(135deg, #6AC670, #F2CF07)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {item.month}
            </h3>
            <span className="text-gray-500 text-base md:text-lg ml-2">{item.year}</span>
          </div>

          {/* Phase Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider ${
              isGreen
                ? 'bg-primary text-dark-pure'
                : 'bg-secondary text-dark-pure'
            }`}
          >
            {item.phase}
          </span>
        </div>

        {/* Milestone */}
        <h4 className="text-lg md:text-xl font-semibold text-white mb-4">
          {item.milestone}
          <div
            className="h-0.5 mt-2 w-24"
            style={{
              background: isGreen
                ? 'linear-gradient(90deg, #6AC670, transparent)'
                : 'linear-gradient(90deg, #F2CF07, transparent)',
            }}
          />
        </h4>

        {/* Activities */}
        <ul className="space-y-2 md:space-y-3 mb-5">
          {item.activities.map((activity, i) => (
            <li key={i} className="flex items-start gap-2 md:gap-3">
              <svg
                className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5 ${
                  isGreen ? 'text-primary' : 'text-secondary'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-400 text-sm md:text-base">{activity}</span>
            </li>
          ))}
        </ul>

        {/* Key Focus (Spring months) */}
        {item.keyFocus && !item.deliverable && (
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isGreen
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-secondary/20 text-secondary border border-secondary/30'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Key Focus: {item.keyFocus}
          </div>
        )}

        {/* Note (for May) */}
        {item.note && (
          <div className="mb-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
            <p className="text-secondary text-sm italic">{item.note}</p>
          </div>
        )}

        {/* Deliverable (Summer months) */}
        {item.deliverable && (
          <div className="mb-3 p-3 md:p-4 rounded-lg bg-secondary/10 border border-secondary/30">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold">Deliverable</span>
            </div>
            <p className="text-white text-sm md:text-base">{item.deliverable}</p>
          </div>
        )}

        {/* Revenue Goal (Summer months) */}
        {item.revenueGoal && (
          <div className="p-3 md:p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-secondary/30">
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
  )
}

export default function Timeline() {
  return (
    <section id="timeline" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-40 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-40 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
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
            From observer to entrepreneur. Your complete journey unfolds below.
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

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div
            className="absolute left-[7px] md:left-[9px] top-0 bottom-0 w-[3px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, #6AC670 0%, #6AC670 50%, #F2CF07 50%, #F2CF07 100%)',
            }}
          />

          {/* Timeline Cards */}
          <div className="relative">
            {timelineData.map((item, index) => (
              <TimelineCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

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
