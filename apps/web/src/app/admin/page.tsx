'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus,
  Trash2,
  Save,
  LogOut,
  Ship,
  Edit2,
  X,
  Image as ImageIcon,
  LayoutGrid,
  Inbox,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import useUpload from '@/utils/useUpload';
import GalleryAdminTab from '@/components/GalleryAdminTab';
import ExperiencesAdminTab from '@/components/ExperiencesAdminTab';
import SEOContentTab from '@/components/SEOContentTab';
import SafeDate from '@/components/SafeDate';
import { Switch } from '@/components/ui/switch';

/* ──────────────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────────────── */
interface Amenity {
  id: number;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  sort_order: number;
}
interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email: string;
  date: string;
  yacht_id: string;
  preferred_time: string;
  adults: number;
  kids: number;
  additional_notes: string;
  hours: string;
  num_people: number;
  occasion: string;
  created_at: string;
  status?: 'pending' | 'completed';
}
interface YachtDB {
  id: string;
  name: string;
  description: string;
  why_choose: string;
  type: string;
  capacity: number;
  duration: string;
  sailing_price: number;
  sailing_price_2hr: number;
  anchorage_price: number;
  banner_image: string;
  images: string[];
  inclusions: string[];
  exclusions: string[];
  best_for: string[];
  promo_label: string;
  reel_url: string;
  live_video_url: string;
  is_active: boolean;
  sort_order: number;
}

const BLANK_YACHT: Partial<YachtDB> = {
  name: '',
  description: '',
  why_choose: '',
  type: '',
  capacity: 10,
  duration: '1–4 Hours',
  sailing_price: 0,
  sailing_price_2hr: 0,
  anchorage_price: 0,
  banner_image: '',
  images: [],
  inclusions: [],
  exclusions: [],
  best_for: [],
  promo_label: '',
  reel_url: '',
  live_video_url: '',
  is_active: true,
  sort_order: 99,
};

/* ──────────────────────────────────────────────────────────────────
   Small building blocks
────────────────────────────────────────────────────────────────── */

function Field({
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

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#3D9B7D] focus:ring-2 focus:ring-[#3D9B7D]/10 transition-colors bg-white';

function FormattedTextArea({
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


function TagListEditor({
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

function ImageListEditor({
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
  const fileRef = useRef<HTMLInputElement>(null);

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

function Row({
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

/* ──────────────────────────────────────────────────────────────────
   Amenities editor (per yacht)
────────────────────────────────────────────────────────────────── */
function AmenitiesEditor({
  yachtId,
  adminPw,
  amenities,
  setAmenities,
}: {
  yachtId: string;
  adminPw: string;
  amenities: Amenity[];
  setAmenities: (a: Amenity[]) => void;
}) {
  const tempIdRef = useRef(-1);

  const addAmenity = () => {
    const id = tempIdRef.current;
    tempIdRef.current -= 1;
    setAmenities([
      ...amenities,
      { id, name: '', description: '', icon: 'Check', enabled: true, sort_order: amenities.length },
    ]);
  };

  const update = (id: number, patch: Partial<Amenity>) => {
    setAmenities(amenities.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  return (
    <div className="space-y-3">
      {amenities.length === 0 && (
        <p className="text-[13px] text-gray-400 py-4 text-center">
          No amenities yet. Add icons like capacity, AC, music, captain.
        </p>
      )}
      {amenities.map((a) => (
        <div
          key={a.id}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
            a.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
          }`}
        >
          <input
            value={a.icon}
            onChange={(e) => update(a.id, { icon: e.target.value })}
            placeholder="Icon"
            className="w-16 shrink-0 border border-gray-200 rounded-lg px-2 py-2 text-[13px] text-center focus:outline-none focus:border-[#3D9B7D]"
          />
          <div className="flex-1 min-w-0 space-y-1.5">
            <input
              value={a.name}
              onChange={(e) => update(a.id, { name: e.target.value })}
              placeholder="Amenity name (e.g. AC, Captain)"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] font-semibold focus:outline-none focus:border-[#3D9B7D]"
            />
            <input
              value={a.description}
              onChange={(e) => update(a.id, { description: e.target.value })}
              placeholder="Short label (e.g. Fully Air Conditioned)"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] text-gray-500 focus:outline-none focus:border-[#3D9B7D]"
            />
          </div>
          <Switch checked={a.enabled} onCheckedChange={(v) => update(a.id, { enabled: v })} />
          <button
            type="button"
            onClick={async () => {
              setAmenities(amenities.filter((x) => x.id !== a.id));
              if (a.id > 0 && yachtId) {
                await fetch(`/api/yacht-amenities/${yachtId}`, {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ adminPassword: adminPw, id: a.id }),
                });
              }
            }}
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 transition-colors"
            aria-label="Delete amenity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addAmenity}
        className="flex items-center gap-1.5 text-[13px] font-semibold text-[#3D9B7D] hover:text-[#2A6655] transition-colors"
      >
        <Plus className="w-4 h-4" /> Add amenity
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Content tab (homepage settings)
────────────────────────────────────────────────────────────────── */
const CONTENT_FIELDS: { key: string; label: string; textarea?: boolean }[] = [
  { key: 'hero_banner_url', label: 'Hero Banner Image URL' },
  { key: 'hero_video_url', label: 'Hero Video URL (Direct Link/YouTube)' },
  { key: 'hero_headline', label: 'Hero Headline' },
  { key: 'hero_subtext', label: 'Hero Subtext', textarea: true },
  { key: 'experiences_section_title', label: 'Experiences Section Title' },
  { key: 'whatsapp_number', label: 'WhatsApp Number' },
  { key: 'contact_email', label: 'Contact Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'business_hours', label: 'Business Hours' },
  { key: 'instagram_url', label: 'Instagram URL' },
  { key: 'facebook_url', label: 'Facebook URL' },
  { key: 'youtube_url', label: 'YouTube URL' },
  { key: 'terms_conditions_content', label: 'Terms & Conditions Content', textarea: true },
  { key: 'privacy_policy_content', label: 'Privacy Policy Content', textarea: true },
  { key: 'cancellation_refund_policy_content', label: 'Cancellation & Refund Policy Content', textarea: true },
];

function ContentTab({
  adminPw,
  siteConfig,
  onSaved,
}: {
  adminPw: string;
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
        body: JSON.stringify({ adminPassword: adminPw, updates: values }),
      });
      if (!res.ok) throw new Error();
      toast.success('Content saved');
      onSaved();
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {CONTENT_FIELDS.map((f) => (
        f.textarea ? (
          <FormattedTextArea
            key={f.key}
            label={f.label}
            value={values[f.key] ?? ''}
            onChange={(v) => setValues({ ...values, [f.key]: v })}
          />
        ) : (
          <Field key={f.key} label={f.label}>
            <input
              value={values[f.key] ?? ''}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              className={inputCls}
            />
          </Field>
        )
      ))}
      <button
        onClick={save}
        disabled={saving}
        className="flex items-center justify-center gap-2 bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-xl px-8 h-12 text-[14px] font-bold transition-colors disabled:opacity-50"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Content'}
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Main admin page
────────────────────────────────────────────────────────────────── */
type Tab = 'yachts' | 'inquiries' | 'content' | 'gallery' | 'experiences' | 'seo';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'inquiries', label: 'Inquiries', icon: <Inbox className="w-4 h-4" /> },
  { id: 'content', label: 'Content', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'experiences', label: 'Experiences', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'yachts', label: 'Yachts', icon: <Ship className="w-4 h-4" /> },
  { id: 'seo', label: 'SEO Content', icon: <LayoutGrid className="w-4 h-4" /> },
];

export default function AdminPage() {
  /* Auth */
  const [adminPw, setAdminPw] = useState('');
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loginError, setLoginError] = useState('');

  /* Data */
  const [yachts, setYachts] = useState<YachtDB[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  /* UI */
  const [tab, setTab] = useState<Tab>('inquiries');


  /* Yacht editor */
  const [editing, setEditing] = useState<Partial<YachtDB> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [savingYacht, setSavingYacht] = useState(false);
  const { upload, uploading } = useUpload();

  /* ── Auth ── */
  const tryLogin = async (pw: string) => {
    try {
      const res = await fetch('/api/site-config');
      const data = await res.json();
      if (data.admin_password === undefined) {
        // No password set yet — accept anything on first run
        setLoggedIn(true);
        return true;
      }
      // Password exists but is not returned by API; verify via a write ping
      const check = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: pw, updates: {} }),
      });
      if (check.ok) {
        setLoggedIn(true);
        sessionStorage.setItem('bms_admin_pw', pw);
        return true;
      }
      setLoginError('Incorrect password');
      return false;
    } catch {
      setLoginError('Login failed. Try again.');
      return false;
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('bms_admin_pw');
    if (saved) {
      setAdminPw(saved);
      tryLogin(saved).then((ok) => {
        setLoggedIn(ok);
      });
    } else {
      setLoggedIn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Data fetchers ── */
  const fetchYachts = useCallback(async () => {
    try {
      const res = await fetch('/api/yachts-master');
      const data = await res.json();
      const list: YachtDB[] = Array.isArray(data) ? data : data.yachts || [];
      setYachts(list);
    } catch {
      toast.error('Could not load yachts');
    }
  }, []);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : data.inquiries || []);
    } catch {
      toast.error('Could not load inquiries');
    }
  }, []);

  const deleteInquiry = async (id: number) => {
    if (!confirm('Delete this inquiry permanently?')) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Inquiry deleted');
      fetchInquiries();
    } catch {
      toast.error('Delete failed');
    }
  };

  const markInquiryComplete = async (id: number) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      if (!res.ok) throw new Error();
      toast.success('Marked as complete');
      fetchInquiries();
    } catch {
      toast.error('Update failed');
    }
  };

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/site-config');
      setConfig(await res.json());
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    Promise.all([fetchYachts(), fetchInquiries(), fetchConfig()]).finally(() => setLoading(false));
  }, [loggedIn, fetchYachts, fetchInquiries, fetchConfig]);

  /* ── Yacht editor open ── */
  const openYacht = async (y: YachtDB | null) => {
    if (y) {
      setIsNew(false);
      setEditing({ ...y });
    } else {
      setIsNew(true);
      setEditing({ ...BLANK_YACHT });
    }
    setAmenities([]);
    if (y) {
      try {
        const res = await fetch(`/api/yacht-amenities/${y.id}`);
        if (res.ok) setAmenities(await res.json());
      } catch {
        /* silent */
      }
    }
  };

  const closeYacht = () => {
    setEditing(null);
    setAmenities([]);
  };

  /* ── Single save: yacht + amenities ── */
  const saveYacht = async () => {
    if (!editing) return;
    if (!editing.name?.trim()) {
      toast.error('Yacht name is required');
      return;
    }
    setSavingYacht(true);
    try {
      const payload = {
        adminPassword: adminPw,
        ...editing,
        images: editing.images ?? [],
        inclusions: editing.inclusions ?? [],
        exclusions: editing.exclusions ?? [],
        best_for: editing.best_for ?? [],
      };

      if (isNew) {
        const res = await fetch('/api/yachts-master', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch(`/api/yachts-master/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
      }

      // Save amenities (new + changed)
      const yachtId = isNew
        ? ((await (await fetch('/api/yachts-master')).json()).find?.(
            (x: YachtDB) => x.name === editing.name
          )?.id ?? editing.id)
        : editing.id;

      for (const a of amenities) {
        const body = {
          adminPassword: adminPw,
          name: a.name,
          description: a.description,
          icon: a.icon,
          enabled: a.enabled,
          sort_order: a.sort_order,
        };
        if (a.id < 0) {
          await fetch(`/api/yacht-amenities/${yachtId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
        } else {
          await fetch(`/api/yacht-amenities/${yachtId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...body, id: a.id }),
          });
        }
      }

      toast.success('Yacht saved');
      closeYacht();
      fetchYachts();
    } catch {
      toast.error('Save failed. Check all fields and try again.');
    } finally {
      setSavingYacht(false);
    }
  };

  /* ── Delete yacht ── */
  const deleteYacht = async (id: string) => {
    if (!confirm('Delete this yacht permanently?')) return;
    try {
      const res = await fetch(`/api/yachts-master/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: adminPw }),
      });
      if (!res.ok) throw new Error();
      toast.success('Yacht deleted');
      fetchYachts();
    } catch {
      toast.error('Delete failed');
    }
  };

  /* ═══════════ LOGIN SCREEN ═══════════ */
  if (loggedIn === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3D9B7D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#1A3C35] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Ship className="w-6 h-6 text-[#3D9B7D]" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Goaboatworld Admin</h1>
            <p className="text-[13px] text-gray-400 mt-1">Sign in to manage your website</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              tryLogin(adminPw);
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={adminPw}
              onChange={(e) => setAdminPw(e.target.value)}
              placeholder="Admin password"
              autoFocus
              className={inputCls}
            />
            {loginError && <p className="text-[13px] text-red-500">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-xl h-12 text-[14px] font-bold transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ═══════════ MAIN LAYOUT ═══════════ */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1A3C35] rounded-lg flex items-center justify-center">
              <Ship className="w-4.5 h-4.5 text-[#3D9B7D]" />
            </div>
            <span className="font-bold text-gray-900">Goaboatworld Admin</span>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('bms_admin_pw');
              setLoggedIn(false);
              setAdminPw('');
            }}
            className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                closeYacht();
              }}
              className={`flex items-center gap-2 px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'border-[#3D9B7D] text-[#1A3C35]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24">
        {/* ═══════════ YACHTS ═══════════ */}
        {tab === 'yachts' && !editing && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Your Yachts ({yachts.length})</h2>
              <button
                onClick={() => openYacht(null)}
                className="flex items-center gap-2 bg-[#3D9B7D] hover:bg-[#2A6655] text-white rounded-xl px-5 h-11 text-[14px] font-bold transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Yacht
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {yachts.map((y) => (
                  <div
                    key={y.id}
                    className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {y.banner_image ? (
                        <img src={y.banner_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 truncate">{y.name}</p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            y.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {y.is_active ? 'Live' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-400 mt-0.5">
                        {y.type || '—'} · {y.capacity} guests · ₹
                        {y.sailing_price?.toLocaleString('en-IN')}/hr
                      </p>
                    </div>
                    <button
                      onClick={() => openYacht(y)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#3D9B7D] hover:bg-gray-50 transition-colors"
                      aria-label={`Edit ${y.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteYacht(y.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label={`Delete ${y.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {yachts.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <Ship className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-[14px]">No yachts yet. Add your first one.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ YACHT EDITOR ═══════════ */}
        {tab === 'yachts' && editing && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {isNew ? 'Add New Yacht' : `Edit: ${editing.name}`}
              </h2>
              <button
                onClick={closeYacht}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close editor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Basics */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide">
                  Basics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Yacht Name">
                    <input
                      value={editing.name ?? ''}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className={inputCls}
                      placeholder="Majesty 66"
                    />
                  </Field>
                  <Field label="Type">
                    <input
                      value={editing.type ?? ''}
                      onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                      className={inputCls}
                      placeholder="Luxury Yacht"
                    />
                  </Field>
                  <Field label="Max Capacity">
                    <input
                      type="number"
                      value={editing.capacity ?? 0}
                      onChange={(e) =>
                        setEditing({ ...editing, capacity: parseInt(e.target.value) || 0 })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Duration">
                    <input
                      value={editing.duration ?? ''}
                      onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                      className={inputCls}
                      placeholder="1–4 Hours"
                    />
                  </Field>
                </div>
                <Field label="Description">
                  <textarea
                    rows={3}
                    value={editing.description ?? ''}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    className={inputCls + ' resize-none'}
                  />
                </Field>
                <Field label="Why Choose This Yacht">
                  <textarea
                    rows={3}
                    value={editing.why_choose ?? ''}
                    onChange={(e) => setEditing({ ...editing, why_choose: e.target.value })}
                    className={inputCls + ' resize-none'}
                  />
                </Field>
              </section>

              {/* Pricing */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide">
                  Pricing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <Field label="1 Hour (₹)">
                    <input
                      type="number"
                      value={editing.sailing_price ?? 0}
                      onChange={(e) =>
                        setEditing({ ...editing, sailing_price: parseInt(e.target.value) || 0 })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="2 Hours (₹)">
                    <input
                      type="number"
                      value={editing.sailing_price_2hr ?? 0}
                      onChange={(e) =>
                        setEditing({ ...editing, sailing_price_2hr: parseInt(e.target.value) || 0 })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Anchorage (₹)">
                    <input
                      type="number"
                      value={editing.anchorage_price ?? 0}
                      onChange={(e) =>
                        setEditing({ ...editing, anchorage_price: parseInt(e.target.value) || 0 })
                      }
                      className={inputCls}
                    />
                  </Field>
                </div>
                <Field
                  label="Promo Label"
                  hint="Optional badge, e.g. Best Seller. Leave empty for none."
                >
                  <input
                    value={editing.promo_label ?? ''}
                    onChange={(e) => setEditing({ ...editing, promo_label: e.target.value })}
                    className={inputCls}
                    placeholder="Best Seller"
                  />
                </Field>
              </section>

              {/* Media */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide">
                  Media
                </h3>
                <ImageListEditor
                  images={editing.images ?? []}
                  onChange={(v) => setEditing({ ...editing, images: v })}
                  upload={upload}
                  uploading={uploading}
                />
                <Field label="Reel Video URL" hint="YouTube or direct .mp4 link">
                  <input
                    value={editing.reel_url ?? ''}
                    onChange={(e) => setEditing({ ...editing, reel_url: e.target.value })}
                    className={inputCls}
                    placeholder="https://youtube.com/watch?v=…"
                  />
                </Field>
                <Field label="Live Video URL" hint="YouTube or direct .mp4 link">
                  <input
                    value={editing.live_video_url ?? ''}
                    onChange={(e) => setEditing({ ...editing, live_video_url: e.target.value })}
                    className={inputCls}
                    placeholder="https://youtube.com/watch?v=…"
                  />
                </Field>
              </section>

              {/* Lists */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide">
                  Details
                </h3>
                <TagListEditor
                  label="Inclusions"
                  items={editing.inclusions ?? []}
                  onChange={(v) => setEditing({ ...editing, inclusions: v })}
                  placeholder="e.g. Soft drinks and water"
                />
                <TagListEditor
                  label="Exclusions"
                  items={editing.exclusions ?? []}
                  onChange={(v) => setEditing({ ...editing, exclusions: v })}
                  placeholder="e.g. Alcohol"
                />
                <TagListEditor
                  label="Best For"
                  items={editing.best_for ?? []}
                  onChange={(v) => setEditing({ ...editing, best_for: v })}
                  placeholder="e.g. Birthdays"
                />
              </section>

              {/* Amenities */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                <div>
                  <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide">
                    Amenity Icons
                  </h3>
                  <p className="text-[12px] text-gray-400 mt-1">
                    Shown as icon chips on the yacht page. Toggle to show or hide each one.
                  </p>
                </div>
                <AmenitiesEditor
                  yachtId={editing.id ?? ''}
                  adminPw={adminPw}
                  amenities={amenities}
                  setAmenities={setAmenities}
                />
              </section>

              {/* Visibility */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide mb-2">
                  Visibility
                </h3>
                <Row
                  title="Show on website"
                  description="Hidden yachts are not visible to visitors."
                  checked={editing.is_active ?? true}
                  onChange={(v) => setEditing({ ...editing, is_active: v })}
                />
              </section>
            </div>

            {/* Single sticky save bar */}
            <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-gray-50/95 backdrop-blur border-t border-gray-200 mt-8 flex gap-3">
              <button
                onClick={saveYacht}
                disabled={savingYacht}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-xl h-12 text-[14px] font-bold transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingYacht ? 'Saving…' : isNew ? 'Create Yacht' : 'Save Changes'}
              </button>
              <button
                onClick={closeYacht}
                className="px-6 h-12 rounded-xl border border-gray-300 text-gray-600 text-[14px] font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ═══════════ INQUIRIES ═══════════ */}
        {tab === 'inquiries' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Booking Inquiries ({inquiries.length})
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Inbox className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-[14px]">No inquiries yet.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Pending Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                    Pending Requests
                  </h3>
                  {inquiries.filter(i => i.status !== 'completed').map((inq) => (
                    <div key={inq.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-all shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0">
                            {inq.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-900 truncate">{inq.name}</p>
                              <span className="text-[10px] text-gray-400">
                                <SafeDate date={inq.created_at} />
                              </span>
                            </div>
                            <p className="text-[13px] text-gray-500 truncate">
                              {inq.phone} • {inq.email || 'No email'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => markInquiryComplete(inq.id)}
                            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors border border-green-100"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => deleteInquiry(inq.id)}
                            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-gray-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-50">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                          <p className="text-[13px] text-gray-700 font-medium">
                            {inq.date ? <SafeDate date={inq.date} options={{ day: 'numeric', month: 'short' }} /> : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guests</p>
                          <p className="text-[13px] text-gray-700 font-medium">
                            {inq.num_people || 0} Total
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Occasion & Notes</p>
                          <p className="text-[13px] text-gray-700 font-medium truncate">
                            {inq.occasion || inq.additional_notes || '—'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${inq.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] bg-[#25D366] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#1db954] transition-colors"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                      {inq.additional_notes && inq.occasion && (
                        <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-[12px] text-gray-600 italic">"{inq.additional_notes}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Completed Section */}
                <div className="space-y-2 opacity-60">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-300 rounded-full" />
                    Completed
                  </h3>
                  {inquiries.filter(i => i.status === 'completed').map((inq) => (
                    <div key={inq.id} className="bg-gray-50 rounded-xl border border-gray-100 p-3 flex items-center justify-between group transition-all hover:bg-white hover:border-gray-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">
                          {inq.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-gray-700 truncate">{inq.name}</p>
                          <p className="text-[11px] text-gray-400 truncate">{inq.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-gray-400 font-medium">
                          <SafeDate date={inq.created_at} />
                        </span>
                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ CONTENT ═══════════ */}
        {tab === 'content' && (
          <ContentTab adminPw={adminPw} siteConfig={config} onSaved={fetchConfig} />
        )}

        {/* ═══════════ SEO CONTENT ═══════════ */}
        {tab === 'seo' && (
          <SEOContentTab adminPw={adminPw} siteConfig={config} onSaved={fetchConfig} />
        )}

        {/* ═══════════ GALLERY ═══════════ */}
        {tab === 'gallery' && <GalleryAdminTab adminPw={adminPw} />}

        {/* ═══════════ EXPERIENCES ═══════════ */}
        {tab === 'experiences' && (
          <ExperiencesAdminTab
            adminPw={adminPw}
            upload={upload}
            uploading={uploading}
          />
        )}
      </main>
    </div>
  );
}
