'use client'

import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import ProgramOverview from '@/components/ProgramOverview'
import Timeline from '@/components/Timeline'
import Compensation from '@/components/Compensation'
import IdealCandidate from '@/components/IdealCandidate'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-[#0a0a0a]">
      <Navigation />
      <Hero />
      <ProgramOverview />
      <Timeline />
      <Compensation />
      <IdealCandidate />
      <Footer />
    </main>
  )
}
