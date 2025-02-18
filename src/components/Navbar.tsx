'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, CalculatorIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-3">
          <Link 
            href="/" 
            className={`nav-link flex flex-col items-center ${pathname === '/' ? 'active' : ''}`}
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link 
            href="/calculator" 
            className={`nav-link flex flex-col items-center ${pathname === '/calculator' ? 'active' : ''}`}
          >
            <CalculatorIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Calculator</span>
          </Link>
        </div>
      </div>
    </nav>
  );
} 