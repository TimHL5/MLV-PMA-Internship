'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const springSchedule = {
  totalHours: '5-8 hours/week',
  items: [
    { activity: 'Team Meetings', hours: 1, color: 'bg-primary', description: 'Weekly sync with MLV team' },
    { activity: 'Shadowing Sessions', hours: 2, color: 'bg-accent-cyan', description: 'Observe key operations' },
    { activity: 'Independent Work', hours: 2, color: 'bg-accent-pink', description: 'Deliverables & research' },
    { activity: 'Learning & Reading', hours: 1, color: 'bg-green-500', description: 'Self-paced education' },
    { activity: 'Check-ins', hours: 1, color: 'bg-yellow-500', description: 'Mentor 1:1s' },
  ],
}

const summerSchedule = {
  totalHours: '20-30 hours/week',
  items: [
    { activity: 'Customer Discovery', hours: 6, color: 'bg-secondary', description: 'Interviews & research' },
    { activity: 'Product Building', hours: 8, color: 'bg-accent-pink', description: 'MVP development' },
    { activity: 'Marketing & Sales', hours: 6, color: 'bg-green-500', description: 'Customer acquisition' },
    { activity: 'Team Collaboration', hours: 3, color: 'bg-primary', description: 'Planning & reviews' },
    { activity: 'Admin & Reporting', hours: 2, color: 'bg-yellow-500', description: 'Documentation' },
  ],
}

// Pie Chart Component
function PieChart({ data, isActive }: { data: typeof springSchedule.items; isActive: boolean }) {
  const total = data.reduce((acc, item) => acc + item.hours, 0)
  let currentAngle = -90

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-0">
        {data.map((item, index) => {
          const angle = (item.hours / total) * 360
          const startAngle = currentAngle
          currentAngle += angle

          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
          const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180)
          const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180)

          const largeArc = angle > 180 ? 1 : 0

          return (
            <motion.path
              key={item.activity}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              className={item.color.replace('bg-', 'fill-')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.9 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{ transformOrigin: '50% 50%' }}
            />
          )
        })}
        {/* Inner circle for donut effect */}
        <circle cx="50" cy="50" r="25" className="fill-dark-lighter" />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{total}</div>
          <div className="text-xs text-gray-400">hours/week</div>
        </div>
      </div>
    </div>
  )
}

// Bar Chart Component
function BarChart({ data, isActive }: { data: typeof springSchedule.items; isActive: boolean }) {
  const maxHours = Math.max(...data.map((item) => item.hours))

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <motion.div
          key={item.activity}
          initial={{ opacity: 0, x: -20 }}
          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.3, x: -10 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-300 text-sm">{item.activity}</span>
            <span className="text-white font-medium">{item.hours}h</span>
          </div>
          <div className="h-8 bg-dark rounded-lg overflow-hidden relative">
            <motion.div
              className={`h-full ${item.color} rounded-lg flex items-center`}
              initial={{ width: 0 }}
              animate={isActive ? { width: `${(item.hours / maxHours) * 100}%` } : { width: 0 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.6, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 flex items-center px-3">
              <span className="text-xs text-white/70 group-hover:text-white transition-colors truncate">
                {item.description}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default function WeeklyBreakdown() {
  const [activePhase, setActivePhase] = useState<'spring' | 'summer'>('spring')
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const currentSchedule = activePhase === 'spring' ? springSchedule : summerSchedule

  return (
    <section
      id="schedule"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-dark" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Gradient orbs */}
      <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-20 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Time Commitment
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Weekly </span>
            <span className="gradient-text">Breakdown</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            See how you&apos;ll spend your time each week. Toggle between phases to
            understand the different commitments.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center p-1.5 rounded-full bg-dark-lighter border border-gray-800">
            <button
              onClick={() => setActivePhase('spring')}
              className={`relative px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activePhase === 'spring' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {activePhase === 'spring' && (
                <motion.div
                  layoutId="phaseToggle"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent-cyan rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">Spring Shadowing</span>
            </button>
            <button
              onClick={() => setActivePhase('summer')}
              className={`relative px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activePhase === 'summer' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {activePhase === 'summer' && (
                <motion.div
                  layoutId="phaseToggle"
                  className="absolute inset-0 bg-gradient-to-r from-secondary to-accent-pink rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">Summer Capstone</span>
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <div className="text-center mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-white">{currentSchedule.totalHours}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {activePhase === 'spring' ? 'Flexible alongside classes' : 'Full commitment required'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <PieChart data={currentSchedule.items} isActive={true} />

            {/* Legend */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {currentSchedule.items.map((item) => (
                <div key={item.activity} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-gray-400 text-xs">{item.activity}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bar Chart and Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card p-8 mb-6">
              <h4 className="text-lg font-semibold text-white mb-6">Hours by Activity</h4>
              <BarChart data={currentSchedule.items} isActive={true} />
            </div>

            {/* Additional info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`glass-card p-6 border-l-4 ${
                  activePhase === 'spring' ? 'border-primary' : 'border-secondary'
                }`}
              >
                {activePhase === 'spring' ? (
                  <>
                    <h4 className="text-white font-semibold mb-2">Flexible Spring Schedule</h4>
                    <p className="text-gray-400 text-sm">
                      Designed to work alongside your classes. Most activities can be
                      scheduled around your academic commitments. We understand you&apos;re
                      still a student first.
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="text-white font-semibold mb-2">Intensive Summer Focus</h4>
                    <p className="text-gray-400 text-sm">
                      This is your startup. Summer requires dedicated focus - think of
                      it like running your own business. Most successful founders put in
                      full-time effort during this critical phase.
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Flexibility note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-card">
            <svg className="w-5 h-5 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-400 text-sm">
              Schedules are flexible and can be adjusted based on your specific situation
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
