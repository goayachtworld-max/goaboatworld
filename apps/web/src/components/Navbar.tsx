'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Our Yachts', href: '/fleet' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-4'
      )}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <span className="text-[28px] font-playfair-display font-bold tracking-tight text-[#1A3C35]">
            Goaboatworld
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[16px] font-semibold text-[#1A3C35] hover:text-[#3D9B7D] transition-colors duration-200 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#3D9B7D] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Button
            asChild
            className="bg-[#3D9B7D] hover:bg-[#2A6655] text-white h-12 px-8 text-[15px] font-semibold rounded-sm shadow-sm transition-all duration-300"
          >
            <Link href="/contact">Book Your Yacht</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-7 h-7 text-[#1A3C35]" />
          ) : (
            <Menu className="w-7 h-7 text-[#1A3C35]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg border-t border-gray-100 mobile-menu-slide"
        >
          <div className="px-6 py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#1A3C35] text-[17px] font-semibold py-4 border-b border-gray-100 hover:text-[#3D9B7D] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Button
              asChild
              className="bg-[#3D9B7D] hover:bg-[#2A6655] text-white rounded-sm mt-4 h-12 text-[15px] font-semibold"
            >
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                Book Your Yacht
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
