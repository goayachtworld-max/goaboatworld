'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Rahul Sharma',
    rating: 5,
    comment: 'Absolute luxury! The Majesty 66 was breathtaking. The crew were professional and the sunset view was magic.',
    date: 'Oct 12, 2025',
  },
  {
    id: '2',
    author: 'Priya Nair',
    rating: 5,
    comment: 'Perfect for our anniversary. Intimate, private, and incredibly romantic. Highly recommend the sport cruiser.',
    date: 'Sep 28, 2025',
  },
  {
    id: '3',
    author: 'Amit Patel',
    rating: 5,
    comment: 'Best corporate outing ever. Our team loved the space and the service. Everything was seamless.',
    date: 'Sep 15, 2025',
  },
  {
    id: '4',
    author: 'Sneha Gupta',
    rating: 5,
    comment: 'Celebrated my 30th birthday here. The decorations and the boat were both top-notch. Truly a special day!',
    date: 'Aug 22, 2025',
  },
  {
    id: '5',
    author: 'Vikram Singh',
    rating: 5,
    comment: 'Smooth sailing and great music system. The flybridge experience is unmatched in Goa.',
    date: 'Aug 05, 2025',
  },
  {
    id: '6',
    author: 'Ananya Rao',
    rating: 5,
    comment: 'Everything was perfect from booking to the actual trip. A must-visit for anyone in Goa!',
    date: 'Jul 18, 2025',
  },
];

const GAP_PX = 24; // matches gap-6 on the track
const AUTOPLAY_MS = 5000;

function useVisibleCount() {
  const get = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };
  const [count, setCount] = useState(get);
  useEffect(() => {
    const onResize = () => setCount(get());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return count;
}

export default function ReviewSlider({ googleReviewUrl }: { googleReviewUrl?: string }) {
  const visibleCount = useVisibleCount();
  const [mounted, setMounted] = useState(false);
  const total = MOCK_REVIEWS.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const maxIndex = Math.max(0, total - visibleCount);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Keep the index inside the valid window when the breakpoint changes
  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const next = useCallback(
    () => setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1)),
    [maxIndex]
  );
  const prev = () => setCurrentIndex((i) => (i <= 0 ? maxIndex : i - 1));

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, next]);

  const avgRating = (MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);

  // One card of travel = (track + one gap) / number of visible cards,
  // expressed against the track's own box so it works at every breakpoint.
  const offset = `calc(${-currentIndex} * (100% + ${GAP_PX}px) / ${visibleCount})`;

  if (!mounted) {
    return (
      <section className="w-full py-16 md:py-20 bg-[#F8FAFA] border-y border-[#D0E8DF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 opacity-0" />
      </section>
    );
  }

  return (
    <section
      className="w-full py-16 md:py-20 bg-[#F8FAFA] border-y border-[#D0E8DF] overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Guest reviews"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-xs mb-4">
            Guest Reviews
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair-display font-bold text-[#1A3C35] mb-4">
            What Our Guests Say
          </h2>
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <span className="text-2xl font-bold text-[#1A3C35] leading-none">{avgRating}</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-gray-500 text-[14px]">
              from {total} recent Google reviews
            </span>
          </div>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(${offset})` }}
            >
              {MOCK_REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)]"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous reviews"
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#1A3C35] hover:bg-[#1A3C35] hover:text-white hover:border-[#1A3C35] transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === i ? 'bg-[#3D9B7D] w-6' : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Next reviews"
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#1A3C35] hover:bg-[#1A3C35] hover:text-white hover:border-[#1A3C35] transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="border-[#3D9B7D] text-[#1A3C35] hover:bg-[#3D9B7D] hover:text-white transition-all font-bold rounded-xl px-8"
          >
            <a href={googleReviewUrl || '#'} target="_blank" rel="noopener noreferrer">
              Read All Reviews on Google
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
