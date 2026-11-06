'use client';

import React, { useState, useEffect, useRef, useCallback, use } from 'react';
import Link from 'next/link';
import {
  Users,
  MapPin,
  ArrowLeft,
  Check,
  X,
  Phone,
  ChevronLeft,
  ChevronRight,
  Play,
  Radio,
  Maximize2,
  Share2,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import QuoteForm from '@/components/QuoteForm';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Providers } from '@/app/providers';

const WhatsAppIcon = ({ cls = 'w-5 h-5' }: { cls?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

interface YachtData {
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
}
interface Amenity {
  id: number;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

// ── Lightbox / Mobile Gallery ─────────────────────────────────────
function Lightbox({
  images,
  startIdx,
  onClose,
}: {
  images: string[];
  startIdx: number;
  onClose: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState(startIdx);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActiveIdx((i) => Math.min(i + 1, images.length - 1));
      if (e.key === 'ArrowLeft') setActiveIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [images.length, onClose]);

  useEffect(() => {
    if (thumbsRef.current) {
      const el = thumbsRef.current.children[activeIdx] as HTMLElement;
      if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeIdx]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
      if (dx < 0) setActiveIdx((i) => Math.min(i + 1, images.length - 1));
      else setActiveIdx((i) => Math.max(i - 1, 0));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col h-screen"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-black/90 backdrop-blur-sm flex-shrink-0 border-b border-white/10 relative z-50">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[14px] font-semibold">Back to Details</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-[13px] tabular-nums">
            {activeIdx + 1} <span className="text-white/30">/ {images.length}</span>
          </span>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative w-full h-full overflow-hidden select-none">
        <img
          src={images[activeIdx]}
          alt={`Photo ${activeIdx + 1}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full object-contain"
          draggable={false}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveIdx((i) => Math.min(i + 1, images.length - 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      <div
        ref={thumbsRef}
        className="flex gap-2 overflow-x-auto bg-black/90 flex-shrink-0 px-4 py-4 relative z-50"
        style={{
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
        }}
      >
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              activeIdx === i
                ? 'border-[#3D9B7D] scale-105 opacity-100'
                : 'border-transparent opacity-50 hover:opacity-80'
            }`}
          >
            <img src={src} alt="" className="w-full h-full object-cover pointer-events-none" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Video Modal ───────────────────────────────────────────────────
function getEmbedUrl(url: string): string {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  return url;
}

function isDirectVideo(url: string): boolean {
  return /\.(mp4|mov|webm|ogg)(\?.*)?$/i.test(url);
}

function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  const embedUrl = getEmbedUrl(url);
  const direct = isDirectVideo(url);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', h);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
      style={{
        backgroundColor: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(6px)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
        style={{ marginTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Player */}
      <div
        className="relative w-full mx-4 rounded-2xl overflow-hidden shadow-2xl bg-black"
        style={{ maxWidth: '860px', aspectRatio: '16/9' }}
        onClick={(e) => e.stopPropagation()}
      >
        {direct ? (
          <video src={url} autoPlay controls playsInline className="w-full h-full" />
        ) : (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        )}
      </div>

      <p className="mt-4 text-white/35 text-[12px] select-none">
        Tap outside or press ESC to close
      </p>
    </div>
  );
}

function QuoteModal({
  isOpen,
  onClose,
  yacht,
  selectedLabel,
  selectedPriceStr,
  waNumber,
}: {
  isOpen: boolean;
  onClose: () => void;
  yacht: YachtData;
  selectedLabel: string;
  selectedPriceStr: string;
  waNumber: string;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-playfair-display font-bold text-[#1A3C35]">
            Request a Quote for {yacht.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto p-6 md:p-8">
          <QuoteForm
            yachtId={yacht.id}
            yachtName={yacht.name}
            selectedPackage={selectedLabel}
            selectedPrice={selectedPriceStr}
            waNumber={waNumber}
          />
        </div>
      </div>
    </div>
  );
}

export default function YachtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [yacht, setYacht] = useState<YachtData | null | undefined>(undefined);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [waNumber, setWaNumber] = useState('919876543210');
  const [_phoneNum, setPhoneNum] = useState('+91 98765 43210');
  const [showReel, setShowReel] = useState(true);
  const [showLive, setShowLive] = useState(true);

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [imgKey, setImgKey] = useState(0); // triggers crossfade
  const [selectedTier, setSelectedTier] = useState<0 | 1>(0);
  const [tierPulsing, setTierPulsing] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<Record<string, string>>({});

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useScrollReveal([yacht]);

  useEffect(() => {
    fetch(`/api/yachts-master/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          setYacht(null);
          return;
        }
        // Parse JSONB arrays if they come as strings
        const parse = (v: unknown) =>
          typeof v === 'string' ? JSON.parse(v) : Array.isArray(v) ? v : [];
        setYacht({
          ...data,
          images: parse(data.images),
          inclusions: parse(data.inclusions),
          exclusions: parse(data.exclusions),
          best_for: parse(data.best_for),
        });
      })
      .catch(() => setYacht(null));

    fetch('/api/site-config')
      .then((r) => (r.ok ? r.json() : {}))
      .then((cfg: Record<string, string>) => {
        if (cfg.whatsapp_number) setWaNumber(cfg.whatsapp_number);
        if (cfg.phone) setPhoneNum(cfg.phone);
        if (cfg.show_reel_button === 'false') setShowReel(false);
        if (cfg.show_live_video_button === 'false') setShowLive(false);
        setSiteConfig(cfg);
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!yacht) return;
    fetch(`/api/yacht-amenities/${yacht.id}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setAmenities)
      .catch(() => {});
  }, [yacht]);

  const switchImage = useCallback((i: number) => {
    setActiveIdx(i);
    setImgKey((k) => k + 1);
  }, []);

  const selectTier = (t: 0 | 1) => {
    setSelectedTier(t);
    setTierPulsing(true);
    setTimeout(() => setTierPulsing(false), 500);
  };

  // Drag scroll
  const onMouseDown = () => {
    isDragging.current = true;
    if (sliderRef.current) sliderRef.current.style.cursor = 'grabbing';
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    sliderRef.current.scrollLeft -= e.movementX;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (sliderRef.current) sliderRef.current.style.cursor = 'grab';
  };

  if (yacht === undefined) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="max-w-5xl mx-auto px-6 space-y-4">
          <div className="bms-skeleton h-[420px] rounded-2xl" />
          <div className="bms-skeleton h-8 w-64 rounded-xl" />
          <div className="bms-skeleton h-4 w-full rounded-xl" />
          <div className="bms-skeleton h-4 w-3/4 rounded-xl" />
        </div>
      </div>
    );
  }
  if (yacht === null) return notFound();

  const images = yacht.images?.length ? yacht.images : [yacht.banner_image].filter(Boolean);
  const tier1Label = '1 HOUR TRIP';
  const tier1Price = yacht.sailing_price;
  const tier2Label = '2 HOURS TRIP';
  const tier2Price = yacht.sailing_price_2hr;
  const discountAmount = tier1Price * 2 - tier2Price;
  const selectedPriceNum = selectedTier === 0 ? tier1Price : tier2Price;
  const selectedPriceStr = formatINR(selectedPriceNum);
  const enabledAmenities = amenities.filter((a) => a.enabled);

  // Label is DERIVED from selectedTier so it can never go out of sync
  const selectedLabel =
    selectedTier === 1
      ? '2 HOURS TRIP'
      : '1 HOUR TRIP';

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi Goaboatworld! 👋\n\nI'd like to check availability for the *${yacht.name}*.\n\n*Package:* ${selectedLabel} — ${selectedPriceStr}\n\nPlease let me know the available dates.\n\nThank you!`
  )}`;

  const shareYacht = async () => {
    const url = `${window.location.origin}/yacht/${encodeURIComponent(yacht.id)}`;
    const shareData = {
      title: `${yacht.name} | Goaboatworld`,
      text: `Explore ${yacht.name} with Goaboatworld.`,
      url,
    };

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        toast.error('Could not share this yacht. Please try copying the link.');
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success('Yacht link copied. You can now share it with your client.');
    } catch {
      toast.error('Could not copy the yacht link. Please copy the page URL from your browser.');
    }
  };

  return (
    <div className="min-h-screen bg-white bms-page-in">
      {/* ── BACK ── */}
      <div className="pt-32 pb-3 max-w-5xl mx-auto px-6">
        <Link
          href="/fleet"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1A3C35] text-[14px] font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to
          Fleet
        </Link>
      </div>

      {/* ── HERO GALLERY ── */}
      <div className="max-w-5xl mx-auto px-6 mb-3">
        <div
          className="relative rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
          style={{ height: 'clamp(280px, 48vw, 480px)' }}
          onClick={() => setLightboxIdx(activeIdx)}
        >
          <img
            key={imgKey}
            src={images[activeIdx]}
            alt={yacht.name}
            className="w-full h-full object-cover bms-img-fade"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

          {/* Promo badge */}
          {yacht.promo_label && (
            <div className="absolute bottom-4 left-4 bg-[#3D9B7D] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow bms-badge-bounce">
              🎁 {yacht.promo_label}
            </div>
          )}

          {/* Expand icon */}
          <div className="absolute bottom-4 right-4 bg-black/40 text-white rounded-full p-2 pointer-events-none">
            <Maximize2 className="w-4 h-4" />
          </div>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  switchImage((activeIdx - 1 + images.length) % images.length);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  switchImage((activeIdx + 1) % images.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dot nav */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeIdx ? 'bg-white scale-125' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── THUMBNAIL STRIP ── */}
      {images.length > 1 && (
        <div className="max-w-5xl mx-auto px-6 mb-4">
          <div
            ref={sliderRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            className="flex gap-2.5 overflow-x-auto pb-1 bms-no-scrollbar select-none"
            style={{ cursor: 'grab', WebkitOverflowScrolling: 'touch' }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => switchImage(i)}
                className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${i === activeIdx ? 'border-[#3D9B7D] shadow-md opacity-100 scale-100' : 'border-transparent opacity-50 hover:opacity-80 hover:scale-95'}`}
                style={{ width: '88px', height: '62px' }}
              >
                <img src={img} alt="" className="w-full h-full object-cover pointer-events-none" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox images={images} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 pb-36">
        {/* Name + meta + Reel/Video */}
        <div className="py-5 border-b border-gray-100 bms-reveal">
          <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-[11px] mb-1">
            {yacht.type}
          </p>
          <h1 className="text-3xl md:text-4xl font-playfair-display font-bold text-[#1A3C35] mb-3">
            {yacht.name}
          </h1>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-[#F0F4F2] text-[#1A3C35] text-[13px] font-semibold px-3.5 py-1.5 rounded-full">
              <Users className="w-3.5 h-3.5 text-[#3D9B7D]" /> Upto {yacht.capacity} Guests
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#F0F4F2] text-[#1A3C35] text-[13px] font-semibold px-3.5 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-[#3D9B7D]" /> Panjim, Goa
            </span>
          </div>

          {/* Location + video buttons row */}
          <div className="flex flex-wrap items-center gap-2 mt-1 justify-start">
            <span className="flex items-center gap-1.5 text-gray-500 text-[14px] mr-auto">
              <MapPin className="w-4 h-4 text-[#3D9B7D]" /> Goa, India
            </span>
            {yacht.reel_url && (
              <button
                onClick={() => setVideoModalUrl(yacht.reel_url)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Reel
              </button>
            )}
            {yacht.live_video_url && (
              <button
                onClick={() => setVideoModalUrl(yacht.live_video_url)}
                className="flex items-center gap-1.5 bg-[#FF0000] hover:bg-[#cc0000] text-white rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all"
              >
                <Radio className="w-3.5 h-3.5" /> Live
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="py-6 border-b border-gray-100 bms-reveal">
          <h2 className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#1A3C35] mb-3">
            About This Yacht
          </h2>
          <p className="text-gray-600 leading-relaxed text-[15px]">{yacht.description}</p>
        </div>

        {/* Why Choose */}
        {yacht.why_choose && (
          <div className="py-6 border-b border-gray-100 bms-reveal">
            <h2 className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#1A3C35] mb-3">
              Why Choose This Yacht?
            </h2>
            <p className="text-gray-600 leading-relaxed text-[15px]">{yacht.why_choose}</p>
          </div>
        )}

        {/* Inclusions & Exclusions */}
        <div className="py-6 border-b border-gray-100 bms-reveal">
          <h2 className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#1A3C35] mb-5">
            Inclusions & Exclusions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#F0FAF7] rounded-2xl p-5 border border-[#C6EAD9]">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#2A6655] mb-4">
                ✅ Included
              </p>
              <ul className="space-y-3">
                {yacht.inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#1A3C35]">
                    <Check className="w-4 h-4 text-[#3D9B7D] mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#FFF8F8] rounded-2xl p-5 border border-[#FECACA]">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-red-500 mb-4">
                ❌ Not Included
              </p>
              <ul className="space-y-3">
                {yacht.exclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-gray-600">
                    <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Add-ons */}
        {enabledAmenities.length > 0 && (
          <div className="py-6 border-b border-gray-100 bms-reveal">
            <h2 className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#1A3C35] mb-1">
              🎁 Special Add-ons Available
            </h2>
            <p className="text-[13px] text-gray-400 mb-5">
              Mention these in your booking request to include them.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bms-stagger">
              {enabledAmenities.map((a) => (
                <div
                  key={a.id}
                  className="flex gap-4 bg-[#F0F4F2] rounded-2xl p-4 border border-[#D0E8DF] bms-reveal"
                >
                  <div className="text-3xl leading-none mt-0.5 shrink-0">{a.icon}</div>
                  <div>
                    <p className="font-bold text-[#1A3C35] text-[14px] mb-1">{a.name}</p>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Perfect For */}
        <div className="py-6 border-b border-gray-100 bms-reveal">
          <h2 className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#1A3C35] mb-4">
            Perfect For
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {yacht.best_for.map((item, i) => (
              <span
                key={i}
                className="px-4 py-2 border-2 border-[#1A3C35]/25 text-[#1A3C35] text-[13px] font-semibold rounded-full hover:border-[#3D9B7D] hover:text-[#3D9B7D] transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── CHOOSE YOUR PACKAGE — selectable ── */}
        <div className="py-6 bms-reveal">
          <h2 className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#1A3C35] mb-5">
            Choose Your Package
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* 1 Hour */}
            <button
              onClick={() => selectTier(0)}
              className={`relative text-left rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300 bms-btn-press ${
                selectedTier === 0
                  ? `border-[#3D9B7D] bg-[#F0FAF7] shadow-lg ${tierPulsing ? 'bms-select-pulse' : ''}`
                  : 'border-gray-200 bg-white hover:border-[#3D9B7D]/50 hover:bg-[#F8FBFA]'
              }`}
            >
              {/* Radio dot */}
              <div
                className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedTier === 0 ? 'border-[#3D9B7D] bg-[#3D9B7D]' : 'border-gray-300'}`}
              >
                {selectedTier === 0 && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                1 Hour Trip
              </p>
              <p className="text-xl sm:text-2xl md:text-[28px] font-playfair-display font-bold text-[#1A3C35] leading-none text-center sm:text-left">
                {formatINR(tier1Price)}
              </p>
            </button>

            {/* 2 Hours — Best Value */}
            <button
              onClick={() => selectTier(1)}
              className={`relative text-left rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300 bms-btn-press ${
                selectedTier === 1
                  ? `border-[#3D9B7D] bg-[#F0FAF7] shadow-lg ${tierPulsing ? 'bms-select-pulse' : ''}`
                  : 'border-gray-200 bg-white hover:border-[#3D9B7D]/50 hover:bg-[#F8FBFA]'
              }`}
            >
              {/* Best value badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-[#F59E0B] text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                  BEST VALUE
                </span>
              </div>
              {/* Radio dot */}
              <div
                className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedTier === 1 ? 'border-[#3D9B7D] bg-[#3D9B7D]' : 'border-gray-300'}`}
              >
                {selectedTier === 1 && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                2 Hours Trip
              </p>
              <p className="text-xl sm:text-2xl md:text-[28px] font-playfair-display font-bold text-[#1A3C35] leading-none text-center sm:text-left">
                {formatINR(tier2Price)}
              </p>
              {discountAmount > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 bg-[#F59E0B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  🎉 Save {formatINR(discountAmount)}
                </div>
              )}
            </button>
          </div>

          {/* Selected indicator */}
          <p className="text-center text-[13px] text-gray-400 mt-4">
            Selected: <span className="font-bold text-[#1A3C35]">{selectedLabel}</span> ·{' '}
            <span className="text-[#3D9B7D] font-bold">{selectedPriceStr}</span>
          </p>
        </div>
      </div>

      {/* ── STICKY BOTTOM BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_32px_rgba(0,0,0,0.10)] px-4 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          {/* Request Quote → open modal */}
          <button
            onClick={() => setIsQuoteModalOpen(true)}
            className="w-full sm:flex-1 flex items-center justify-center gap-2.5 bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-2xl h-14 text-sm sm:text-[15px] font-bold shadow-lg transition-all duration-300 bms-btn-press"
          >
            <Phone className="w-5 h-5" /> Request Quote
          </button>
          {/* Check Availability → WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1db954] text-white rounded-2xl h-14 text-sm sm:text-[15px] font-bold shadow-lg transition-all duration-300 bms-btn-press"
          >
            <WhatsAppIcon cls="w-5 h-5" /> Check Availability
          </a>
        </div>
      </div>

      {/* Video Modal */}
      {videoModalUrl && <VideoModal url={videoModalUrl} onClose={() => setVideoModalUrl(null)} />}

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        yacht={yacht!}
        selectedLabel={selectedLabel}
        selectedPriceStr={selectedPriceStr}
        waNumber={waNumber}
      />
    </div>
  );
}
