'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Save, X, Image as ImageIcon, Upload, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface Experience {
  id: number;
  title: string;
  description: string;
  images: string[];
  is_active: boolean;
  sort_order: number;
  keywords?: string;
}

const BLANK_EXPERIENCE: Partial<Experience> = {
  title: '',
  description: '',
  images: [],
  is_active: true,
  sort_order: 0,
  keywords: '',
};

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
    if (images.length >= 5) {
      toast.error('Maximum 5 photos allowed per experience');
      return;
    }
    const url = await upload(file);
    if (url) onChange([...images, url]);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <Field label={`Photos (${images.length}/5)`}>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
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
        {images.length < 5 && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-[#3D9B7D] hover:text-[#3D9B7D] transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="text-[11px] font-semibold">{uploading ? 'Uploading…' : 'Upload'}</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </Field>
  );
}

export default function ExperiencesAdminTab({ adminPw, upload, uploading }: { adminPw: string, upload: (f: File) => Promise<string | null>, uploading: boolean }) {

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/experiences');
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Could not load experiences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExperiences(); }, [fetchExperiences]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // This is now handled inside ImageListEditor
  };

  const saveExperience = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/experiences' : `/api/experiences/${editing.id}`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editing, adminPassword: adminPw }),
      });

      if (!res.ok) throw new Error();
      toast.success(isNew ? 'Experience created' : 'Experience updated');
      setEditing(null);
      fetchExperiences();
    } catch {
      toast.error('Save failed');
    }
  };

  const deleteExperience = async (id: number) => {
    if (!confirm('Delete this experience permanently?')) return;
    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: adminPw }),
      });
      if (!res.ok) throw new Error();
      toast.success('Experience deleted');
      fetchExperiences();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Manage Experiences</h2>
        <button
          onClick={() => { setIsNew(true); setEditing({ ...BLANK_EXPERIENCE }); }}
          className="flex items-center gap-2 bg-[#3D9B7D] hover:bg-[#2A6655] text-white rounded-xl px-5 h-11 text-[14px] font-bold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {editing ? (
        <div className="max-w-2xl bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">{isNew ? 'New Experience' : 'Edit Experience'}</h3>
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <Field label="Title">
              <input
                value={editing.title ?? ''}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className={inputCls}
                placeholder="e.g. Romantic Sunset Sail"
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={3}
                value={editing.description ?? ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className={inputCls + ' resize-none'}
                placeholder="Describe the vibe and what to expect..."
              />
            </Field>
            <Field label="Photos" hint="Up to 5 photos. First photo is used as the experience tile.">
              <ImageListEditor
                images={editing.images ?? []}
                onChange={(v) => setEditing({ ...editing, images: v })}
                upload={upload}
                uploading={uploading}
              />
            </Field>
            <Field label="Sort Order">
              <input
                type="number"
                value={editing.sort_order ?? 0}
                onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                className={inputCls}
              />
            </Field>
            <Field label="SEO Keywords" hint="Comma-separated keywords for Google search (e.g. romantic cruise, yacht party Goa). Not visible to users.">
              <input
                value={editing.keywords ?? ''}
                onChange={(e) => setEditing({ ...editing, keywords: e.target.value })}
                className={inputCls}
                placeholder="luxury yacht, romantic dinner, private party"
              />
            </Field>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={saveExperience}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-xl h-12 text-[14px] font-bold transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isNew ? 'Create Experience' : 'Save Changes'}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-6 h-12 rounded-xl border border-gray-300 text-gray-600 text-[14px] font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {loading ? (
            [1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)
          ) : experiences.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-[14px]">No experiences yet. Create some to attract guests!</p>
            </div>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {exp.images && exp.images.length > 0 ? (
                    <img src={exp.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900 truncate">{exp.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${exp.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {exp.is_active ? 'Live' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-400 truncate">{exp.description || 'No description'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setIsNew(false); setEditing({ ...exp }); }}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#3D9B7D] hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteExperience(exp.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
