'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReviewSlider from '@/components/ReviewSlider';

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

export default function ContactPage() {
  const today = new Date();
  const [cfg, setCfg] = useState<Record<string, string>>({
    phone: '',
    whatsapp_number: '919876543210',
    contact_email: 'hello@goaboatworld.com',
    address: 'Panjim Jetty, Goa, India',
    business_hours: 'Everyday: 9:00 AM – 8:00 PM',
    instagram_url: '',
    facebook_url: '',
    youtube_url: '',
    google_url: '',
  });
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    booking_date: undefined as Date | undefined,
    preferred_time: '',
    adults: '1',
    kids: '0',
    additional_notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/site-config')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => setCfg((p) => ({ ...p, ...data })))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.phone) {
      toast.error('Name and phone are required');
      return;
    }
    const toastId = toast.loading('Sending your request...');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        booking_date: form.booking_date ? form.booking_date.toISOString().split('T')[0] : '',
      };
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      toast.success("Request sent! We'll be in touch shortly.", { id: toastId });
    } catch {
      toast.error('Something went wrong. Please try again.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const socialLinks = [
    { href: cfg.instagram_url, label: 'Instagram', Icon: InstagramIcon },
    { href: cfg.facebook_url, label: 'Facebook', Icon: FacebookIcon },
    { href: cfg.youtube_url, label: 'YouTube', Icon: YoutubeIcon },
    { href: cfg.google_url, label: 'Google', Icon: GoogleIcon },
  ].filter((s) => s.href);

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1A3C35] text-[14px] font-medium transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        <div className="text-center mb-20">
          <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-xs mb-4">
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-6xl font-playfair-display font-bold text-[#1A3C35] mb-6">
            Let's Plan Your Experience
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Tell us about your date, group size, and occasion. Our team will help you find the right
            sailing experience in Goa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-playfair-display font-bold text-[#1A3C35]">
                Contact Details
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <Phone className="w-6 h-6" />,
                    label: 'Phone / WhatsApp',
                    value: cfg.phone,
                  },
                  {
                    icon: <Mail className="w-6 h-6" />,
                    label: 'Email Address',
                    value: cfg.contact_email,
                  },
                  {
                    icon: <MapPin className="w-6 h-6" />,
                    label: 'Departure Point',
                    value: cfg.address,
                  },
                  {
                    icon: <Clock className="w-6 h-6" />,
                    label: 'Business Hours',
                    value: cfg.business_hours,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-[#1A3C35] text-[#3D9B7D] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                        {item.label}
                      </p>
                      <p className="text-xl font-bold text-[#1A3C35]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {socialLinks.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-playfair-display font-bold text-[#1A3C35]">
                  Follow Our Journey
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {socialLinks.map(({ href, label, Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-12 h-12 border border-gray-200 flex items-center justify-center text-[#1A3C35] hover:bg-[#1A3C35] hover:text-white hover:border-[#1A3C35] transition-all"
                    >
                      <Icon />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quote Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-12 shadow-2xl border-t-4 border-[#3D9B7D]">
            <h2 className="text-3xl font-playfair-display font-bold text-[#1A3C35] mb-4">
              Request a Quote
            </h2>
            <p className="text-gray-500 mb-8">
              Fill out the form below and we'll get back with a personalized sailing plan.
            </p>
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-[#1A3C35] mb-2">Request Sent!</h3>
                <p className="text-gray-500">
                  We'll contact you shortly to discuss your experience.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1A3C35] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      required
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#3D9B7D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1A3C35] mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#3D9B7D]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#1A3C35] mb-1.5">
                    Email <span className="text-gray-400 font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#3D9B7D]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1A3C35] mb-1.5">
                      Booking Date
                    </label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal border-gray-200 rounded-xl px-4 py-6 text-[14px] focus:outline-none focus:border-[#3D9B7D] transition-colors',
                            !form.booking_date && 'text-gray-400'
                          )}
                        >
                          {form.booking_date ? (
                            form.booking_date.toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={form.booking_date}
                          onSelect={(date) => {
                            setForm({ ...form, booking_date: date });
                            setIsCalendarOpen(false);
                          }}
                          disabled={(date) => date < today}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1A3C35] mb-1.5">
                      Preferred Time
                    </label>
                    <select
                      value={form.preferred_time}
                      onChange={(e) => setForm({ ...form, preferred_time: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#3D9B7D] bg-white"
                    >
                      <option value="">Select time</option>
                      <option>Morning (7 AM – 11 AM)</option>
                      <option>Afternoon (11 AM – 3 PM)</option>
                      <option>Sunset (4 PM – 7 PM)</option>
                      <option>Evening (7 PM – 10 PM)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1A3C35] mb-1.5">
                      Adults
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="500"
                      value={form.adults}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (val.length <= 3 && parseInt(val) <= 500)) {
                          setForm({ ...form, adults: val });
                        }
                      }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#3D9B7D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1A3C35] mb-1.5">
                      Kids
                    </label>
                    <select
                      value={form.kids}
                      onChange={(e) => setForm({ ...form, kids: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#3D9B7D] bg-white"
                    >
                      <option value="0">0 Kids</option>
                      <option value="1">1 Kid</option>
                      <option value="2">2 Kids</option>
                      <option value="3">3 Kids</option>
                      <option value="4">4 Kids</option>
                      <option value="5">5 Kids</option>
                      <option value="6">6 Kids</option>
                      <option value="Others">More than 6</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#1A3C35] mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    value={form.additional_notes}
                    onChange={(e) => setForm({ ...form, additional_notes: e.target.value })}
                    placeholder="Special requests, occasion, add-ons..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#3D9B7D] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-xl py-4 text-[15px] font-bold transition-all disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Quotation'}
                </button>
                <p className="text-center text-[12px] text-gray-400">
                  No payment required • We reply within 1 hour
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="mt-24">
        <ReviewSlider googleReviewUrl={cfg.google_url} />
      </div>
    </div>
  );
}
