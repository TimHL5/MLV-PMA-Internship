'use client'

import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import ProgramOverview from '@/components/ProgramOverview'
import Timeline from '@/components/Timeline'
import Compensation from '@/components/Compensation'
import IdealCandidate from '@/components/IdealCandidate'
import SuccessMetrics from '@/components/SuccessMetrics'
import WeeklyBreakdown from '@/components/WeeklyBreakdown'
import SuccessStories from '@/components/SuccessStories'
import ApplicationProcess from '@/components/ApplicationProcess'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'

export default function Home() {
  return (
    <main className="relative">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* Program Overview */}
      <ProgramOverview />

      {/* Timeline */}
      <Timeline />

      {/* Compensation */}
      <Compensation />

      {/* Ideal Candidate */}
      <IdealCandidate />

      {/* Success Metrics */}
      <SuccessMetrics />

      {/* Weekly Breakdown */}
      <WeeklyBreakdown />

      {/* Success Stories */}
      <SuccessStories />

      {/* Application Process */}
      <ApplicationProcess />

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <Footer />

      {/* Floating CTA */}
      <FloatingCTA />
    </main>
  )
}
