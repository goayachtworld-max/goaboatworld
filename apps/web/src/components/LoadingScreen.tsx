'use client';

import React, { useState, useEffect } from 'react';
import YachtLoaderIcon from '@/components/YachtLoaderIcon';

export default function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a small delay to ensure the animation is seen,
    // or simply hide it once the component mounts.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <YachtLoaderIcon size={250} />
        </div>
      )}
      {children}
    </>
  );
}
