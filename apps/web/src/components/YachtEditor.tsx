'use client';

import React from 'react';
import { Save, X } from 'lucide-react';
import {
  Field,
  FormattedTextArea,
  TagListEditor,
  ImageListEditor,
  Row,
  inputCls,
} from './AdminUI';

interface Amenity {
  id: number;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  sort_order: number;
}

interface YachtDB {
  id: string;
  name: string;
  description: string;
  why_choose: string;
  type: string;
  type_id: number;
  category_id: number;
  is_featured: boolean;
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

interface YachtEditorProps {
  yacht: Partial<YachtDB>;
  setEditing: React.Dispatch<React.SetStateAction<Partial<YachtDB> | null>>;
  isNew: boolean;
  amenities: Amenity[];
  setAmenities: (a: Amenity[]) => void;
  selectedOccasions: number[];
  setSelectedOccasions: (o: number[]) => void;
  occasionsList: { id: number; name: string }[];
  upload: (f: File) => Promise<string | null>;
  uploading: boolean;
  onSave: () => Promise<void>;
  onClose: () => void;
  saving: boolean;
}

export default function YachtEditor({
  yacht,
  setEditing,
  isNew,
  amenities,
  setAmenities,
  selectedOccasions,
  setSelectedOccasions,
  occasionsList,
  upload,
  uploading,
  onSave,
  onClose,
  saving,
}: YachtEditorProps) {
  const updateYacht = (patch: Partial<YachtDB>) => {
    setEditing((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const num = (v: string) => (v === '' ? 0 : parseInt(v) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isNew ? 'Add New Yacht' : `Edit ${yacht.name}`}
            </h2>
            <p className="text-[13px] text-gray-400">Configure yacht specifications, pricing and images</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Yacht Name">
                  <input
                    value={yacht.name ?? ''}
                    onChange={(e) => updateYacht({ name: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Promo Label">
                  <input
                    value={yacht.promo_label ?? ''}
                    onChange={(e) => updateYacht({ promo_label: e.target.value })}
                    className={inputCls}
                  />
                </Field>
              </div>

              <FormattedTextArea
                label="Description"
                value={yacht.description ?? ''}
                onChange={(v) => updateYacht({ description: v })}
              />

              <FormattedTextArea
                label="Why Choose This Yacht?"
                value={yacht.why_choose ?? ''}
                onChange={(v) => updateYacht({ why_choose: v })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Capacity (Guests)">
                  <input
                    type="number"
                    value={yacht.capacity ?? 0}
                    onChange={(e) => updateYacht({ capacity: num(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Duration">
                  <input
                    value={yacht.duration ?? ''}
                    onChange={(e) => updateYacht({ duration: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Sort Order">
                  <input
                    type="number"
                    value={yacht.sort_order ?? 0}
                    onChange={(e) => updateYacht({ sort_order: num(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Sailing Price/hr">
                  <input
                    type="number"
                    value={yacht.sailing_price ?? 0}
                    onChange={(e) => updateYacht({ sailing_price: num(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Sailing Price (2hr)">
                  <input
                    type="number"
                    value={yacht.sailing_price_2hr ?? 0}
                    onChange={(e) => updateYacht({ sailing_price_2hr: num(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Anchorage Price">
                  <input
                    type="number"
                    value={yacht.anchorage_price ?? 0}
                    onChange={(e) => updateYacht({ anchorage_price: num(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Reel URL">
                  <input
                    value={yacht.reel_url ?? ''}
                    onChange={(e) => updateYacht({ reel_url: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Live Video URL">
                  <input
                    value={yacht.live_video_url ?? ''}
                    onChange={(e) => updateYacht({ live_video_url: e.target.value })}
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TagListEditor
                  label="Inclusions"
                  items={yacht.inclusions || []}
                  onChange={(v) => updateYacht({ inclusions: v })}
                  placeholder="e.g. Captain, Water"
                />
                <TagListEditor
                  label="Exclusions"
                  items={yacht.exclusions || []}
                  onChange={(v) => updateYacht({ exclusions: v })}
                  placeholder="e.g. Food, Alcohol"
                />
              </div>

              <TagListEditor
                label="Best For"
                items={yacht.best_for || []}
                onChange={(v) => updateYacht({ best_for: v })}
                placeholder="e.g. Birthdays, Couples"
              />
            </div>

            {/* Sidebar: Images, Occasions, etc. */}
            <div className="space-y-6">
              <ImageListEditor
                images={yacht.images || []}
                onChange={(v) => updateYacht({ images: v })}
                upload={upload}
                uploading={uploading}
              />

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Occasions</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {occasionsList.map((occ) => (
                    <label key={occ.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors text-[13px] text-gray-600">
                      <input
                        type="checkbox"
                        checked={selectedOccasions.includes(occ.id)}
                        onChange={() => {
                          if (selectedOccasions.includes(occ.id)) {
                            setSelectedOccasions(selectedOccasions.filter(id => id !== occ.id));
                          } else {
                            setSelectedOccasions([...selectedOccasions, occ.id]);
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-[#3D9B7D] focus:ring-[#3D9B7D]"
                      />
                      {occ.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Yacht Status</h3>
                <Row
                  title="Featured"
                  checked={yacht.is_featured || false}
                  onChange={(v) => updateYacht({ is_featured: v })}
                />
                <Row
                  title="Active"
                  checked={yacht.is_active || false}
                  onChange={(v) => updateYacht({ is_active: v })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 h-11 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-xl px-8 h-11 font-bold transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Yacht'}
          </button>
        </div>
      </div>
    </div>
  );
}
