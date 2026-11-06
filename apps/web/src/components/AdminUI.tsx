'use client';

import React from 'react';
import { Trash2, Plus, Upload, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#3D9B7D] focus:ring-2 focus:ring-[#3D9B7D]/10 transition-colors bg-white';

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[12px] font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export function FormattedTextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
        rows={4}
      />
    </Field>
  );
}

export function TagListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="w-10 shrink-0 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
              aria-label={`Remove item ${i + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#3D9B7D] hover:text-[#2A6655] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add item
        </button>
      </div>
    </Field>
  );
}

export function ImageListEditor({
  images,
  onChange,
  upload,
  uploading,
}: {
  images: string[];
  onChange: (v: string[]) => void;
  upload: (f: File) => Promise<string | null>;
  uploading: boolean;
}) {
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) onChange([...images, url]);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <Field label={`Photos (${images.length})`} hint="First photo is used as the card image.">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute top-1.5 left-1.5 bg-[#1A3C35] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((_, j) => j !== i))}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove photo"
            >
              <X className="w-3.5 h-3.5 text-gray-700" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-[#3D9B7D] hover:text-[#3D9B7D] transition-colors"
        >
          <Upload className="w-5 h-5" />
          <span className="text-[11px] font-semibold">{uploading ? 'Uploading…' : 'Upload'}</span>
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </Field>
  );
}

export function Row({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-[14px] font-semibold text-gray-900">{title}</p>
        {description && <p className="text-[12px] text-gray-400 mt-0.5">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
