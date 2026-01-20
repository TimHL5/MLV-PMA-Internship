'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-16 bg-[#0a0a0a] border-t border-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <Image
              src="/MLV Logo (white).png"
              alt="MLV"
              width={50}
              height={20}
              className="opacity-50"
            />
            <span className="text-[#333] text-sm">© 2026</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm">
            <a 
              href="mailto:tim@mlvignite.com" 
              className="text-[#555] hover:text-white transition-colors"
            >
              tim@mlvignite.com
            </a>
            <a 
              href="https://mlvignite.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#555] hover:text-white transition-colors"
            >
              mlvignite.com
            </a>
            <a
              href="https://portal.mlvignite.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6AC670] hover:text-[#5ab560] transition-colors"
            >
              Intern Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
