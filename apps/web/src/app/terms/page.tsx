'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import SimpleMarkdown from '@/components/SimpleMarkdown';

export default function TermsPage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site-config')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        setContent(data.terms_conditions_content || 'Terms and conditions content is not yet available.');
        setLoading(false);
      })
      .catch(() => {
        setContent('An error occurred while loading the terms and conditions.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 bg-white min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#3D9B7D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-500 hover:text-[#3D9B7D] transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <h1 className="text-4xl md:text-5xl font-playfair-display font-bold text-[#1A3C35] mb-8">
          Terms & Conditions
        </h1>

        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
          <SimpleMarkdown content={content} />
        </div>
      </div>
    </div>
  );
}
