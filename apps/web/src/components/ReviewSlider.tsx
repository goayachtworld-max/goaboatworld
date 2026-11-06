'use client';

import React, { useEffect, useState } from 'react';
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

export default function ReviewSlider({ googleReviewUrl }: { googleReviewUrl?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_REVIEWS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full py-16 bg-[#F8FAFA] border-y border-[#D0E8DF] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair-display font-bold text-[#1A3C35] mb-3">
            What Our Guests Say
          </h2>
          <p className="text-gray-500 text-[15px]">Experience the magic of Goa's waters through our guests' eyes</p>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out gap-6"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] px-2">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {MOCK_REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${currentIndex === i ? 'bg-[#3D9B7D] w-6' : 'bg-gray-300'}`}
              />
            ))}
          </div>

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
    </div>
  );
}
