import { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Anchor, Star, Users, CheckCircle2, Award, Sailboat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import YachtCard from '@/components/YachtCard';
import ExperiencesSection from '@/components/ExperiencesSection';
import sql from '@/app/api/utils/sql';
import type { Yacht } from '@/data/yachts';
import AnimatedSection from '@/components/AnimatedSection';
import ShimmerButton from '@/components/ShimmerButton';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const rows = await sql`SELECT key, value FROM site_config`;
    const cfg = Object.fromEntries(rows.map((r: any) => [r.key, r.value]));

    return {
      title: cfg.home_meta_title || 'Goaboatworld | Private Yacht Experiences & Boat Charters in Goa',
      description: cfg.home_meta_description || 'Discover private yacht experiences in Goa with Goaboatworld. Explore yachts, sunset cruises, celebrations, and customized boat charter experiences.',
      keywords: cfg.home_meta_keywords || 'yacht rental goa, private boat goa, luxury cruises, boat charter goa',
    };
  } catch (e) {
    return {
      title: 'Goaboatworld | Private Yacht Experiences & Boat Charters in Goa',
      description: 'Discover private yacht experiences in Goa with Goaboatworld. Explore yachts, sunset cruises, celebrations, and customized boat charter experiences.',
    };
  }
}

/* ─── DB Types ──────────────────────────────────────────────────── */
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
}

/* ─── Helpers ───────────────────────────────────────────────────── */
function parseImgs(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') {
    try {
      return JSON.parse(v);
    } catch {
      return [];
    }
  }
  return [];
}

function dbToCard(y: DBYacht): Yacht {
  const imgs = parseImgs(y.images);
  const all = y.banner_image ? [y.banner_image, ...imgs.filter((u) => u !== y.banner_image)] : imgs;
  const unique = Array.from(new Set(all));
  return {
    id: y.id,
    name: y.name,
    type: y.type,
    capacity: y.capacity,
    duration: '1–4 Hours',
    description: y.description,
    price: '₹' + y.sailing_price.toLocaleString('en-IN'),
    rawPrice: y.sailing_price,
    promoLabel: y.promo_label || undefined,
    photoCount: unique.length || undefined,
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

/* ─── Static content ────────────────────────────────────────────── */
const WHY_FEATURES = [
  {
    icon: 'shield',
    title: 'Trusted & Licensed',
    description:
      'All our yachts are fully insured, certified, and operated by licensed professionals.',
  },
  {
    icon: 'anchor',
    title: 'Premium Fleet',
    description: 'From sport cruisers to luxury flybridge yachts — curated for every occasion.',
  },
  {
    icon: 'star',
    title: '5-Star Experience',
    description: 'From booking to boarding, every detail is handled with care and precision.',
  },
  {
    icon: 'zap',
    title: 'Instant Confirmation',
    description: 'Flexible packages, transparent pricing, and same-day confirmation.',
  },
];

function WhyIcon({ icon }: { icon: string }) {
  if (icon === 'shield') return <Shield className="w-6 h-6 text-[#3D9B7D]" />;
  if (icon === 'anchor') return <Anchor className="w-6 h-6 text-[#3D9B7D]" />;
  if (icon === 'star') return <Star className="w-6 h-6 text-[#3D9B7D]" />;
  if (icon === 'zap') return <Zap className="w-6 h-6 text-[#3D9B7D]" />;
  return <Anchor className="w-6 h-6 text-[#3D9B7D]" />;
}

/* ─── Page (Server Component — renders instantly with real data) ─ */
export default async function HomePage() {
  let yachts: Yacht[] = [];
  let waNumber = '919876543210';
  let heroHeadline = 'Private Yacht Experiences in Goa';
  let heroSubtext =
    'Sail the Arabian Sea in style. Book a private yacht for birthdays, sunsets, proposals, and more.';
  let expHeading = 'Every Occasion, Perfectly Crafted';
  let heroBanner = 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop';
  let heroVideo = '';
  let yachtCount = 6;

  try {
    const [rows, configRows, countRows] = await Promise.all([
      sql`SELECT id, name, description, type, capacity, sailing_price, sailing_price_2hr, banner_image, images, promo_label FROM yachts_master WHERE is_active = true ORDER BY sort_order LIMIT 6`,
      sql`SELECT key, value FROM site_config`,
      sql`SELECT COUNT(*)::int AS count FROM yachts_master WHERE is_active = true`,
    ]);

    yachts = rows.map((y) => dbToCard(y as DBYacht));
    yachtCount = Number((countRows as { count: number | string }[])[0]?.count ?? 0) || rows.length;

    const cfg = Object.fromEntries(
      (configRows as { key: string; value: string }[]).map((r) => [r.key, r.value])
    );
    if (cfg.whatsapp_number) waNumber = cfg.whatsapp_number;
    if (cfg.hero_headline) heroHeadline = cfg.hero_headline;
    if (cfg.hero_subtext) heroSubtext = cfg.hero_subtext;
    if (cfg.experiences_section_title) expHeading = cfg.experiences_section_title;
    if (cfg.hero_banner_url) heroBanner = cfg.hero_banner_url;
    if (cfg.hero_video_url) heroVideo = cfg.hero_video_url;
  } catch {
    // Fall back to empty — page still renders beautifully
  }

  const waLink = `https://wa.me/${waNumber}`;

  return (
    <div>
      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[75vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        {heroVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={heroBanner}
            alt="Luxury yacht in Goa"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-[#0D1F1B]/65" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <AnimatedSection delay={0.1}>
            <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-xs mb-5">
              Goa&apos;s Premier Yacht Charter
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <h1 className="text-5xl md:text-7xl font-playfair-display font-bold mb-6 leading-tight">
              {heroHeadline}
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.5}>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              {heroSubtext}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.7}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ShimmerButton>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#3D9B7D] hover:bg-[#2A6655] text-white rounded-full px-10 h-13 text-[15px] font-semibold bms-btn-press"
                >
                  <Link href="/fleet">Explore Yachts</Link>
                </Button>
              </ShimmerButton>
              <ShimmerButton>
                <Button
                  asChild
                  size="lg"
                  className="bg-white/20 border border-white hover:bg-white hover:text-[#1A3C35] text-white rounded-full px-10 h-13 text-[15px] font-semibold bms-btn-press"
                >
                  <Link href={waLink} target="_blank" rel="noopener noreferrer">
                    Talk to Us
                  </Link>
                </Button>
              </ShimmerButton>
            </div>
          </AnimatedSection>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-1">
          <ArrowRight
            className="w-5 h-5 rotate-90"
            style={{ animation: 'bmsBounce 1.5s ease-in-out infinite' }}
          />
          <style>{`
            @keyframes bmsBounce {
              0%, 100% { transform: rotate(90deg) translateX(0); }
              50% { transform: rotate(90deg) translateX(6px); }
            }
          `}</style>
        </div>
      </section>

      {/* ══ STATS STRIP ═══════════════════════════════════════════════ */}
      <div className="bg-gradient-to-b from-[#1A3C35] to-[#14322B] text-white py-8 px-6 border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 text-center">
          {[
            { num: '900+', label: 'Happy Guests', icon: Users, stars: false, certIcon: false },
            { num: String(yachtCount), label: 'Premium Yachts', icon: Sailboat, stars: false, certIcon: false },
            { num: '5', label: 'Rated Experience', icon: Star, stars: true, certIcon: false },
            { num: '', label: 'Certified & Licensed', icon: CheckCircle2, stars: false, certIcon: true },
          ].map((s, i) => (
            <AnimatedSection key={s.label} delay={0.1 * i}>
              <div className="flex items-center justify-center gap-3 group">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#3D9B7D]/20 transition-colors duration-300 shrink-0">
                  <s.icon className="w-4 h-4 text-[#3D9B7D]" />
                </div>
                {s.certIcon ? (
                  <Award className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={1.75} />
                ) : (
                  <p className="text-xl md:text-2xl font-bold text-white flex items-center gap-1.5">
                    {s.num}
                    {s.stars && (
                      <span className="flex items-center gap-[2px]">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star key={starIdx} className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* ══ FLEET ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-xs mb-3">
              Our Fleet
            </p>
            <h2 className="text-4xl font-playfair-display font-bold text-[#1A3C35]">
              Choose Your Perfect Yacht
            </h2>
          </div>

          {yachts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {yachts.map((yacht) => (
                  <YachtCard key={yacht.id} yacht={yacht} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Button
                  asChild
                  className="bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-full px-10 h-12 text-[14px] font-semibold"
                >
                  <Link href="/fleet">
                    View All Yachts
                    <ArrowRight className="w-4 h-4 ml-2 inline" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bms-skeleton rounded-2xl h-[460px]" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ WHY CHOOSE US ═════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F8FAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-xs mb-3">
              Why Goaboatworld
            </p>
            <h2 className="text-4xl font-playfair-display font-bold text-[#1A3C35]">
              Goa&apos;s Most Trusted Yacht Experience
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_FEATURES.map((f, i) => (
              <AnimatedSection key={f.title} delay={0.1 * i}>
                <div
                  className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-[#F0F4F2] rounded-xl flex items-center justify-center mb-5">
                    <WhyIcon icon={f.icon} />
                  </div>
                  <h3 className="text-[17px] font-bold text-[#1A3C35] mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-[14px] leading-relaxed">{f.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCES ═══════════════════════════════════════════════ */}
      <ExperiencesSection />

      {/* ══ CTA BANNER ════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-[#1A3C35] text-white text-center px-6">
        <img
          src="https://images.unsplash.com/photo-1534313314376-a72289b6181e?q=80&w=1974&auto=format&fit=crop"
          alt="Sunset Goa"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          loading="lazy"
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-playfair-display font-bold mb-5 leading-tight">
            Your Next Unforgettable Moment Starts Here.
          </h2>
          <p className="text-white/60 text-[15px] mb-10 max-w-xl mx-auto leading-relaxed">
            Tell us your date, group size, and occasion. We&apos;ll help you find the right sailing
            experience in Goa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#3D9B7D] hover:bg-[#2A6655] text-white rounded-full px-10 h-13 text-[15px] font-semibold w-full sm:w-auto bms-btn-press"
            >
              <Link href="/contact">Book Your Yacht</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white/20 border border-white hover:bg-white hover:text-[#1A3C35] text-white rounded-full px-10 h-13 text-[15px] font-semibold w-full sm:w-auto bms-btn-press"
            >
              <Link href={waLink} target="_blank" rel="noopener noreferrer">
                Talk to Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
