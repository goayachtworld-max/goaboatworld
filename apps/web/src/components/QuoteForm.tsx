'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Phone, Calendar as CalendarIcon, Users, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

interface QuoteFormProps {
  yachtId: string;
  yachtName: string;
  selectedPackage: string;
  selectedPrice: string;
  waNumber: string;
}

export default function QuoteForm({
  yachtId,
  yachtName,
  selectedPackage,
  selectedPrice,
  waNumber,
}: QuoteFormProps) {
  const today = new Date();
  const nameRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    num_people: '2',
    booking_date: undefined as Date | undefined,
    preferred_time: '',
    hours: selectedPackage.includes('2') ? '2' : '1',
    notes: '',
  });

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error('Name and phone are required');
      return;
    }

    const toastId = toast.loading('Sending your request...');
    setSubmitting(true);
    try {
      const payload = {
        full_name: form.name,
        phone: form.phone,
        num_people: parseInt(form.num_people) || 0,
        booking_date: form.booking_date ? form.booking_date.toISOString().split('T')[0] : '',
        preferred_time: form.preferred_time,
        hours: form.hours,
        additional_notes: form.notes,
        yacht_id: yachtId,
        yacht_name: yachtName,
        occasion: `${selectedPackage} — ${selectedPrice}`,
      };
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed');

      setSubmitted(true);
      toast.success("Quote sent! We'll confirm shortly.", { id: toastId });
      if (typeof window !== 'undefined') {
        const waText = encodeURIComponent(
          `📋 *New Quote Request — Goaboatworld*\n\n` +
            `*Yacht:* ${yachtName}\n` +
            `*Package:* ${selectedPackage} (${selectedPrice})\n` +
            `*Name:* ${form.name}\n` +
            `*Phone:* ${form.phone}\n` +
            `*Guests:* ${form.num_people}\n` +
            `*Date:* ${form.booking_date ? form.booking_date.toLocaleDateString() : 'TBD'}\n` +
            `*Time:* ${form.preferred_time || 'TBD'}\n` +
            `*Hours:* ${form.hours}\n` +
            (form.notes ? `*Notes:* ${form.notes}` : '')
        );
        window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');
      }
    } catch {
      toast.error('Something went wrong. Please try again.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-playfair-display font-bold text-[#1A3C35] mb-2">
          Quote Sent!
        </h3>
        <p className="text-gray-500 text-[15px] mb-6 px-6">
          We've received your request for <strong className="text-[#1A3C35]">{yachtName}</strong> and will confirm
          availability shortly via WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-1.5 text-[12px] font-bold text-[#1A3C35] uppercase tracking-wide mb-1.5">
            <FileText className="w-3.5 h-3.5 text-[#3D9B7D]" /> Full Name *
          </label>
          <input
            ref={nameRef}
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Doe"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#3D9B7D] transition-colors"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-[12px] font-bold text-[#1A3C35] uppercase tracking-wide mb-1.5">
            <Phone className="w-3.5 h-3.5 text-[#3D9B7D]" /> Phone / WhatsApp *
          </label>
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#3D9B7D] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1.5 text-[12px] font-bold text-[#1A3C35] uppercase tracking-wide mb-1.5">
              <Users className="w-3.5 h-3.5 text-[#3D9B7D]" /> No. of People
            </label>
            <input
              type="number"
              min="2"
              max="500"
              value={form.num_people}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || (val.length <= 3 && parseInt(val) <= 500)) {
                  setForm({ ...form, num_people: val });
                }
              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#3D9B7D] transition-colors"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[12px] font-bold text-[#1A3C35] uppercase tracking-wide mb-1.5">
              <Clock className="w-3.5 h-3.5 text-[#3D9B7D]" /> Hours
            </label>
            <select
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#3D9B7D] transition-colors bg-white"
            >
              <option value="1">1 Hour</option>
              <option value="2">2 Hours</option>
              <option value="3">3 Hours</option>
              <option value="4">4 Hours</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="flex items-center gap-1.5 text-[12px] font-bold text-[#1A3C35] uppercase tracking-wide mb-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-[#3D9B7D]" /> Booking Date
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
          <label className="flex items-center gap-1.5 text-[12px] font-bold text-[#1A3C35] uppercase tracking-wide mb-1.5">
            <Clock className="w-3.5 h-3.5 text-[#3D9B7D]" /> Preferred Time
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Morning', 'Afternoon', 'Evening'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, preferred_time: t })}
                className={`py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-all duration-200 ${form.preferred_time === t ? 'bg-[#1A3C35] text-white border-[#1A3C35]' : 'border-gray-200 text-gray-600 hover:border-[#3D9B7D]'}`}
              >
                {t === 'Morning' ? '🌅' : t === 'Afternoon' ? '☀️' : '🌇'} {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold text-[#1A3C35] uppercase tracking-wide mb-1.5 block">
            Additional Notes <span className="text-gray-400 font-normal normal-case">(optional)</span>
          </label>
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Occasion, special requests, add-ons..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#3D9B7D] transition-colors resize-none"
          />
        </div>
      </div>

      <div className="md:col-span-2 flex items-center justify-center gap-4 pt-2">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2.5 bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-2xl h-14 px-12 text-sm sm:text-[15px] font-bold shadow-lg transition-all duration-300 disabled:opacity-50 bms-btn-press"
          >
            {submitting ? 'Sending...' : 'Send Inquiry'}
          </button>
        </div>
      </div>
    </form>
  );
}
