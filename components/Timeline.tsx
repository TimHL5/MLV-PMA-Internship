'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const timelineData = [
  {
    month: 'January',
    year: '2026',
    phase: 'Spring',
    milestone: 'Onboarding & Sprint Immersion',
    icon: '🚀',
    color: 'from-primary to-accent-cyan',
    activities: [
      'Participate in MLV Sprint (Jan 9-11) as observer',
      'Shadow event logistics and student engagement',
      'Study MLV\'s business model and past program data',
    ],
    deliverable: '"What I Learned" deck on Sprint execution',
  },
  {
    month: 'February',
    year: '2026',
    phase: 'Spring',
    milestone: 'Virtual Ignite Planning',
    icon: '💡',
    color: 'from-accent-cyan to-primary',
    activities: [
      'Join weekly Ignite planning meetings',
      'Shadow speaker outreach process',
      'Study customer discovery and feedback',
    ],
    deliverable: 'Competitive analysis of 3 similar programs',
  },
  {
    month: 'March',
    year: '2026',
    phase: 'Spring',
    milestone: 'Marketing & Growth',
    icon: '📈',
    color: 'from-primary to-accent-pink',
    activities: [
      'Join marketing strategy sessions',
      'Shadow social media content creation',
      'Learn pricing strategy and financial modeling',
    ],
    deliverable: 'Growth experiment proposal for your city',
  },
  {
    month: 'April',
    year: '2026',
    phase: 'Spring',
    milestone: 'Operations & Execution',
    icon: '⚙️',
    color: 'from-accent-pink to-primary',
    activities: [
      'Participate in Ignite pre-launch planning',
      'Shadow student onboarding workflows',
      'Observe crisis management',
    ],
    deliverable: 'Operations playbook for one aspect of MLV',
  },
  {
    month: 'May',
    year: '2026',
    phase: 'Spring',
    milestone: 'Synthesis & Ideation',
    icon: '🎯',
    color: 'from-primary to-secondary',
    activities: [
      'Reflection and learning synthesis',
      'Brainstorm new initiative ideas',
      'Conduct preliminary customer research',
    ],
    deliverable: 'Present 3 validated initiative ideas',
  },
  {
    month: 'June',
    year: '2026',
    phase: 'Summer',
    milestone: 'Discovery Phase',
    icon: '🔍',
    color: 'from-secondary to-accent-pink',
    activities: [
      'Conduct 20+ customer interviews',
      'Map competitive landscape',
      'Define value proposition and scope MVP',
    ],
    deliverable: 'Market segmentation + Lean canvas + Financial model',
  },
  {
    month: 'July',
    year: '2026',
    phase: 'Summer',
    milestone: 'Build & GTM',
    icon: '🏗️',
    color: 'from-accent-pink to-secondary',
    activities: [
      'Build MVP (landing page, curriculum, pricing)',
      'Launch marketing campaigns',
      'Recruit HS brand ambassadors',
    ],
    deliverable: 'First 10 paying customers + Marketing dashboard',
  },
  {
    month: 'August',
    year: '2026',
    phase: 'Summer',
    milestone: 'Scale & Optimize',
    icon: '🎉',
    color: 'from-secondary to-accent-cyan',
    activities: [
      'Deliver actual program to customers',
      'Track NPS and satisfaction',
      'Analyze performance data',
    ],
    deliverable: 'Final presentation + Revenue report + Operational playbook',
  },
]

// Timeline Card Component
function TimelineCard({
  item,
  index,
  isLeft,
}: {
  item: typeof timelineData[0]
  index: number
  isLeft: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`relative w-full md:w-[calc(50%-40px)] ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}
    >
      <div
        className={`glass-card glass-card-hover p-6 md:p-8 relative overflow-hidden group ${
          item.phase === 'Summer' ? 'border-secondary/20' : ''
        }`}
      >
        {/* Glow effect on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
        />

        {/* Phase badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
          item.phase === 'Summer'
            ? 'bg-secondary/20 text-secondary'
            : 'bg-primary/20 text-primary'
        }`}>
          {item.phase}
        </div>

        {/* Icon and Month */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl`}
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {item.icon}
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-white">{item.month}</h3>
            <p className="text-gray-500 text-sm">{item.year}</p>
          </div>
        </div>

        {/* Milestone */}
        <h4 className={`text-xl font-semibold mb-4 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
          {item.milestone}
        </h4>

        {/* Activities */}
        <ul className="space-y-3 mb-6">
          {item.activities.map((activity, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-start gap-3 text-gray-400"
            >
              <svg
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  item.phase === 'Summer' ? 'text-secondary' : 'text-primary'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{activity}</span>
            </motion.li>
          ))}
        </ul>

        {/* Deliverable */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className={`p-4 rounded-xl bg-gradient-to-r ${item.color} bg-opacity-10 border ${
            item.phase === 'Summer' ? 'border-secondary/20' : 'border-primary/20'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs uppercase tracking-wider text-gray-400">Deliverable</span>
          </div>
          <p className="text-white font-medium">{item.deliverable}</p>
        </motion.div>
      </div>

      {/* Connection dot */}
      <div
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-dark ${
          item.phase === 'Summer' ? 'bg-secondary' : 'bg-primary'
        } ${isLeft ? '-right-3' : '-left-3'}`}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 0 0 ${item.phase === 'Summer' ? 'rgba(255, 107, 53, 0.4)' : 'rgba(124, 58, 237, 0.4)'}`,
              `0 0 0 10px ${item.phase === 'Summer' ? 'rgba(255, 107, 53, 0)' : 'rgba(124, 58, 237, 0)'}`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  )
}

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-dark" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Your Journey
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">8 Months of </span>
            <span className="gradient-text">Transformation</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            From observer to entrepreneur. Follow the path that will transform your
            understanding of startups and launch your own venture.
          </p>
        </motion.div>

        {/* Phase indicators */}
        <div className="flex justify-center gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="w-4 h-4 rounded-full bg-primary" />
            <span className="text-gray-400">Spring Shadowing</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-4 h-4 rounded-full bg-secondary" />
            <span className="text-gray-400">Summer Capstone</span>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line - desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-dark-lighter -translate-x-1/2">
            <motion.div
              className="w-full timeline-line"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Mobile line */}
          <div className="md:hidden absolute left-4 top-0 bottom-0 w-1 bg-dark-lighter">
            <motion.div
              className="w-full timeline-line"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Timeline cards */}
          <div className="space-y-8 md:space-y-16">
            {timelineData.map((item, index) => (
              <div
                key={item.month}
                className={`relative flex ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}
              >
                {/* Mobile dot */}
                <div className="md:hidden absolute left-4 top-10 -translate-x-1/2">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      item.phase === 'Summer' ? 'bg-secondary' : 'bg-primary'
                    }`}
                  />
                </div>

                <div className="ml-10 md:ml-0 flex-1">
                  <TimelineCard
                    item={item}
                    index={index}
                    isLeft={index % 2 === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* End marker */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mt-16"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-secondary to-accent-pink flex items-center justify-center text-2xl">
              🎓
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-secondary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 mt-6"
        >
          Program Completion - You&apos;re now an entrepreneur!
        </motion.p>
      </div>
    </section>
  )
}
