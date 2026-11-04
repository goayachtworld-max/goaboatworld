'use client';

import React, { useState, useEffect } from 'react';

export default function SafeDate({ date, options }: { date: string | Date, options?: Intl.DateTimeFormatOptions }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="opacity-0">...</span>;
  }

  return <span>{new Date(date).toLocaleDateString(undefined, options)}</span>;
}
