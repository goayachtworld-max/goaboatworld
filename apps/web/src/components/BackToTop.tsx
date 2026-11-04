'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        bottom: '96px', // Positioned above FloatingWhatsApp (28px + 60px + 8px gap)
        right: '24px',
        zIndex: 999,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: '9999px',
          backgroundColor: '#1A3C35',
          color: '#3D9B7D',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        }}
      >
        <ArrowUp className="w-6 h-6" />
      </span>
    </button>
  );
}
