'use client'

import { motion } from 'framer-motion'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// Import images statically - Next.js handles spaces automatically
import jassyImage from '../public/minh (jassy) bui.jpeg'
import julieImage from '../public/julie tran.jpeg'
import ducVinhImage from '../public/duc vinh nguyen doan.jpeg'
import syHungImage from '../public/syhung nguyen.png'
import hugoImage from '../public/hugo lee.jpeg'
import leonardImage from '../public/leonard lui.jpeg'

interface SuccessStory {
  id: number
  name: string
  role: string
  dates: string
  image: StaticImageData
  achievements: { type: string; name: string }[]
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    name: 'Minh Phuong "Jassy" Bui',
    role: 'Product Intern',
    dates: "Jan '24 - Jun '25",
    image: jassyImage,
    achievements: [
      { type: 'company', name: 'Bain & Company' },
      { type: 'university', name: 'LSE' },
    ],
  },
  {
    id: 2,
    name: 'Julie Tran',
    role: 'Social Media Lead',
    dates: "Jan '24 - Sep '24",
    image: julieImage,
    achievements: [
      { type: 'company', name: 'Ogilvy' },
      { type: 'university', name: 'NYU' },
    ],
  },
  {
    id: 3,
    name: 'Duc Vinh Nguyen Doan',
    role: 'Pathways + Instruction Lead',
    dates: "Dec '23 - May '25",
    image: ducVinhImage,
    achievements: [
      { type: 'university', name: 'Yale' },
    ],
  },
  {
    id: 4,
    name: 'Sy Hung Nguyen',
    role: 'Pathways + Instruction Lead',
    dates: "Dec '23 - May '25",
    image: syHungImage,
    achievements: [
      { type: 'university', name: 'Brown' },
    ],
  },
  {
    id: 5,
    name: 'Hugo Lee',
    role: 'Brand Ambassador / Ops Lead',
    dates: "Jun '24 - Jun '25",
    image: hugoImage,
    achievements: [
      { type: 'university', name: 'UC Berkeley' },
    ],
  },
  {
    id: 6,
    name: 'Leonard Lui',
    role: 'Brand Ambassador / Instructor',
    dates: "Dec '24 - Jun '25",
    image: leonardImage,
    achievements: [
      { type: 'university', name: 'UCL' },
      { type: 'company', name: 'Zester' },
    ],
  },
]

// Logo/Badge component for achievements
function AchievementBadge({ achievement }: { achievement: { type: string; name: string } }) {
  const isUniversity = achievement.type === 'university'

  return (
    <div
      className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider ${
        isUniversity
          ? 'bg-primary/20 text-primary border border-primary/30'
          : 'bg-secondary/20 text-secondary border border-secondary/30'
      }`}
    >
      {achievement.name}
    </div>
  )
}

// Profile Card Component
function ProfileCard({ person, index }: { person: SuccessStory; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <motion.div
        className="relative h-full rounded-2xl overflow-hidden"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-2xl p-[1px] transition-all duration-300 group-hover:p-[2px]"
          style={{
            background: 'linear-gradient(135deg, #6AC670, #F2CF07)',
            opacity: 0.5,
          }}
        >
          <div className="w-full h-full rounded-2xl bg-[#1a1a2e]" />
        </div>

        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, #6AC670, #F2CF07)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Profile Photo */}
          <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] mb-5 rounded-full overflow-hidden ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all duration-300">
            <Image
              src={person.image}
              alt={`${person.name} - MLV Alumni`}
              fill
              className="object-cover"
              sizes="150px"
            />
          </div>

          {/* Name */}
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
            {person.name}
          </h3>

          {/* Role and Dates */}
          <p className="text-sm text-gray-400 mb-5">
            {person.role} <span className="text-gray-600">•</span> {person.dates}
          </p>

          {/* Achievements */}
          <div className="flex flex-wrap justify-center gap-2">
            {person.achievements.map((achievement, i) => (
              <AchievementBadge key={i} achievement={achievement} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}

export default function SuccessStories() {
  return (
    <section id="success-stories" className="section-padding relative overflow-hidden bg-dark">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Alumni Network
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="text-white">Where Our Team </span>
            <span className="gradient-text">Goes Next</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
            MLV alumni have gone on to top universities and leading companies worldwide
          </p>
        </motion.div>

        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {successStories.map((person, index) => (
            <ProfileCard key={person.id} person={person} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-400 text-lg sm:text-xl mb-6">
            Ready to write your own success story?
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-dark-pure font-semibold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
          >
            Apply Now
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
