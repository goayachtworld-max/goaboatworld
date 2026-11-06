'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[12px] font-semibold text-gray-700 uppercase tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#3D9B7D] focus:ring-2 focus:ring-[#3D9B7D]/10 transition-colors bg-white';

const PAGES = [
  { id: 'home', label: 'Home Page' },
  { id: 'fleet', label: 'Fleet Page' },
];

export default function SEOContentTab({
  adminToken,
  siteConfig,
  onSaved,
}: {
  adminToken: string;
  siteConfig: Record<string, string>;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(siteConfig);
  const [saving, setSaving] = useState(false);

  useEffect(() => setValues(siteConfig), [siteConfig]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminToken, updates: values }),
      });
      if (!res.ok) throw new Error();
      toast.success('SEO settings saved');
      onSaved();
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-[#1A3C35] mb-2">SEO Optimization Guide</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Optimize your Meta Titles and Descriptions to rank higher on Google.
          <br />
          <span className="font-semibold text-[#3D9B7D]">Title:</span> Keep under 60 chars. Include your main keyword (e.g., "Private Yacht Rental Goa").
          <br />
          <span className="font-semibold text-[#3D9B7D]">Description:</span> Keep under 155 chars. Be punchy and include a call to action.
        </p>
      </div>

      <div className="space-y-6">
        {PAGES.map((page) => (
          <section key={page.id} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-md font-bold text-[#1A3C35]">{page.label}</h4>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase font-bold">SEO</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label={`Page Title (${page.id})`}>
                <input
                  value={values[`${page.id}_meta_title`] ?? ''}
                  onChange={(e) => setValues({ ...values, [`${page.id}_meta_title`]: e.target.value })}
                  className={inputCls}
                  placeholder="e.g. Luxury Yacht Rental in Goa | Goaboatworld"
                />
              </Field>
              <Field label={`Keywords (${page.id})`}>
                <input
                  value={values[`${page.id}_meta_keywords`] ?? ''}
                  onChange={(e) => setValues({ ...values, [`${page.id}_meta_keywords`]: e.target.value })}
                  className={inputCls}
                  placeholder="yacht rental goa, private boat goa, luxury cruises"
                />
              </Field>
            </div>

            <Field label={`Meta Description (${page.id})`}>
              <textarea
                rows={2}
                value={values[`${page.id}_meta_description`] ?? ''}
                onChange={(e) => setValues({ ...values, [`${page.id}_meta_description`]: e.target.value })}
                className={inputCls + ' resize-none'}
                placeholder="Briefly describe the page to attract clicks from Google search..."
              />
            </Field>
          </section>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-xl px-8 h-12 text-[14px] font-bold transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save SEO Content'}
        </button>
      </div>
    </div>
  );
}
