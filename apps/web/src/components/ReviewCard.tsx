'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[#D0E8DF]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
          {review.avatar ? (
            <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-gray-400">{review.author[0]}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-gray-900 truncate">{review.author}</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-[14px] leading-relaxed italic flex-1">
        "{review.comment}"
      </p>
      <p className="text-[11px] text-gray-400 mt-4 text-right">{review.date}</p>
    </div>
  );
}
