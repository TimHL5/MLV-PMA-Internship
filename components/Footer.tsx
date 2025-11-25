'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// Import logo with static import - Next.js handles spaces in filenames automatically
import logoWhite from '../public/MLV Logo (white).png'

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/mlv',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/mlvstudent',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/mlvstudent',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

const footerLinks = [
  {
    title: 'Program',
    links: [
      { name: 'Overview', href: '#overview' },
      { name: 'Timeline', href: '#timeline' },
      { name: 'Compensation', href: '#compensation' },
      { name: 'Schedule', href: '#schedule' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'FAQs', href: '#faq' },
      { name: 'Apply Now', href: '/apply' },
      { name: 'Success Metrics', href: '#metrics' },
      { name: 'Ideal Candidate', href: '#candidate' },
    ],
  },
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative overflow-hidden bg-dark-pure">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Content */}
      <div className="container-custom px-4 sm:px-6 relative z-10">
        {/* Main footer content */}
        <div className="py-12 sm:py-16 border-b border-gray-800">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {/* Logo */}
                <a
                  href="https://mlvignite.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mb-4 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={logoWhite}
                    alt="MLV Logo"
                    width={120}
                    height={40}
                    className="h-10 sm:h-12 w-auto"
                  />
                </a>

                <p className="text-gray-400 max-w-md mb-6 text-sm sm:text-base">
                  Empowering the next generation of entrepreneurs through hands-on
                  experience, mentorship, and real business building.
                </p>

                {/* Social links */}
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-dark-lighter flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Link sections */}
            {footerLinks.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-primary transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact section */}
        <div className="py-6 sm:py-8 border-b border-gray-800">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-dark-pure font-bold text-lg sm:text-xl">
                TL
              </div>
              <div>
                <p className="text-white font-medium">Questions? Reach out to Tim Liu</p>
                <p className="text-gray-400 text-sm">Program Director</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="mailto:timothy.liu@mlvignite.com"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-dark-lighter border border-gray-700 text-gray-300 hover:text-primary hover:border-primary transition-all text-sm"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">timothy.liu@mlvignite.com</span>
                <span className="sm:hidden">Email</span>
              </a>
              <a
                href="https://www.linkedin.com/in/timothyhaiyiliu/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-dark-lighter border border-gray-700 text-gray-300 hover:text-primary hover:border-primary transition-all text-sm"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            Made with <span className="text-primary">💚</span> by MLV Team &copy; {new Date().getFullYear()}
          </p>

          {/* Back to top button */}
          <motion.button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-lighter border border-gray-800 text-gray-400 hover:text-primary hover:border-primary transition-all group"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm">Back to top</span>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </motion.svg>
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
