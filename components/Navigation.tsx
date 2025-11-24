'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { name: 'Overview', href: '#overview' },
  { name: 'Timeline', href: '#timeline' },
  { name: 'Compensation', href: '#compensation' },
  { name: 'Who We Seek', href: '#candidate' },
  { name: 'How to Apply', href: '#application' },
  { name: 'FAQs', href: '#faq' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark/90 backdrop-blur-lg border-b border-primary/10'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo - links to mlvignite.com */}
            <a
              href="https://mlvignite.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                {/* Text-based logo */}
                <span
                  className="text-2xl sm:text-3xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #6AC670, #F2CF07)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  MLV
                </span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-gray-400 text-sm ml-1">PMA 2026</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-primary transition-colors text-sm font-medium relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <motion.a
                href="/apply"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-dark-pure font-semibold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Now
              </motion.a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-11 h-11 rounded-xl bg-dark-lighter border border-primary/20 flex items-center justify-center text-white"
              aria-label="Toggle menu"
            >
              <motion.div animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}>
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu - full screen with green accent */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm z-50 lg:hidden bg-dark-lighter border-l border-primary/20"
            >
              {/* Close button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-11 h-11 rounded-xl bg-dark border border-primary/20 flex items-center justify-center text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu items */}
              <div className="px-6 py-4">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-4 py-4 rounded-xl text-gray-300 hover:text-white hover:bg-primary/10 transition-all text-lg font-medium border-b border-gray-800/50"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </div>

                {/* CTA in mobile menu */}
                <motion.a
                  href="/apply"
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 block w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-dark-pure font-semibold text-center text-lg"
                >
                  Apply Now
                </motion.a>

                {/* MLV branding in mobile menu */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <a
                    href="https://mlvignite.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors"
                  >
                    <span className="text-sm">Powered by MLV</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
