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
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import useUpload from '@/utils/useUpload';
import GalleryAdminTab from '@/components/GalleryAdminTab';
import ExperiencesAdminTab from '@/components/ExperiencesAdminTab';
import SEOContentTab from '@/components/SEOContentTab';
import SafeDate from '@/components/SafeDate';
import { Switch } from '@/components/ui/switch';
import { Field, FormattedTextArea, TagListEditor, ImageListEditor, Row, inputCls } from '@/components/AdminUI';
import YachtEditor from '@/components/YachtEditor';
import { Amenity, Inquiry, YachtDB } from '@/types/admin';

const BLANK_YACHT: Partial<YachtDB> = {
  name: '',
  description: '',
  why_choose: '',
  type: '',
  type_id: 0,
  category_id: 0,
  is_featured: false,
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
   List Manager with Expand Mode
────────────────────────────────────────────────────────────────── */
function ListManager({
  title,
  apiEndpoint,
  adminPw,
  onRefresh,
  type: itemType,
}: {
  title: string;
  apiEndpoint: string;
  adminPw: string;
  onRefresh: () => void;
  type: 'category' | 'type' | 'occasion';
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [linkedYachts, setLinkedYachts] = useState<YachtDB[]>([]);
  const [loadingYachts, setLoadingYachts] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiEndpoint);
      setItems(await res.json());
    } catch {
      toast.error(`Could not load ${title}`);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, title]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const toggleExpand = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setLoadingYachts(true);
    try {
      const params = new URLSearchParams();
      params.append(itemType, id.toString());
      const res = await fetch(`/api/yachts-master?${params.toString()}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.yachts || [];
      setLinkedYachts(list);
    } catch {
      toast.error('Failed to load linked yachts');
    } finally {
      setLoadingYachts(false);
    }
  };

  const save = async (item: any) => {
    try {
      const method = item.id ? 'PUT' : 'POST';
      const res = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, adminPassword: adminPw }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Item ${item.id ? 'updated' : 'created'}`);
      setEditing(null);
      fetchItems();
      onRefresh();
    } catch {
      toast.error('Save failed');
    }
  };

  const remove = async (id: number) => {
    if (!confirm(`Delete ${title} item?`)) return;
    try {
      const res = await fetch(`${apiEndpoint}?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: adminPw }),
      });
      if (!res.ok) throw new Error();
      toast.success('Deleted');
      fetchItems();
      onRefresh();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (editing) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-lg mx-auto">
        <h3 className="text-lg font-bold mb-4">Edit {title}</h3>
        <div className="space-y-4">
          <Field label="Name">
            <input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Sort Order">
            <input
              type="number"
              value={editing.sort_order}
              onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
              className={inputCls}
            />
          </Field>
          <Row
            title="Active"
            checked={editing.is_active}
            onChange={(v) => setEditing({ ...editing, is_active: v })}
          />
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => save(editing)}
              className="flex-1 bg-[#1A3C35] text-white rounded-xl h-11 font-bold hover:bg-[#2A6655] transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-6 h-11 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <button
          onClick={() => setEditing({ name: '', is_active: true, sort_order: items.length })}
          className="flex items-center gap-2 bg-[#3D9B7D] hover:bg-[#2A6655] text-white rounded-xl px-5 h-11 text-[14px] font-bold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add {title}
        </button>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                  >
                    {expandedId === item.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <span className="text-[12px] font-bold text-gray-400 w-6">{item.sort_order}</span>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {item.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing(item)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#3D9B7D] hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {expandedId === item.id && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-50 bg-gray-50/50">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 mt-3">Linked Yachts</p>
                  {loadingYachts ? (
                    <div className="space-y-2">
                      {[1, 2].map(i => <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />)}
                    </div>
                  ) : linkedYachts.length === 0 ? (
                    <p className="text-[13px] text-gray-400 italic">No yachts linked to this {itemType}.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {linkedYachts.map(y => (
                        <div key={y.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 text-[13px] text-gray-700">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <Ship className="w-3 h-3 text-gray-400" />
                          </div>
                          <span className="truncate font-medium">{y.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TypesManager({ adminPw, onRefresh }: { adminPw: string; onRefresh: () => void }) {
  const [activeType, setActiveType] = useState<'category' | 'type' | 'occasion'>('category');

  const typeConfigs = {
    category: { title: 'Yacht Categories', endpoint: '/api/yacht-categories' },
    type: { title: 'Yacht Types', endpoint: '/api/yacht-types' },
    occasion: { title: 'Yacht Occasions', endpoint: '/api/yacht-occasions' },
  };

  return (
    <div className="space-y-6">
      <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
        {(['category', 'type', 'occasion'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeType === t ? 'bg-white text-[#1A3C35] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {typeConfigs[t].title.replace('Yacht ', '').replace('s', '')}
          </button>
        ))}
      </div>
      <ListManager
        title={typeConfigs[activeType].title}
        apiEndpoint={typeConfigs[activeType].endpoint}
        adminPw={adminPw}
        onRefresh={onRefresh}
        type={activeType}
      />
    </div>
  );
}

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
  const [selectedOccasions, setSelectedOccasions] = useState<number[]>([]);
  const [savingYacht, setSavingYacht] = useState(false);
  const { upload, uploading } = useUpload();

  const tryLogin = async (pw: string) => {
    try {
      const res = await fetch('/api/site-config');
      const data = await res.json();
      if (data.admin_password === undefined) {
        setLoggedIn(true);
        return true;
      }
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
  }, []);

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

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/site-config');
      setConfig(await res.json());
    } catch {
      /* silent */
    }
  }, []);

  const fetchFilterLists = useCallback(async () => {
    try {
      const [catRes, typeRes, occRes] = await Promise.all([
        fetch('/api/yacht-categories'),
        fetch('/api/yacht-types'),
        fetch('/api/yacht-occasions'),
      ]);
      // In the combined tab, we don't necessarily need them here unless used elsewhere
    } catch (e) {
      console.error('Failed to fetch filter lists', e);
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    Promise.all([fetchYachts(), fetchInquiries(), fetchConfig(), fetchFilterLists()])
      .finally(() => setLoading(false));
  }, [loggedIn, fetchYachts, fetchInquiries, fetchConfig, fetchFilterLists]);

  const openYacht = async (y: YachtDB | null) => {
    if (y) {
      setIsNew(false);
      setEditing({ ...y });
    } else {
      setIsNew(true);
      setEditing({ ...BLANK_YACHT });
    }
    setAmenities([]);
    setSelectedOccasions([]);
    if (y) {
      try {
        const [amenRes, occRes] = await Promise.all([
          fetch(`/api/yacht-amenities/${y.id}`),
          fetch(`/api/yacht-occasions-map?yachtId=${y.id}`),
        ]);
        if (amenRes.ok) setAmenities(await amenRes.json());
        if (occRes.ok) {
          const occs = await occRes.json();
          setSelectedOccasions(occs.map((o: any) => o.id));
        }
      } catch {
        /* silent */
      }
    }
  };

  const closeYacht = () => {
    setEditing(null);
    setAmenities([]);
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
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
        {tab === 'types' && (
          <TypesManager adminPw={adminPw} onRefresh={fetchYachts} />
        )}
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
        {tab === 'content' && (
          <ContentTab adminPw={adminPw} siteConfig={config} onSaved={fetchConfig} />
        )}
        {tab === 'seo' && (
          <SEOContentTab adminPw={adminPw} siteConfig={config} onSaved={fetchConfig} />
        )}
        {tab === 'gallery' && <GalleryAdminTab adminPw={adminPw} />}
        {tab === 'experiences' && (
          <ExperiencesAdminTab
            adminPw={adminPw}
            upload={upload}
            uploading={uploading}
          />
        )}
      </main>

      {editing && (
        <YachtEditor
          yacht={editing}
          setEditing={setEditing}
          isNew={isNew}
          amenities={amenities}
          setAmenities={setAmenities}
          selectedOccasions={selectedOccasions}
          setSelectedOccasions={setSelectedOccasions}
          occasionsList={occasions}
          upload={upload}
          uploading={uploading}
          onSave={saveYacht}
          onClose={closeYacht}
          saving={savingYacht}
        />
      )}
    </div>
  );
}

type Tab = 'yachts' | 'inquiries' | 'content' | 'gallery' | 'experiences' | 'seo' | 'types';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'inquiries', label: 'Inquiries', icon: <Inbox className="w-4 h-4" /> },
  { id: 'content', label: 'Content', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'experiences', label: 'Experiences', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'yachts', label: 'Yachts', icon: <Ship className="w-4 h-4" /> },
  { id: 'types', label: 'Types', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'seo', label: 'SEO Content', icon: <LayoutGrid className="w-4 h-4" /> },
];
