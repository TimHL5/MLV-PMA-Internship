'use client'

import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="py-12 bg-dark-pure border-t border-brand-green/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/MLV Logo (white).png"
              alt="MLV"
              width={60}
              height={24}
              className="opacity-60"
            />
            <span className="text-gray-600 text-sm">PM Associate Program 2026</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <a 
              href="mailto:tim@mlvignite.com" 
              className="text-gray-500 hover:text-brand-green transition-colors"
            >
              tim@mlvignite.com
            </a>
            <a 
              href="https://mlvignite.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-brand-green transition-colors"
            >
              mlvignite.com
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-600 text-xs">
            Scale through technology, lead through community
          </p>
        </div>
      </div>
    </footer>
  )
}
