'use client'

import { motion } from 'framer-motion'

const phases = [
  {
    id: 1,
    name: 'Shadow',
    period: 'Jan - Mar',
    location: 'Remote',
    commitment: '4-6 hrs/week',
    color: 'green',
    description: 'Learn the business across all verticals',
    activities: [
      'Join weekly team calls',
      'Shadow ops, marketing, finance',
      'Support MLV Sprint (Jan and Mar)',
    ],
  },
  {
    id: 2,
    name: 'Scope',
    period: 'Apr - May',
    location: 'Remote (US)',
    commitment: '4-6 hrs/week',
    color: 'yellow',
    description: 'Define your capstone project',
    activities: [
      'Brainstorm with team',
      'Finalize scope and GTM',
      'Prep for summer build',
    ],
  },
  {
    id: 3,
    name: 'Execute',
    period: 'Jun - Aug',
    location: 'Asia (HCMC Office + Mansion)',
    commitment: 'Full-time',
    color: 'green',
    description: 'Build, launch, and scale',
    activities: [
      'Support Ignite programs',
      'Launch capstone MVP',
      'GTM and hit $50K revenue goal',
    ],
  },
]

const deliverables = [
  { icon: '📋', title: 'Problem Statement', desc: 'Clear articulation of the problem you are solving' },
  { icon: '💡', title: 'Solution & MVP', desc: 'What you are building and what is v1' },
  { icon: '🛤️', title: 'GTM Roadmap', desc: 'How you will acquire customers and generate revenue' },
  { icon: '👥', title: 'Role Assignments', desc: 'Who owns what on the team' },
]

export default function Timeline() {
  return (
    <section id="timeline" className="py-20 sm:py-28 bg-dark-lighter/30 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Your Journey</h2>
          <p className="text-gray-400">8-month program timeline</p>
        </motion.div>

        {/* Phases */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-dark-card/50 border rounded-xl p-6 ${
                phase.color === 'green' ? 'border-brand-green/20' : 'border-brand-yellow/20'
              }`}
            >
              {/* Phase number */}
              <div className={`absolute -top-3 left-6 px-3 py-1 text-xs font-bold rounded-full ${
                phase.color === 'green' 
                  ? 'bg-brand-green text-dark-pure' 
                  : 'bg-brand-yellow text-dark-pure'
              }`}>
                Phase {phase.id}
              </div>

              <div className="mt-2">
                <h3 className="text-xl font-bold text-white mb-1">{phase.name}</h3>
                <p className={`text-sm font-medium mb-4 ${
                  phase.color === 'green' ? 'text-brand-green' : 'text-brand-yellow'
                }`}>
                  {phase.period}
                </p>
                
                <p className="text-gray-300 text-sm mb-4">{phase.description}</p>
                
                <ul className="space-y-2 mb-4">
                  {phase.activities.map((activity, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className={phase.color === 'green' ? 'text-brand-green' : 'text-brand-yellow'}>•</span>
                      {activity}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {phase.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {phase.commitment}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Capstone Deliverables */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-dark-card/30 border border-brand-green/10 rounded-xl p-6 sm:p-8"
        >
          <h3 className="text-xl font-bold text-white mb-2">Capstone Deliverables</h3>
          <p className="text-gray-500 text-sm mb-6">By end of May, your team will have:</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {deliverables.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white font-medium text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              <span className="text-brand-yellow font-medium">Requirements:</span> Related to MLV mission • 
              Viable path to $50K revenue • Executable by your team over summer
            </p>
          </div>
        </motion.div>

        {/* Summer Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 border border-brand-green/20 rounded-xl p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Summer Revenue Goal</h4>
              <p className="text-gray-400 text-sm">$50K Legacy + $50K Capstone</p>
            </div>
            <div className="text-4xl font-bold text-brand-green">$100K</div>
          </div>
          
          <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-brand-green font-medium mb-1">June</p>
              <p className="text-gray-400">Build MVP, support Ignite Hanoi (on-site)</p>
            </div>
            <div>
              <p className="text-brand-yellow font-medium mb-1">July - Highlight</p>
              <p className="text-gray-400">HCMC Office (Week 1) → Mansion (Week 2)</p>
            </div>
            <div>
              <p className="text-white font-medium mb-1">August</p>
              <p className="text-gray-400">Close out, launch MLV AI, document playbooks</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
