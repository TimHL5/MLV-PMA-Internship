'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const timelineData = [
  {
    month: 'January',
    year: '2026',
    phase: 'Spring',
    milestone: 'Onboarding & Sprint Immersion',
    icon: '🚀',
    activities: [
      'Participate in MLV Sprint (Jan 9-11) as observer',
      'Shadow event logistics and student engagement',
      'Study MLV\'s business model and unit economics',
    ],
    deliverable: '"What I Learned" deck on Sprint execution',
  },
  {
    month: 'February',
    year: '2026',
    phase: 'Spring',
    milestone: 'Virtual Ignite Planning',
    icon: '💡',
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
    activities: [
      'Participate in Ignite pre-launch planning',
      'Shadow student onboarding workflows',
      'Observe crisis management in real-time',
    ],
    deliverable: 'Operations playbook for one aspect of MLV',
  },
  {
    month: 'May',
    year: '2026',
    phase: 'Spring',
    milestone: 'Synthesis & Ideation',
    icon: '🎯',
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
    activities: [
      'Deliver actual program to customers',
      'Track NPS and satisfaction metrics',
      'Analyze performance data',
    ],
    deliverable: 'Final presentation + Revenue report + Operational playbook',
  },
]

// Timeline Card Component
function TimelineCard({
  item,
  index,
  activeIndex,
  setActiveIndex,
}: {
  item: typeof timelineData[0]
  index: number
  activeIndex: number
  setActiveIndex: (index: number) => void
}) {
  const isActive = index === activeIndex
  const isSummer = item.phase === 'Summer'

  return (
    <motion.div
      className="scroll-snap-card w-[85vw] sm:w-[380px] md:w-[400px] flex-shrink-0 px-2 sm:px-3"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <motion.div
        className={`relative h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
          isActive ? 'shadow-glow-green' : ''
        }`}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveIndex(index)}
        style={{
          background: isActive
            ? 'rgba(42, 42, 74, 0.9)'
            : 'rgba(42, 42, 74, 0.6)',
        }}
      >
        {/* Gradient border */}
        <div
          className={`absolute inset-0 rounded-2xl p-[2px] transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'opacity-40'
          }`}
          style={{
            background: isSummer
              ? 'linear-gradient(135deg, #F2CF07, #6AC670)'
              : 'linear-gradient(135deg, #6AC670, #F2CF07)',
          }}
        >
          <div className="w-full h-full rounded-2xl bg-dark-card" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-5 sm:p-6 md:p-8">
          {/* Phase badge */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                isSummer
                  ? 'bg-secondary/20 text-secondary'
                  : 'bg-primary/20 text-primary'
              }`}
            >
              {item.phase}
            </span>
            <span className="text-2xl sm:text-3xl">{item.icon}</span>
          </div>

          {/* Month - Large gradient text */}
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-1">
            {item.month}
          </h3>
          <p className="text-gray-500 text-sm mb-4">{item.year}</p>

          {/* Milestone - with green underline */}
          <div className="mb-5">
            <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white inline-block">
              {item.milestone}
            </h4>
            <div
              className="h-0.5 mt-1"
              style={{
                background: 'linear-gradient(90deg, #6AC670, transparent)',
                width: '80%',
              }}
            />
          </div>

          {/* Activities */}
          <ul className="space-y-2 sm:space-y-3 mb-5">
            {item.activities.map((activity, i) => (
              <li key={i} className="flex items-start gap-2 sm:gap-3">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-400 text-xs sm:text-sm">{activity}</span>
              </li>
            ))}
          </ul>

          {/* Deliverable - Yellow highlight badge */}
          <div className="p-3 sm:p-4 rounded-xl bg-secondary/10 border border-secondary/30">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <svg
                className="w-4 h-4 text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
                Deliverable
              </span>
            </div>
            <p className="text-white text-xs sm:text-sm font-medium">{item.deliverable}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Navigation Dots
function NavigationDots({
  total,
  activeIndex,
  setActiveIndex,
}: {
  total: number
  activeIndex: number
  setActiveIndex: (index: number) => void
}) {
  return (
    <div className="flex justify-center gap-2 mt-6 sm:mt-8">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => setActiveIndex(index)}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === activeIndex
              ? 'w-6 sm:w-8 bg-gradient-to-r from-primary to-secondary'
              : index < 5
              ? 'w-2 bg-primary/30 hover:bg-primary/50'
              : 'w-2 bg-secondary/30 hover:bg-secondary/50'
          }`}
          aria-label={`Go to ${timelineData[index].month}`}
        />
      ))}
    </div>
  )
}

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Scroll to card when activeIndex changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth < 640 ? window.innerWidth * 0.85 : window.innerWidth < 768 ? 380 : 400
      const padding = window.innerWidth < 640 ? 16 : 24
      scrollContainerRef.current.scrollTo({
        left: activeIndex * (cardWidth + padding),
        behavior: 'smooth',
      })
    }
  }, [activeIndex])

  // Handle scroll to update activeIndex
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth < 640 ? window.innerWidth * 0.85 : window.innerWidth < 768 ? 380 : 400
      const scrollLeft = scrollContainerRef.current.scrollLeft
      const newIndex = Math.round(scrollLeft / cardWidth)
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < timelineData.length) {
        setActiveIndex(newIndex)
      }
    }
  }

  const scrollPrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1))
  }

  const scrollNext = () => {
    setActiveIndex((prev) => Math.min(timelineData.length - 1, prev + 1))
  }

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
      <div className="absolute top-1/4 -left-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 px-4"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Your Journey
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="text-white">8 Months of </span>
            <span className="gradient-text">Transformation</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
            From observer to entrepreneur. Swipe through the months to see your journey.
          </p>
        </motion.div>

        {/* Phase indicators */}
        <div className="flex justify-center gap-4 sm:gap-8 mb-6 sm:mb-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-gray-400 text-xs sm:text-sm">Spring Shadowing</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-gray-400 text-xs sm:text-sm">Summer Capstone</span>
          </motion.div>
        </div>

        {/* Horizontal scroll container */}
        <div className="relative">
          {/* Desktop Navigation Arrows */}
          <button
            onClick={scrollPrev}
            disabled={activeIndex === 0}
            className={`hidden lg:flex absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-dark-lighter border border-primary/30 items-center justify-center text-white transition-all ${
              activeIndex === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-primary/20 hover:border-primary'
            }`}
            aria-label="Previous month"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            disabled={activeIndex === timelineData.length - 1}
            className={`hidden lg:flex absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-dark-lighter border border-primary/30 items-center justify-center text-white transition-all ${
              activeIndex === timelineData.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-primary/20 hover:border-primary'
            }`}
            aria-label="Next month"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="horizontal-scroll pb-4 px-4 lg:px-16 xl:px-24"
          >
            {/* Spacer for centering first card on desktop */}
            <div className="hidden lg:block w-[calc((100vw-400px)/2-64px)] xl:w-[calc((100vw-400px)/2-96px)] flex-shrink-0" />

            {timelineData.map((item, index) => (
              <TimelineCard
                key={item.month}
                item={item}
                index={index}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            ))}

            {/* Spacer for centering last card on desktop */}
            <div className="hidden lg:block w-[calc((100vw-400px)/2-64px)] xl:w-[calc((100vw-400px)/2-96px)] flex-shrink-0" />
          </div>
        </div>

        {/* Navigation Dots */}
        <NavigationDots
          total={timelineData.length}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />

        {/* Mobile swipe hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex lg:hidden justify-center items-center gap-2 mt-4 text-gray-500 text-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span>Swipe to navigate</span>
        </motion.div>
      </div>
    </section>
  )
}
