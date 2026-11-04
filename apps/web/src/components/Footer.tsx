'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const FacebookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const Footer = () => {
  const [cfg, setCfg] = useState<Record<string, string>>({
    phone: '+91 [Phone Placeholder]',
    whatsapp_number: '919876543210',
    contact_email: 'hello@goaboatworld.com',
    address: 'Panjim, Goa, India',
    business_hours: 'Everyday: 9:00 AM – 8:00 PM',
    instagram_url: '',
    facebook_url: '',
    youtube_url: '',
    google_url: '',
  });

  useEffect(() => {
    fetch('/api/site-config')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => setCfg((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const socialLinks = [
    { href: cfg.instagram_url, label: 'Instagram', Icon: InstagramIcon },
    { href: cfg.facebook_url, label: 'Facebook', Icon: FacebookIcon },
    { href: cfg.youtube_url, label: 'YouTube', Icon: YoutubeIcon },
    { href: cfg.google_url, label: 'Google', Icon: GoogleIcon },
  ].filter((s) => s.href);

  return (
    <footer className="bg-[#1A3C35] text-white">
      <div className="max-w-[1400px] mx-auto px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-5 text-center lg:text-left">
            <Link href="/" className="flex items-center justify-center lg:justify-start">
              <span className="text-[26px] font-playfair-display font-semibold">Goaboatworld</span>
            </Link>
            <p className="text-white/60 leading-relaxed text-[15px] max-w-sm mx-auto lg:mx-0">
              Premium private yacht experiences and boat charters in Goa. Curated for celebrations,
              sunsets, and unforgettable moments on the water.
            </p>
            {/* Social icons — dynamically shown from admin config */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-11 h-11 rounded-sm border border-white/20 flex items-center justify-center hover:border-[#3D9B7D] hover:bg-[#3D9B7D]/10 transition-all duration-300"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Explore */}
          <div className="lg:col-span-2 space-y-4 text-center lg:text-left">
            <h4 className="text-[15px] font-semibold uppercase tracking-wider text-white/90">
              Explore
            </h4>
            <ul className="flex flex-wrap gap-x-5 gap-y-3 justify-center lg:justify-start lg:flex-col lg:gap-0 lg:space-y-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'Our Yachts', href: '/fleet' },
                { name: 'Experiences', href: '/experiences' },
                { name: 'About Us', href: '/about' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#3D9B7D] transition-colors text-[15px] inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2 space-y-4 text-center lg:text-left">
            <h4 className="text-[15px] font-semibold uppercase tracking-wider text-white/90">
              Support
            </h4>
            <ul className="flex flex-wrap gap-x-5 gap-y-3 justify-center lg:justify-start lg:flex-col lg:gap-0 lg:space-y-4">
              {[
                { name: 'Contact', href: '/contact' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Refund Policy', href: '/cancellation-refund' },
                { name: 'Terms & Conditions', href: '/terms' },
                { name: 'Admin', href: '/admin' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#3D9B7D] transition-colors text-[15px] inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info — from admin config */}
          <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
            <h4 className="text-[15px] font-semibold uppercase tracking-wider text-white/90">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 justify-center lg:justify-start">
                <Phone className="w-5 h-5 text-[#3D9B7D] shrink-0 mt-0.5" />
                <a
                  href={`tel:${cfg.phone}`}
                  className="text-white/90 text-[15px] hover:text-[#3D9B7D] transition-colors"
                >
                  {cfg.phone}
                </a>
              </li>
              <li className="flex items-start gap-4 justify-center lg:justify-start">
                <Mail className="w-5 h-5 text-[#3D9B7D] shrink-0 mt-0.5" />
                <a
                  href={`mailto:${cfg.contact_email}`}
                  className="text-white/90 text-[15px] hover:text-[#3D9B7D] transition-colors"
                >
                  {cfg.contact_email}
                </a>
              </li>
              <li className="flex items-start gap-4 justify-center lg:justify-start">
                <MapPin className="w-5 h-5 text-[#3D9B7D] shrink-0 mt-0.5" />
                <p className="text-white/90 text-[15px]">{cfg.address}</p>
              </li>
              <li className="flex items-start gap-4 justify-center lg:justify-start">
                <Clock className="w-5 h-5 text-[#3D9B7D] shrink-0 mt-0.5" />
                <p className="text-white/90 text-[15px]">{cfg.business_hours}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-[14px]">
          <p>© 2026 Goaboatworld. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
