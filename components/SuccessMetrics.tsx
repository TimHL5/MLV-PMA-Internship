'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

const springMetrics = [
  { label: 'Understanding of startup operations', target: 100, unit: '%' },
  { label: 'Deliverables completed on time', target: 95, unit: '%' },
  { label: 'Customer discovery principles mastered', target: 100, unit: '%' },
  { label: 'Product management fundamentals learned', target: 100, unit: '%' },
]

const summerMetrics = [
  { label: 'Revenue target achievement', target: 50000, prefix: '$', suffix: '+' },
  { label: 'Customer interviews conducted', target: 20, suffix: '+' },
  { label: 'Paying customers acquired', target: 10, suffix: '+' },
  { label: 'NPS score target', target: 8, suffix: '/10' },
]

// Animated Progress Bar Component
function AnimatedProgressBar({
  label,
  target,
  delay = 0,
  color = 'primary',
}: {
  label: string
  target: number
  delay?: number
  color?: 'primary' | 'secondary'
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setProgress(target)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, target, delay])

  return (
    <div ref={ref} className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-gray-300 text-sm">{label}</span>
        <span className={`font-bold ${color === 'primary' ? 'text-primary' : 'text-secondary'}`}>
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-3 bg-dark rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            color === 'primary'
              ? 'bg-gradient-to-r from-primary to-accent-cyan'
              : 'bg-gradient-to-r from-secondary to-accent-pink'
          }`}
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${target}%` : 0 }}
          transition={{ duration: 1.5, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// Animated Circular Progress Component
function CircularProgress({
  value,
  max = 100,
  label,
  prefix = '',
  suffix = '',
  delay = 0,
  color = 'primary',
}: {
  value: number
  max?: number
  label: string
  prefix?: string
  suffix?: string
  delay?: number
  color?: 'primary' | 'secondary'
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const startTime = Date.now()

      const timer = setTimeout(() => {
        const animate = () => {
          const elapsed = Date.now() - startTime - delay * 1000
          if (elapsed > 0) {
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.floor(easeOut * value))
          }
          if (elapsed < duration) {
            requestAnimationFrame(animate)
          } else {
            setDisplayValue(value)
          }
        }
        animate()
      }, delay * 1000)

      return () => clearTimeout(timer)
    }
  }, [isInView, value, delay])

  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-dark-lighter"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color === 'primary' ? 'url(#primaryGradient)' : 'url(#secondaryGradient)'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: isInView ? strokeDashoffset : circumference,
            }}
            transition={{ duration: 1.5, delay, ease: 'easeOut' }}
          />
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="secondaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        {/* Value display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${color === 'primary' ? 'text-primary' : 'text-secondary'}`}>
            {prefix}{displayValue.toLocaleString()}{suffix}
          </span>
        </div>
      </div>
      <span className="text-gray-400 text-sm text-center mt-3 max-w-[120px]">{label}</span>
    </div>
  )
}

export default function SuccessMetrics() {
  const sectionRef = useRef(null)

  return (
    <section
      id="metrics"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-dark-lighter" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
            How We Measure Success
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Clear Goals. </span>
            <span className="gradient-text">Real Results.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            We set ambitious targets and provide you with the tools and support to achieve them.
            Your success is measurable and meaningful.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Spring Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Spring Shadowing</h3>
                <p className="text-gray-500">Learning Outcomes</p>
              </div>
            </div>

            <div className="space-y-2">
              {springMetrics.map((metric, index) => (
                <AnimatedProgressBar
                  key={metric.label}
                  label={metric.label}
                  target={metric.target}
                  delay={index * 0.2}
                  color="primary"
                />
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-400">
                  Success in spring is measured by your learning velocity and deliverable quality,
                  not by business metrics.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Summer Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Summer Capstone</h3>
                <p className="text-gray-500">Entrepreneurial Outcomes</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {summerMetrics.map((metric, index) => (
                <CircularProgress
                  key={metric.label}
                  value={metric.target}
                  max={metric.label.includes('Revenue') ? 100000 : metric.label.includes('NPS') ? 10 : 50}
                  label={metric.label}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  delay={index * 0.2}
                  color="secondary"
                />
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-sm text-gray-400">
                  Summer success is measured by real business outcomes. Your initiative should
                  generate revenue and create value.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bill Aulet reference */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="glass-card inline-flex items-center gap-4 px-6 py-4">
            <span className="text-2xl">📚</span>
            <div className="text-left">
              <p className="text-gray-400 text-sm">Our methodology is inspired by</p>
              <p className="text-white font-medium">
                Bill Aulet&apos;s{' '}
                <span className="gradient-text">24 Steps to a Successful Startup</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
