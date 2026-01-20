'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const navLinks = [
  { name: 'Program', href: '#program' },
  { name: 'Timeline', href: '#timeline' },
  { name: 'Compensation', href: '#compensation' },
  { name: 'Culture', href: '#culture' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1a1a1a]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="https://mlvignite.com" target="_blank" rel="noopener noreferrer">
            <Image
              src="/MLV Logo (white).png"
              alt="MLV"
              width={60}
              height={24}
              className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </a>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[#666] hover:text-white transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://portal.mlvignite.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-[#1a1a1a] text-white text-sm rounded-lg hover:bg-[#252525] transition-colors border border-[#252525]"
          >
            Intern Portal
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
