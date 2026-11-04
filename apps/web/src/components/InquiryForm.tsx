'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { yachts } from '@/data/yachts';

interface InquiryFormProps {
  yachtId?: string;
  compact?: boolean;
}

const InquiryForm = ({ yachtId, compact = false }: InquiryFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, full_name: data.name }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      toast.success('Inquiry sent successfully! We will contact you soon.');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-5' : 'space-y-6'}>
      <div className={compact ? 'grid gap-5' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[14px] font-medium text-gray-700">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            className="rounded-sm border-gray-200 h-11 text-[15px] focus:border-[#3D9B7D] focus:ring-[#3D9B7D]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[14px] font-medium text-gray-700">
            Phone / WhatsApp
          </Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+91 98765 43210"
            required
            className="rounded-sm border-gray-200 h-11 text-[15px] focus:border-[#3D9B7D] focus:ring-[#3D9B7D]"
          />
        </div>
      </div>

      <div className={compact ? 'grid gap-5' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[14px] font-medium text-gray-700">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            className="rounded-sm border-gray-200 h-11 text-[15px] focus:border-[#3D9B7D] focus:ring-[#3D9B7D]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date" className="text-[14px] font-medium text-gray-700">
            Preferred Date
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            className="rounded-sm border-gray-200 h-11 text-[15px] focus:border-[#3D9B7D] focus:ring-[#3D9B7D]"
          />
        </div>
      </div>

      <div className={compact ? 'grid gap-5' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}>
        <div className="space-y-2">
          <Label htmlFor="guests" className="text-[14px] font-medium text-gray-700">
            Number of Guests
          </Label>
          <Input
            id="guests"
            name="guests"
            type="number"
            min="1"
            placeholder="4"
            required
            className="rounded-sm border-gray-200 h-11 text-[15px] focus:border-[#3D9B7D] focus:ring-[#3D9B7D]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="occasion" className="text-[14px] font-medium text-gray-700">
            Occasion
          </Label>
          <Select name="occasion">
            <SelectTrigger className="rounded-sm border-gray-200 h-11 text-[15px] focus:border-[#3D9B7D] focus:ring-[#3D9B7D]">
              <SelectValue placeholder="Select Occasion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="birthday">Birthday Celebration</SelectItem>
              <SelectItem value="anniversary">Anniversary</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="corporate">Corporate Event</SelectItem>
              <SelectItem value="leisure">Leisure Cruise</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!yachtId && (
        <div className="space-y-2">
          <Label htmlFor="yacht_id" className="text-[14px] font-medium text-gray-700">
            Preferred Yacht (Optional)
          </Label>
          <Select name="yacht_id">
            <SelectTrigger className="rounded-sm border-gray-200 h-11 text-[15px] focus:border-[#3D9B7D] focus:ring-[#3D9B7D]">
              <SelectValue placeholder="Select a Yacht" />
            </SelectTrigger>
            <SelectContent>
              {yachts.map((yacht) => (
                <SelectItem key={yacht.id} value={yacht.id}>
                  {yacht.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {yachtId && <input type="hidden" name="yacht_id" value={yachtId} />}

      <div className="space-y-2">
        <Label htmlFor="message" className="text-[14px] font-medium text-gray-700">
          Additional Requirements
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us more about your plans..."
          className="rounded-sm border-gray-200 min-h-[120px] text-[15px] focus:border-[#3D9B7D] focus:ring-[#3D9B7D]"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-sm h-12 text-[15px] font-medium transition-all duration-300"
      >
        {loading ? 'Sending Inquiry...' : 'Request a Booking Quote'}
      </Button>

      <p className="text-center text-[13px] text-gray-400 tracking-wide">
        Private Charters • Custom Experiences • Easy Booking
      </p>
    </form>
  );
};

export default InquiryForm;
