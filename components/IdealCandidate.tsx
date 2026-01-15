'use client'

import { motion } from 'framer-motion'

const values = [
  {
    emoji: '💬',
    title: 'Speak Your Mind',
    description: 'Do not be hesitant. Actively seek and provide feedback. Have a growth mindset.',
    detail: 'Do not be scared to criticize something.',
  },
  {
    emoji: '🧭',
    title: 'Guidance, Not Control',
    description: 'We are guided by our mission and values, not controlled by them.',
    detail: 'Challenge the status quo when it makes sense.',
  },
  {
    emoji: '🚀',
    title: 'Be An Entrepreneur',
    description: 'Take risks and initiative. Take ownership of your work.',
    detail: 'We teach entrepreneurship, so live that lifestyle.',
  },
]

const expectations = [
  {
    title: 'Attend Meetings',
    items: ['Team calls - Weekly (usually Sundays)', 'Goal-setting - Monthly', 'Flexible around midterms and finals'],
  },
  {
    title: 'Manage Tasks',
    items: ['Be in charge of your own sprint cycle', 'Set your goals, track progress, own outcomes', 'We will not micromanage you'],
  },
  {
    title: 'Communicate',
    items: ['Be open and honest', 'Let us know ahead if you can\'t make a call', 'No ghosting'],
  },
  {
    title: 'Have Fun',
    items: ['You get out what you put in', 'Build relationships, learn, make memories', 'This should be a highlight of your college experience'],
  },
]

const tools = [
  { name: 'iMessage', use: 'Day-to-day communication, quick questions' },
  { name: 'Google Meet', use: 'Weekly calls, 1:1s, team meetings' },
  { name: 'Google Drive', use: 'Shared files, presentations, assets' },
]

export default function IdealCandidate() {
  return (
    <section id="culture" className="py-20 sm:py-28 bg-dark-lighter/30 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 text-center">Our Values</h2>
          <p className="text-gray-400 text-center mb-10">The principles that guide how we work</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-dark-card/50 border border-brand-green/10 rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{value.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{value.description}</p>
                <p className="text-brand-green text-xs">{value.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Expectations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-2 text-center">Expectations</h3>
          <p className="text-gray-400 text-center mb-8">What we expect from you</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {expectations.map((exp, i) => (
              <div key={i} className="bg-dark-card/30 rounded-xl p-5">
                <h4 className="text-white font-semibold mb-3">{exp.title}</h4>
                <ul className="space-y-2">
                  {exp.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-brand-green">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-2 text-center">Tools & Communication</h3>
          <p className="text-gray-400 text-center mb-8">How we stay connected</p>
          
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {tools.map((tool, i) => (
              <div key={i} className="bg-dark-card/30 rounded-xl p-4 text-center">
                <p className="text-white font-medium mb-1">{tool.name}</p>
                <p className="text-gray-500 text-xs">{tool.use}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-4 text-center">
            <p className="text-gray-300 text-sm">
              <span className="text-brand-green font-medium">Pro Tip:</span> Over-communication beats under-communication. 
              When in doubt, share the update.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
