'use client';

import { useLandingPageAnalytics } from '@/hooks/useLandingPageAnalytics';
import Link from 'next/link';

export default function NavigationClient() {
  const { trackCTAClick, trackNavigationClick } = useLandingPageAnalytics();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-slate-900 font-[var(--font-poppins)]">
              Laplace
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              onClick={() => trackNavigationClick('機能', '#features')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              機能
            </a>
            <a
              href="#benefits"
              onClick={() => trackNavigationClick('メリット', '#benefits')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              メリット
            </a>
            <a
              href="#faq"
              onClick={() => trackNavigationClick('FAQ', '#faq')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              FAQ
            </a>
            <Link
              href="/markets/self/simulation"
              onClick={() => trackCTAClick('nav', '無料で始める', '/markets/self/simulation')}
              className="bg-[var(--color-lp-mint)] text-white px-6 py-2 rounded-full hover:bg-[var(--color-lp-mint)]/90 transition-all hover:scale-105"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
