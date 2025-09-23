'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PortfolioCTAProps {
  className?: string;
}

export default function PortfolioCTA({ className = '' }: PortfolioCTAProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="glass p-12 rounded-3xl max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Interested in Collaboration?
            </h2>
            <p className="text-xl text-ink/70 mb-8 leading-relaxed">
              Let's discuss your project and create something amazing together
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 glass-strong text-ink rounded-full font-semibold hover:glass transition-all duration-200 focus-ring group"
            >
              Discuss Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
