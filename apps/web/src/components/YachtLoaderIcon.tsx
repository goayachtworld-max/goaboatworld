'use client';

import React from 'react';

export default function YachtLoaderIcon({ size = 220, className = '' }: { size?: number | string, className?: string }) {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={`yacht-icon-root ${className}`}
      style={{ width: dimension, height: dimension }}
      role="status"
      aria-label="Loading..."
    >
      <style>{`
        .yacht-icon-root {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
          user-select: none;
        }
        .yacht-icon-glow {
          position: absolute;
          inset: 8%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(29, 215, 96, 0.16) 0%, rgba(62, 155, 126, 0.06) 60%, transparent 75%);
          filter: blur(12px);
          animation: yachtAIPulse 2s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .yacht-icon-ai-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
        }
        .yacht-beam-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .yacht-beam-cw {
          animation: yachtSpinCW 1.4s linear infinite;
          transform-origin: center center;
        }
        .yacht-beam-ccw {
          animation: yachtSpinCCW 2.1s linear infinite;
          transform-origin: center center;
        }
        .yacht-orbit {
          position: absolute;
          inset: 0;
          border-radius: 50%;
        }
        .yacht-orbit-1 { animation: yachtSpinCW 1.2s linear infinite; }
        .yacht-orbit-2 { animation: yachtSpinCW 2.0s linear infinite; }
        .yacht-orbit-3 { animation: yachtSpinCCW 1.6s linear infinite; }
        .yacht-orbit-4 { animation: yachtSpinCW 0.85s linear infinite; }

        .yacht-dot {
          position: absolute;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 6px #1dd760, 0 0 12px #3bcf6b, 0 0 18px rgba(29, 215, 96, 0.9);
        }
        .ydot-1 { width: 2.8%; height: 2.8%; top: 4%; left: 50%; transform: translateX(-50%); }
        .ydot-1::after {
          content: ""; position: absolute; right: 100%; top: 50%; transform: translateY(-50%);
          width: 500%; height: 50%;
          background: linear-gradient(to left, #1dd760, rgba(29, 215, 96, 0.4), transparent);
          border-radius: 999px;
        }
        .ydot-2 { width: 2.2%; height: 2.2%; bottom: 8%; left: 28%; background: #a7f3d0; box-shadow: 0 0 6px #1dd760; }
        .ydot-2::after {
          content: ""; position: absolute; right: 100%; top: 50%; transform: translateY(-50%);
          width: 400%; height: 45%; background: linear-gradient(to left, #3e9b7e, transparent);
          border-radius: 999px;
        }
        .ydot-3 { width: 2.5%; height: 2.5%; top: 36%; right: 4%; background: #3bcf6b; }
        .ydot-3::after {
          content: ""; position: absolute; right: 100%; top: 50%; transform: translateY(-50%);
          width: 450%; height: 50%; background: linear-gradient(to left, #1dd760, transparent);
          border-radius: 999px;
        }
        .ydot-4 { width: 1.8%; height: 1.8%; bottom: 32%; left: 5%; background: #ffffff; box-shadow: 0 0 6px #1dd760; }
        .ydot-5 { width: 2.2%; height: 2.2%; top: 72%; right: 8%; background: #6ee7b7; }
        .ydot-6 { width: 1.8%; height: 1.8%; top: 18%; left: 9%; background: #ffffff; box-shadow: 0 0 8px #1dd760; }

        .yacht-boat-body {
          position: relative;
          z-index: 3;
          width: 58%;
          height: 38%;
          animation: yachtRailing 2.8s ease-in-out infinite;
          filter: drop-shadow(0 8px 16px rgba(24, 55, 47, 0.7)) drop-shadow(0 2px 8px rgba(29, 215, 96, 0.3));
        }
        .yacht-boat-svg { width: 100%; height: 100%; display: block; }
        .yacht-cabin-light { animation: yachtCabinPulse 2s ease-in-out infinite alternate; }

        .yacht-wake-spritz {
          position: absolute;
          bottom: 22%;
          width: 32%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(29, 215, 96, 0.85), transparent);
          animation: yachtWakePulse 1.6s ease-out infinite;
          z-index: 2;
        }
        .yacht-waves-box {
          position: absolute;
          bottom: 14%;
          left: 50%;
          transform: translateX(-50%);
          width: 78%;
          height: 24%;
          overflow: hidden;
          border-radius: 999px;
          pointer-events: none;
          z-index: 2;
        }
        .yacht-wave-svg { position: absolute; bottom: 0; left: 0; width: 200%; height: 100%; display: block; }
        .yacht-w1 { fill: rgba(24, 55, 47, 0.8); animation: yachtWaveSlip 3.2s ease-in-out infinite alternate; }
        .yacht-w2 { fill: rgba(62, 155, 126, 0.55); animation: yachtWaveSlip 4.2s ease-in-out infinite alternate-reverse; }
        .yacht-w3 { fill: rgba(29, 215, 96, 0.4); animation: yachtWaveSlip 2.5s ease-in-out infinite alternate; }

        @keyframes yachtRailing {
          0% { transform: translateY(0px) rotate(-2deg); }
          25% { transform: translateY(-6px) rotate(2deg); }
          50% { transform: translateY(-2px) rotate(3deg); }
          75% { transform: translateY(4px) rotate(-0.5deg); }
          100% { transform: translateY(0px) rotate(-2deg); }
        }
        @keyframes yachtWaveSlip { 0% { transform: translateX(0); } 100% { transform: translateX(-35px); } }
        @keyframes yachtSpinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes yachtSpinCCW { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes yachtAIPulse { 0% { transform: scale(0.95); opacity: 0.6; } 100% { transform: scale(1.05); opacity: 1; } }
        @keyframes yachtCabinPulse {
          0% { fill-opacity: 0.5; filter: drop-shadow(0 0 2px rgba(29, 215, 96, 0.4)); }
          100% { fill-opacity: 0.98; filter: drop-shadow(0 0 6px rgba(29, 215, 96, 0.9)); }
        }
        @keyframes yachtWakePulse {
          0% { transform: scaleX(0.6) translateY(0); opacity: 0.8; }
          100% { transform: scaleX(1.3) translateY(3px); opacity: 0; }
        }
      `}</style>

      <div className="yacht-icon-glow" />

      <div className="yacht-icon-ai-ring">
        <svg className="yacht-beam-svg yacht-beam-cw" viewBox="0 0 240 240">
          <defs>
            <linearGradient id="yiconBeam1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1dd760" stopOpacity="1" />
              <stop offset="40%" stopColor="#3bcf6b" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#3e9b7e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="yiconBeam2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3bcf6b" stopOpacity="1" />
              <stop offset="50%" stopColor="#1dd760" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <circle cx="120" cy="120" r="108" stroke="url(#yiconBeam1)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="85 190" fill="none" />
          <circle cx="120" cy="120" r="108" stroke="url(#yiconBeam2)" strokeWidth="2" strokeLinecap="round" strokeDasharray="45 230" strokeDashoffset="120" fill="none" />
        </svg>

        <svg className="yacht-beam-svg yacht-beam-ccw" viewBox="0 0 240 240">
          <circle cx="120" cy="120" r="108" stroke="rgba(167, 243, 208, 0.75)" strokeWidth="1.5" strokeDasharray="30 240" strokeLinecap="round" fill="none" />
        </svg>

        <div className="yacht-orbit yacht-orbit-1">
          <span className="yacht-dot ydot-1" />
          <span className="yacht-dot ydot-2" />
        </div>
        <div className="yacht-orbit yacht-orbit-2">
          <span className="yacht-dot ydot-3" />
          <span className="yacht-dot ydot-4" />
        </div>
        <div className="yacht-orbit yacht-orbit-3">
          <span className="yacht-dot ydot-5" />
        </div>
        <div className="yacht-orbit yacht-orbit-4">
          <span className="yacht-dot ydot-6" />
        </div>
      </div>

      <div className="yacht-boat-body">
        <svg className="yacht-boat-svg" viewBox="0 0 160 90" fill="none">
          <defs>
            <linearGradient id="yiconHull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#eaf8f4" />
              <stop offset="80%" stopColor="#86d4bc" />
              <stop offset="100%" stopColor="#3e9b7e" />
            </linearGradient>
            <linearGradient id="yiconGlass" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#18372f" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#3e9b7e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1dd760" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="yiconEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3e9b7e" />
              <stop offset="50%" stopColor="#1dd760" />
              <stop offset="100%" stopColor="#3bcf6b" />
            </linearGradient>
            <filter id="yiconGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <path d="M52 24 C 65 22, 95 22, 106 25 C 108 25.5, 107 27, 104 28 L 50 28 C 48 28, 48 25, 52 24 Z" fill="#ffffff" />
          <line x1="72" y1="23" x2="72" y2="15" stroke="url(#yiconEmerald)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="72" cy="14" r="2.5" fill="#1dd760" filter="url(#yiconGlow)" />
          <path d="M67 18 L 77 18" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M58 28 L 56 36 M 85 28 L 86 36 M 102 28 L 100 36" stroke="#93c5b5" strokeWidth="1.5" />

          <path d="M40 36 C 55 35, 95 34, 114 38 C 122 40, 126 44, 124 47 L 34 47 C 32 44, 34 38, 40 36 Z" fill="url(#yiconHull)" />
          <path className="yacht-cabin-light" d="M52 38 L 110 39 C 117 41, 119 44, 117 45 L 48 45 C 45 44, 47 39, 52 38 Z" fill="url(#yiconGlass)" />
          <line x1="72" y1="38.5" x2="71" y2="45" stroke="#122a24" strokeWidth="1.5" />
          <line x1="92" y1="39" x2="91" y2="45" stroke="#122a24" strokeWidth="1.5" />

          <path d="M16 48 L 126 48 C 138 48, 148 54, 154 60 C 145 66, 120 70, 95 71 L 28 71 C 18 70, 14 62, 16 48 Z" fill="url(#yiconHull)" />
          <path d="M22 66 C 50 67, 105 67, 146 58 C 142 62, 120 66, 95 67 L 24 67 Z" fill="url(#yiconEmerald)" />

          <circle cx="45" cy="56" r="2" fill="#1dd760" opacity="0.95" />
          <circle cx="62" cy="56" r="2" fill="#1dd760" opacity="0.95" />
          <circle cx="79" cy="56" r="2" fill="#1dd760" opacity="0.95" />
          <circle cx="96" cy="56" r="2" fill="#1dd760" opacity="0.95" />
          <circle cx="140" cy="54" r="1.5" fill="#3bcf6b" />
        </svg>
      </div>

      <div className="yacht-wake-spritz" />

      <div className="yacht-waves-box">
        <svg className="yacht-wave-svg" viewBox="0 0 500 50" preserveAspectRatio="none">
          <path className="yacht-w1" d="M0,25 C100,10 150,40 250,25 C350,10 400,40 500,25 L500,50 L0,50 Z" />
          <path className="yacht-w2" d="M0,30 C75,15 175,45 250,30 C325,15 425,45 500,30 L500,50 L0,50 Z" />
          <path className="yacht-w3" d="M0,36 C120,22 180,48 250,36 C320,24 380,48 500,36 L500,50 L0,50 Z" />
        </svg>
      </div>
    </div>
  );
}
