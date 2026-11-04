'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Camera, X, CalendarDays, Ship } from 'lucide-react';
import { toast } from 'sonner';
import useUpload from '@/utils/useUpload';

interface GalleryPhoto {
  id: number;
  image_url: string;
  caption: string;
  trip_date: string | null;
  yacht_name: string;
  category: string;
  created_at: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(d: string | null): string {
  if (!d) return '';
  const parts = d.substring(0, 10).split('-');
  if (parts.length !== 3) return d;
  const [year, month, day] = parts;
  const monthName = MONTHS[parseInt(month, 10) - 1] || month;
  return `${parseInt(day, 10)} ${monthName} ${year}`;
}

const CAT_EMOJI: Record<string, string> = {
  'Birthday Party': '🎂',
  'Sunset Cruise': '🌅',
  'Couple Experience': '💑',
  'Corporate Event': '💼',
  Proposal: '💍',
  'Friends Outing': '🎉',
  Anniversary: '❤️',
  'Family Trip': '👨‍👩‍👧',
};

const PRESET_CATEGORIES = Object.keys(CAT_EMOJI);

interface Props {
  adminPw: string;
}

export default function GalleryAdminTab({ adminPw }: Props) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterYacht, setFilterYacht] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [yachtList, setYachtList] = useState<string[]>([]);

  // Form state
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [yachtName, setYachtName] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [usingCustomCat, setUsingCustomCat] = useState(false);

  const { upload, uploading } = useUpload();

  // Fetch yachts from db for dropdown
  useEffect(() => {
    fetch('/api/yachts-master')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : data.yachts || [];
        setYachtList(list.map((y: { name: string }) => y.name));
      })
      .catch(() => {});
  }, []);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '200', offset: '0' });
      if (filterYacht) params.set('yacht', filterYacht);
      if (filterCat) params.set('category', filterCat);
      const res = await fetch(`/api/gallery?${params}`);
      if (!res.ok) return;
      setPhotos(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [filterYacht, filterCat]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file);
      if (url) setImageUrl(url);
    } catch {
      toast.error('Upload failed');
    }
  };

  const handleAdd = async () => {
    if (!imageUrl) {
      toast.error('Please upload or paste a photo URL');
      return;
    }
    const finalCategory = usingCustomCat ? customCategory : category;
    setSaving(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword: adminPw,
          image_url: imageUrl,
          caption,
          trip_date: tripDate || null,
          yacht_name: yachtName,
          category: finalCategory,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Photo added to gallery!');
      setImageUrl('');
      setCaption('');
      setTripDate('');
      setYachtName('');
      setCategory('');
      setCustomCategory('');
      setShowAdd(false);
      fetchPhotos();
    } catch {
      toast.error('Failed to add photo');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this photo?')) return;
    try {
      const res = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: adminPw, id }),
      });
      if (!res.ok) throw new Error();
      toast.success('Deleted');
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header row ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#1A3C35]">Trip Gallery</h2>
          <p className="text-sm text-gray-400 mt-0.5">{photos.length} photos · latest first</p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 bg-[#1A3C35] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-[#2A6655] transition-colors"
        >
          {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAdd ? 'Cancel' : 'Add Trip Photo'}
        </button>
      </div>

      {/* ── Add photo form ── */}
      {showAdd && (
        <div className="bg-[#F8FAFA] border border-[#D0E8DF] rounded-2xl p-6 space-y-5">
          <h3 className="font-bold text-[#1A3C35] flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#3D9B7D]" /> Upload Trip Photo
          </h3>

          {/* Image upload + preview */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 space-y-3">
              {/* File upload */}
              <label className="flex items-center gap-3 bg-white border-2 border-dashed border-[#D0E8DF] hover:border-[#3D9B7D] rounded-xl p-4 cursor-pointer transition-colors">
                <Camera className="w-5 h-5 text-[#3D9B7D]" />
                <div>
                  <p className="text-sm font-semibold text-[#1A3C35]">
                    {uploading ? 'Uploading...' : 'Click to upload photo'}
                  </p>
                  <p className="text-xs text-gray-400">JPG, PNG, WEBP accepted</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Or paste URL */}
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste image URL…"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#3D9B7D]"
              />
            </div>

            {/* Preview */}
            {imageUrl && (
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-[#D0E8DF] shrink-0">
                <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImageUrl('')}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Caption */}
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional) e.g. Happy birthday Priya! 🎂"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#3D9B7D]"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Trip Date */}
            <div>
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                <CalendarDays className="w-3.5 h-3.5 inline mr-1" /> Trip Date
              </label>
              <input
                type="date"
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#3D9B7D]"
              />
            </div>

            {/* Yacht */}
            <div>
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                <Ship className="w-3.5 h-3.5 inline mr-1" /> Yacht
              </label>
              <select
                value={yachtName}
                onChange={(e) => setYachtName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#3D9B7D]"
              >
                <option value="">Select yacht…</option>
                {yachtList.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                Trip Category
              </label>
              {usingCustomCat ? (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Custom category…"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#3D9B7D]"
                  />
                  <button
                    onClick={() => setUsingCustomCat(false)}
                    className="text-gray-400 hover:text-red-500 px-2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#3D9B7D]"
                  >
                    <option value="">Select category…</option>
                    {PRESET_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {CAT_EMOJI[c]} {c}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setUsingCustomCat(true)}
                    className="text-[11px] font-bold text-[#3D9B7D] border border-[#3D9B7D] rounded-lg px-2 whitespace-nowrap hover:bg-[#3D9B7D] hover:text-white transition-colors"
                  >
                    + New
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={saving || uploading || !imageUrl}
            className="bg-[#3D9B7D] hover:bg-[#2A6655] text-white rounded-xl px-8 py-3 font-bold text-[13px] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                style={{ animation: 'spin 0.8s linear infinite' }}
              />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add to Gallery
          </button>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={filterYacht}
          onChange={(e) => setFilterYacht(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[13px] focus:outline-none focus:border-[#3D9B7D]"
        >
          <option value="">All Yachts</option>
          {yachtList.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[13px] focus:outline-none focus:border-[#3D9B7D]"
        >
          <option value="">All Categories</option>
          {PRESET_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CAT_EMOJI[c]} {c}
            </option>
          ))}
        </select>
        {(filterYacht || filterCat) && (
          <button
            onClick={() => {
              setFilterYacht('');
              setFilterCat('');
            }}
            className="text-red-400 text-[12px] font-bold hover:text-red-600"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Photo Grid ── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Camera className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No photos yet</p>
          <p className="text-sm mt-1">Click &quot;Add Trip Photo&quot; to upload your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos.map((photo) => {
            const emoji = CAT_EMOJI[photo.category] || '📸';
            const dateStr = formatDate(photo.trip_date);
            return (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-transparent hover:border-[#3D9B7D] transition-all"
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-200" />

                {/* Meta on hover */}
                <div className="absolute inset-0 flex flex-col justify-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {photo.caption && (
                    <p className="text-white text-[11px] font-semibold line-clamp-1 mb-0.5">
                      {photo.caption}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-[10px]">
                      {emoji} {photo.category || '—'}
                    </span>
                    {dateStr && <span className="text-white/60 text-[10px]">{dateStr}</span>}
                  </div>
                  {photo.yacht_name && (
                    <span className="text-white/60 text-[10px] mt-0.5">⛵ {photo.yacht_name}</span>
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
