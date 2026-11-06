'use client';

import React, { useEffect, useState, useMemo, useRef, Suspense, useCallback } from 'react';
import YachtCard from '@/components/YachtCard';
import { type Yacht } from '@/data/yachts';
import Link from 'next/link';
import { MessageCircle, Phone, SlidersHorizontal, X, Users, IndianRupee, ChevronDown, LayoutGrid, Ship } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import AnimatedSection from '@/components/AnimatedSection';

/* ── DB shape ─────────────────────────────────────────────────── */
interface DBYacht {
  id: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  sailing_price: number;
  sailing_price_2hr: number;
  banner_image: string;
  images: unknown;
  promo_label: string;
  is_active: boolean;
  sort_order: number;
}

function parseImgs(v: unknown): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      return JSON.parse(v);
    } catch {
      return [];
    }
  }
  return [];
}

function dbToCard(y: any): Yacht {
  const imgs = parseImgs(y.images);
  const all = y.banner_image ? [y.banner_image, ...imgs.filter((u: any) => u !== y.banner_image)] : imgs;
  const unique = Array.from(new Set(all));
  return {
    id: y.id,
    name: y.name,
    type: y.type_name || y.type,
    capacity: y.capacity,
    duration: '1–4 Hours',
    description: y.description,
    price: '₹' + y.sailing_price.toLocaleString('en-IN'),
    rawPrice: y.sailing_price,
    promoLabel: y.promo_label || undefined,
    photoCount: unique.length,
    priceTiers: [
      {
        label: '1 HOUR TRIP',
        duration: '1 Hr',
        price: '₹' + y.sailing_price.toLocaleString('en-IN'),
        rawPrice: y.sailing_price,
      },
      {
        label: '2 HOURS TRIP',
        duration: '2 Hrs',
        price: '₹' + y.sailing_price_2hr.toLocaleString('en-IN'),
        rawPrice: y.sailing_price_2hr,
      },
    ],
    images: unique.length
      ? unique
      : [
          'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop',
        ],
    whyChoose: '',
    inclusions: [],
    exclusions: [],
    highlights: [],
    bestFor: [],
  };
}

function getUniqueOptions(options: { id: string | number; name: string }[]) {
  const seen = new Set();
  return options.filter(opt => {
    const duplicate = seen.has(opt.name);
    seen.add(opt.name);
    return !duplicate;
  });
}

/* ── Range slider component ───────────────────────────────────── */
function PriceSlider({
  label,
  icon,
  min,
  max,
  step,
  value,
  onChange,
  format,
  showPlusAtMax = false,
}: {
  label: string;
  icon: React.ReactNode;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (n: number) => string;
  showPlusAtMax?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeThumb = useRef<boolean>(false);

  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  function getValFromPointer(clientX: number): number {
    if (!trackRef.current) return min;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);

    // Snap to 5k increments for the first 35k
    if (raw <= 35000) {
      return Math.round(raw / 5000) * 5000;
    }
    return Math.round(raw / step) * step;
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    activeThumb.current = true;
    const v = getValFromPointer(e.clientX);
    onChange(v);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!activeThumb.current) return;
    const v = getValFromPointer(e.clientX);
    onChange(v);
  }

  function handlePointerUp() {
    activeThumb.current = false;
  }

  return (
    <div className="flex-1 min-w-[220px]">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-[13px] font-bold text-[#1A3C35] uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="px-2.5">
        <div
          ref={trackRef}
          className="relative h-2 rounded-full bg-gray-200 cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className="absolute h-2 rounded-full bg-[#3D9B7D] pointer-events-none"
            style={{ left: '0', right: `${100 - pct(value)}%` }}
          />
          <div
            className="absolute w-5 h-5 rounded-full bg-white border-2 border-[#3D9B7D] shadow-md pointer-events-none transition-transform"
            style={{ left: `${pct(value)}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </div>
        <div className="flex justify-between items-center mt-3 gap-2">
          <span className="text-[11px] text-gray-500 font-medium bg-gray-100 rounded-lg px-2.5 py-1 whitespace-nowrap">
            {value >= max ? 'All' : `Up to ${format(value)}`}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Select Filter Component ────────────────────────────────────── */
function SelectFilter({
  label,
  icon,
  options,
  selected,
  onChange,
  placeholder = 'All',
}: {
  label: string;
  icon: React.ReactNode;
  options: { id: string | number; name: string }[];
  selected: (string | number)[];
  onChange: (v: (string | number)[]) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const uniqueOptions = useMemo(() => {
    const seen = new Set();
    return options.filter(opt => {
      const duplicate = seen.has(opt.name);
      seen.add(opt.name);
      return !duplicate;
    });
  }, [options]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (id: string | number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((i) => i !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const toggleAll = () => {
    if (selected.length === uniqueOptions.length) {
      onChange([]);
    } else {
      onChange(uniqueOptions.map(o => o.id));
    }
  };

  const selectedLabel = selected.length === 0
    ? placeholder
    : selected.length === uniqueOptions.length
      ? 'All'
      : selected.length === 1
        ? uniqueOptions.find(o => o.id === selected[0])?.name || 'Selected'
        : `${selected.length} selected`;

  return (
    <div ref={containerRef} className="relative flex-1 min-w-[160px]">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[11px] font-bold text-[#1A3C35] uppercase tracking-wider opacity-70">
          {label}
        </span>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:border-[#3D9B7D] transition-all focus:outline-none"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 max-h-60 overflow-y-auto custom-scrollbar">
          <label
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-[13px] font-bold text-gray-700"
          >
            <input
              type="checkbox"
              checked={selected.length === 0 || selected.length === uniqueOptions.length}
              onChange={toggleAll}
              className="w-4 h-4 rounded border-gray-300 text-[#3D9B7D] focus:ring-[#3D9B7D]"
            />
            All
          </label>
          <div className="my-1 border-t border-gray-100" />
          {uniqueOptions.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-[13px] text-gray-600"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.id)}
                onChange={() => toggleOption(opt.id)}
                className="w-4 h-4 rounded border-gray-300 text-[#3D9B7D] focus:ring-[#3D9B7D]"
              />
              {opt.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Guest Select Component ────────────────────────────────────── */
function GuestSelect({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const options = [
    { id: 0, name: 'All' },
    { id: 2, name: '2-5 Guests' },
    { id: 5, name: '5-10 Guests' },
    { id: 10, name: '10-15 Guests' },
    { id: 15, name: '15-20 Guests' },
    { id: 20, name: '20-25 Guests' },
    { id: 25, name: '25+ Guests' },
  ];

  return (
    <div className="flex-1 min-w-[160px]">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-[#3D9B7D]" />
        <span className="text-[11px] font-bold text-[#1A3C35] uppercase tracking-wider opacity-70">
          Guests
        </span>
      </div>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:border-[#3D9B7D] transition-all focus:outline-none appearance-none cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <div className="relative">
          <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────── */
function FleetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allYachts, setAllYachts] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Filter State ── */
  const [categories, setCategories] = useState<(string | number)[]>([]);
  const [types, setTypes] = useState<(string | number)[]>([]);
  const [occasions, setOccasions] = useState<(string | number)[]>([]);
  const [amenities, setAmenities] = useState<(string | number)[]>([]);
  const [priceMaxFilter, setPriceMaxFilter] = useState<number>(100000);
  const [guestCount, setGuestCount] = useState<number>(0);
  const [sort, setSort] = useState('recommended');

  /* ── Configuration Lists ── */
  const [catList, setCatList] = useState<{ id: number; name: string }[]>([]);
  const [typeList, setTypeList] = useState<{ id: number; name: string }[]>([]);
  const [occList, setOccList] = useState<{ id: number; name: string }[]>([]);
  const [amenityList, setAmenityList] = useState<{ id: number; name: string }[]>([]);

  const [priceMax, setPriceMax] = useState(100000);
  const [filtersVisible, setFiltersVisible] = useState(false);

  /* ── Fetch Config Lists ── */
  useEffect(() => {
    Promise.all([
      fetch('/api/yacht-categories').then(r => r.json()),
      fetch('/api/yacht-types').then(r => r.json()),
      fetch('/api/yacht-occasions').then(r => r.json()),
    ]).then(([cats, typs, occs]) => {
      setCatList(cats);
      setTypeList(typs);
      setOccList(occs);
    });
  }, []);

  /* ── Fetch Yachts (with filters & sort) ── */
  const fetchYachts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      const uniqueCats = getUniqueOptions(catList);
      if (categories.length && categories.length !== uniqueCats.length) {
        params.append('category', categories.join(','));
      }

      const uniqueTyps = getUniqueOptions(typeList);
      if (types.length && types.length !== uniqueTyps.length) {
        params.append('type', types.join(','));
      }

      const uniqueOccs = getUniqueOptions(occList);
      if (occasions.length && occasions.length !== uniqueOccs.length) {
        params.append('occasion', occasions.join(','));
      }

      if (amenities.length) params.append('amenities', amenities.join(','));
      if (guestCount > 0) params.append('guests', guestCount.toString());
      params.append('price_min', '0');
      if (priceMaxFilter < priceMax) {
        params.append('price_max', priceMaxFilter.toString());
      }
      params.append('sort', sort);


      const res = await fetch(`/api/yachts-master?${params.toString()}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.yachts || [];
      const active = list
        .filter((y: any) => y.is_active)
        .map(dbToCard);
      setAllYachts(active);

      if (active.length) {
        const maxPrice = Math.max(...active.map((y) => y.rawPrice));
        const roundedMaxPrice = Math.max(100000, Math.ceil(maxPrice / 5000) * 5000);
        setPriceMax(roundedMaxPrice);
        if (priceMaxFilter === 100000) setPriceMaxFilter(roundedMaxPrice);
      }
    } catch {
      setAllYachts([]);
    } finally {
      setLoading(false);
    }
  }, [categories, types, occasions, amenities, guestCount, priceMaxFilter, sort, priceMax]);

  useEffect(() => {
    fetchYachts();
  }, [fetchYachts]);

  /* ── URL Sync ── */
  useEffect(() => {
    const cat = searchParams.get('category');
    const typ = searchParams.get('type');
    const occ = searchParams.get('occasion');
    const ams = searchParams.get('amenities');
    const gst = searchParams.get('guests');
    const srt = searchParams.get('sort');

    if (cat) setCategories(cat.split(',').map(v => isNaN(Number(v)) ? v : Number(v)));
    if (typ) setTypes(typ.split(',').map(v => isNaN(Number(v)) ? v : Number(v)));
    if (occ) setOccasions(occ.split(',').map(v => isNaN(Number(v)) ? v : Number(v)));
    if (ams) setAmenities(ams.split(',').map(v => isNaN(Number(v)) ? v : Number(v)));
    if (gst) setGuestCount(parseInt(gst));
    if (srt) setSort(srt);

    if (cat || typ || occ || ams || gst || srt) setFiltersVisible(true);
  }, [searchParams]);

  const updateURL = (overrides?: {
    categories?: (string | number)[];
    types?: (string | number)[];
    occasions?: (string | number)[];
    amenities?: (string | number)[];
    guestCount?: number;
    priceMaxFilter?: number;
    sort?: string;
  }) => {
    const params = new URLSearchParams();
    const c = overrides?.categories ?? categories;
    const t = overrides?.types ?? types;
    const o = overrides?.occasions ?? occasions;
    const a = overrides?.amenities ?? amenities;
    const g = overrides?.guestCount ?? guestCount;
    const p = overrides?.priceMaxFilter ?? priceMaxFilter;
    const s = overrides?.sort ?? sort;

    if (c.length) params.set('category', c.join(','));
    if (t.length) params.set('type', t.join(','));
    if (o.length) params.set('occasion', o.join(','));
    if (a.length) params.set('amenities', a.join(','));
    if (g > 0) params.set('guests', g.toString());
    if (p < priceMax) params.set('price_max', p.toString());
    if (s !== 'recommended') params.set('sort', s);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const resetFilters = () => {
    setCategories([]);
    setTypes([]);
    setOccasions([]);
    setAmenities([]);
    setGuestCount(0);
    setPriceMaxFilter(priceMax);
    setSort('recommended');
    updateURL({
      categories: [],
      types: [],
      occasions: [],
      amenities: [],
      guestCount: 0,
      priceMaxFilter: priceMax,
      sort: 'recommended',
    });
  };

  const formatPrice = (n: number) => `₹${(n / 1000).toFixed(0)}k`;
  const formatGuest = (n: number) => `${n}`;

  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Heading ── */}
        <div className="relative text-center mb-10">
          <div className="absolute top-0 right-0 -translate-y-1/2 md:translate-y-0 z-20">
            <button
              onClick={() => setFiltersVisible((v) => !v)}
              className={`p-2.5 rounded-full shadow-md transition-all ${
                filtersVisible
                  ? 'bg-white text-[#1A3C35] border border-[#D0E8DF]'
                  : 'bg-[#1A3C35] text-white'
              }`}
              title={filtersVisible ? 'Hide Filters' : 'Filter Yachts'}
            >
              <SlidersHorizontal className="w-5 h-5" />
              {(categories.length || types.length || occasions.length || amenities.length || guestCount > 2 || sort !== 'recommended') && !filtersVisible && (
                <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-[#3D9B7D] ring-2 ring-white" />
              )}
            </button>
          </div>
          <AnimatedSection delay={0.1}>
            <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-xs mb-3">
              Our Fleet
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <h1 className="text-4xl md:text-5xl font-playfair-display font-bold text-[#1A3C35] mb-4 leading-tight">
              Book Yacht Based on Your
              <br className="hidden md:block" /> Group Size &amp; Budget
            </h1>
          </AnimatedSection>
        </div>
        {/* ── Filters & Sorting ── */}
                {filtersVisible && (
          <div className="bg-[#F8FAFA] border border-[#D0E8DF] rounded-2xl p-5 md:p-6 mb-10 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
              {/* Left: Price Range */}
              <div className="w-full lg:w-1/3">
                <PriceSlider
                  label="Price"
                  icon={<IndianRupee className="w-4 h-4 text-[#3D9B7D]" />}
                  min={0}
                  max={priceMax}
                  step={1000}
                  value={priceMaxFilter}
                  onChange={(v) => { setPriceMaxFilter(v); updateURL({ priceMaxFilter: v }); }}
                  format={formatPrice}
                  showPlusAtMax
                />
              </div>
              <div className="hidden lg:block w-px bg-[#D0E8DF] h-24" />
              {/* Right: Dropdown Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 flex-1">
                <SelectFilter
                  label="Category"
                  icon={<LayoutGrid className="w-4 h-4 text-[#3D9B7D]" />}
                  options={catList}
                  selected={categories}
                  onChange={(v) => { setCategories(v); updateURL({ categories: v }); }}
                />
                <SelectFilter
                  label="Yacht Type"
                  icon={<Ship className="w-4 h-4 text-[#3D9B7D]" />}
                  options={typeList}
                  selected={types}
                  onChange={(v) => { setTypes(v); updateURL({ types: v }); }}
                />
                <SelectFilter
                  label="Occasion"
                  icon={<LayoutGrid className="w-4 h-4 text-[#3D9B7D]" />}
                  options={occList}
                  selected={occasions}
                  onChange={(v) => { setOccasions(v); updateURL({ occasions: v }); }}
                />
                <GuestSelect
                  value={guestCount}
                  onChange={(v) => { setGuestCount(v); updateURL({ guestCount: v }); }}
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D0E8DF]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-400 font-medium">Sort by:</span>
                    <div className="relative group">
                      <select
                        value={sort}
                        onChange={(e) => { setSort(e.target.value); updateURL({ sort: e.target.value }); }}
                        className="appearance-none bg-transparent text-[13px] font-bold text-[#1A3C35] pr-6 pl-0 focus:outline-none cursor-pointer"
                      >
                        <option value="recommended">Recommended</option>
                        <option value="popular">Most Popular</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="guests_asc">Capacity: Low to High</option>
                        <option value="guests_desc">Capacity: High to Low</option>
                        <option value="newest">Newest First</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[13px] text-gray-500 font-medium">
                    Showing <span className="font-bold text-[#1A3C35]">{allYachts.length}</span> yachts
                  </p>
                  <button
                    onClick={resetFilters}
                    className="text-[13px] font-semibold text-[#3D9B7D] hover:text-[#1A3C35] underline underline-offset-2 transition-colors"
                  >
                    Show All Yachts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        { (categories.length || types.length || occasions.length || amenities.length || guestCount > 0 || sort !== 'recommended') && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.length > 0 && (
              categories.length === getUniqueOptions(catList).length ? (
                <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">
                  <span>All Categories</span>
                  <button onClick={() => {
                    setCategories([]);
                    updateURL({ categories: [] });
                  }} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </div>
              ) : (
                categories.map(c => (
                  <div key={c} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">
                    <span>{catList.find(item => item.id === c)?.name || c}</span>
                    <button onClick={() => {
                      const next = categories.filter(id => id !== c);
                      setCategories(next);
                      updateURL({ categories: next });
                    }} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </div>
                ))
              )
            )}
            {types.length > 0 && (
              types.length === getUniqueOptions(typeList).length ? (
                <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">
                  <span>All Types</span>
                  <button onClick={() => {
                    setTypes([]);
                    updateURL({ types: [] });
                  }} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </div>
              ) : (
                types.map(t => (
                  <div key={t} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">
                    <span>{typeList.find(item => item.id === t)?.name || t}</span>
                    <button onClick={() => {
                      const next = types.filter(id => id !== t);
                      setTypes(next);
                      updateURL({ types: next });
                    }} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </div>
                ))
              )
            )}
            {occasions.length > 0 && (
              occasions.length === getUniqueOptions(occList).length ? (
                <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">
                  <span>All Occasions</span>
                  <button onClick={() => {
                    setOccasions([]);
                    updateURL({ occasions: [] });
                  }} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </div>
              ) : (
                occasions.map(o => (
                  <div key={o} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">
                    <span>{occList.find(item => item.id === o)?.name || o}</span>
                    <button onClick={() => {
                      const next = occasions.filter(id => id !== o);
                      setOccasions(next);
                      updateURL({ occasions: next });
                    }} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </div>
                ))
              )
            )}
            {amenities.map(a => (
              <div key={a} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">
                <span>{amenityList.find(item => item.id === a)?.name || a}</span>
                <button onClick={() => {
                  const next = amenities.filter(id => id !== a);
                  setAmenities(next);
                  updateURL({ amenities: next });
                }} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </div>
            ))}
            {guestCount > 0 && (
              <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">
                <span>Guests: {guestCount}+</span>
                <button onClick={() => {
                  setGuestCount(0);
                  updateURL({ guestCount: 0 });
                }} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </div>
            )}
            {sort !== 'recommended' && (
              <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">
                <span>Sorted by: {sort.replace('_', ' ')}</span>
                <button onClick={() => {
                  setSort('recommended');
                  updateURL({ sort: 'recommended' });
                }} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </div>
            )}
            <button
              onClick={resetFilters}
              className="text-[12px] font-bold text-red-500 hover:text-red-700 ml-2 underline underline-offset-2"
            >
              Clear All
            </button>
          </div>
        )}
        {/* ── Yacht Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-[500px]" style={{ opacity: 0.6 }} />
            ))}
          </div>
        ) : allYachts.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#1A3C35] mb-2">No yachts match your filters</h3>
            <p className="text-gray-400 mb-6 text-[14px]">
              Try adjusting the guest count or price range.
            </p>
            <button
              onClick={resetFilters}
              className="bg-[#3D9B7D] text-white rounded-xl px-8 py-3 font-bold text-[14px] hover:bg-[#2A6655] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allYachts.map((yacht, i) => (
              <AnimatedSection key={yacht.id} delay={0.1 * (i % 3)}>
                <YachtCard yacht={yacht} />
              </AnimatedSection>
            ))}
          </div>
        )}
        {/* ── Custom charter CTA ── */}
        <div className="mt-24 relative overflow-hidden rounded-3xl bg-[#1A3C35] text-white">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="relative z-10 px-8 md:px-16 py-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left max-w-xl">
              <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-xs mb-4">
                Custom Charter
              </p>
              <h2 className="text-3xl md:text-4xl font-playfair-display font-bold mb-4 leading-snug">
                Looking for Something Specific?
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed">
                We are constantly expanding our fleet. If you don't see the perfect yacht for your
                occasion, contact us and we'll help you find a custom solution.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2.5 bg-[#3D9B7D] hover:bg-[#2A6655] text-white rounded-xl px-8 py-4 text-[14px] font-bold transition-all whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                Enquire for Custom Options
              </Link>
              <a
                href="https://wa.me/918446225985?text=Hi%20Goaboatworld!%20I%20need%20help%20finding%20a%20custom%20yacht%20charter."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1db954] text-white rounded-xl px-8 py-4 text-[14px] font-bold transition-all whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FleetSkeleton() {
  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="bms-skeleton h-4 w-20 mx-auto mb-3 rounded" />
          <div className="bms-skeleton h-12 w-96 mx-auto mb-4 rounded" />
          <div className="bms-skeleton h-5 w-72 mx-auto rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bms-skeleton rounded-2xl h-[500px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FleetPage() {
  return (
    <Suspense fallback={<FleetSkeleton />}>
      <FleetContent />
    </Suspense>
  );
}
