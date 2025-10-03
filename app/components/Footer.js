'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#2c2548] to-[#1a1a2e] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* For patients */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">For patients</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-200">
              <li><Link href="/doctors" className="hover:text-white transition-colors">Search Doctors</Link></li>
              <li><Link href="/hospitals" className="hover:text-white transition-colors">Search Hospitals</Link></li>
              <li><Link href="/clinics" className="hover:text-white transition-colors">Search Clinics</Link></li>
            </ul>
          </div>

          {/* Doctar */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Doctar</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-200">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">More</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-200">
              <li><Link href="/help" className="hover:text-white transition-colors">Help</Link></li>
              <li><Link href="/developers" className="hover:text-white transition-colors">Developers</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/pci-terms" className="hover:text-white transition-colors">PCI T&C</Link></li>
              <li><Link href="/healthcare-directory" className="hover:text-white transition-colors">Healthcare Directory</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Social</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-200">
              <li><Link href="https://facebook.com" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Facebook</Link></li>
              <li><Link href="https://twitter.com" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Twitter</Link></li>
              <li><Link href="https://linkedin.com" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</Link></li>
              <li><Link href="https://youtube.com" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Youtube</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Separator line */}
        <div className="border-t border-gray-300 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <p className="text-center text-gray-200 text-xs sm:text-sm">&copy; 2025 Doctar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
