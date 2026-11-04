export interface PriceTier {
  label: string;
  duration: string;
  price: string; // display string e.g. "₹45,000"
  rawPrice: number; // numeric for discount calculation e.g. 45000
}

export interface Yacht {
  id: string;
  name: string;
  type: string;
  capacity: number;
  duration: string;
  price: string;
  rawPrice: number; // 1-hour numeric price for discount calc
  priceTiers: PriceTier[];
  description: string;
  whyChoose: string; // "Why Choose This Yacht?" paragraph
  inclusions: string[]; // What's included
  exclusions: string[]; // What's NOT included
  images: string[];
  highlights: string[];
  bestFor: string[];
  promoLabel?: string; // Badge text shown bottom-left of card image (e.g. "Free Drone")
  photoCount?: number;
}

export const yachts: Yacht[] = [
  {
    id: 'majesty-66',
    name: 'Majesty 66',
    type: 'Luxury Motor Yacht',
    capacity: 20,
    duration: '1–4 Hours',
    price: '₹45,000',
    rawPrice: 45000,
    promoLabel: 'Free Drone',
    photoCount: 60,
    priceTiers: [
      { label: '1 HOUR TRIP', duration: '1 Hr', price: '₹45,000', rawPrice: 45000 },
      { label: '2 HOURS TRIP', duration: '2 Hrs', price: '₹75,000', rawPrice: 75000 },
    ],
    description:
      'Experience ultimate luxury on the Majesty 66. This premium yacht offers spacious decks, a flybridge with panoramic views, and elegant interiors perfect for high-end celebrations and corporate gatherings.',
    whyChoose:
      'The Majesty 66 stands out for its sheer scale and sophistication. With a fully equipped flybridge, panoramic sea views, and a professional crew, it transforms any occasion into an extraordinary event. Whether you are hosting a corporate networking evening or celebrating a milestone birthday, the Majesty 66 delivers an experience that is simply unmatched.',
    inclusions: [
      'Experienced Captain & Crew',
      'Chilled Water Bottles',
      'Bluetooth Music System',
      'Life Jackets for All Guests',
      'Cleaning & Deck Setup',
    ],
    exclusions: [
      'Catering & Food',
      'Alcoholic Beverages',
      'Decoration (available as add-on)',
      'Photography (available as add-on)',
      'Fuel surcharge for extended trips',
    ],
    images: [
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621275079535-dd5df048427b?q=80&w=1935&auto=format&fit=crop',
    ],
    highlights: ['Sunset Cruise', 'Private Celebrations', 'Corporate Events'],
    bestFor: ['Corporate', 'Large Groups', 'Birthdays'],
  },
  {
    id: 'fairline-targa',
    name: 'Fairline Targa 43',
    type: 'Performance Cruiser',
    capacity: 12,
    duration: '1–4 Hours',
    price: '₹35,000',
    rawPrice: 35000,
    promoLabel: 'Free DJ',
    photoCount: 50,
    priceTiers: [
      { label: '1 HOUR TRIP', duration: '1 Hr', price: '₹35,000', rawPrice: 35000 },
      { label: '2 HOURS TRIP', duration: '2 Hrs', price: '₹60,000', rawPrice: 60000 },
    ],
    description:
      'The Fairline Targa 43 combines speed with sophistication. Ideal for intimate groups and sunset cruises, it features a sleek profile and a comfortable open cockpit for the perfect sailing experience.',
    whyChoose:
      'The Fairline Targa 43 is the perfect balance of performance and luxury. Its sleek lines and sporty profile cut through the water effortlessly, while the spacious cockpit and sunbathing deck ensure your guests are always comfortable. This is the ideal yacht for couples, small families, and anyone looking for a more intimate yet exhilarating experience on the water.',
    inclusions: [
      'Experienced Captain',
      'Chilled Water Bottles',
      'Bluetooth Music System',
      'Sunbathing Deck Access',
      'Life Jackets for All Guests',
    ],
    exclusions: [
      'Catering & Food',
      'Alcoholic Beverages',
      'Decoration (available as add-on)',
      'Photography (available as add-on)',
    ],
    images: [
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798156?q=80&w=2044&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540946484620-20ef24484177?q=80&w=2070&auto=format&fit=crop',
    ],
    highlights: ['Scenic Coastline Tour', 'Romantic Sunset', 'Photography'],
    bestFor: ['Couples', 'Small Families', 'Anniversaries'],
  },
  {
    id: 'sea-ray-330',
    name: 'Sea Ray 330',
    type: 'Sport Cruiser',
    capacity: 8,
    duration: '1–2 Hours',
    price: '₹25,000',
    rawPrice: 25000,
    photoCount: 40,
    priceTiers: [
      { label: '1 HOUR TRIP', duration: '1 Hr', price: '₹25,000', rawPrice: 25000 },
      { label: '2 HOURS TRIP', duration: '2 Hrs', price: '₹42,000', rawPrice: 42000 },
    ],
    description:
      'Compact yet luxurious, the Sea Ray 330 is perfect for quick getaways and private proposals. Enjoy the breeze and the beautiful Goa waters on this agile and stylish sport cruiser.',
    whyChoose:
      "The Sea Ray 330 is the most intimate and personal yacht in our fleet. Its compact yet well-appointed design is ideal for proposals, romantic escapes, and small groups who prefer an exclusive, private experience. Agile and sporty, it navigates Goa's beautiful coastline with ease, giving you the freedom to explore hidden coves and enjoy the sea at your own pace.",
    inclusions: [
      'Experienced Captain',
      'Chilled Water Bottles',
      'Bluetooth Music System',
      'Life Jackets for All Guests',
      'Ice Box',
    ],
    exclusions: [
      'Catering & Food',
      'Alcoholic Beverages',
      'Decoration (available as add-on)',
      'Photography (available as add-on)',
    ],
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563299446-24e050986753?q=80&w=2070&auto=format&fit=crop',
    ],
    highlights: ['Proposal Spot', 'Quick Cruise', 'Dolphin Sighting'],
    bestFor: ['Proposals', 'Friends', 'Small Groups'],
  },
  {
    id: 'princess-v39',
    name: 'Princess V39',
    type: 'Luxury Cabin Cruiser',
    capacity: 6,
    duration: '1–3 Hours',
    price: '₹20,000',
    rawPrice: 20000,
    promoLabel: 'Free Beer',
    photoCount: 35,
    priceTiers: [
      { label: '1 HOUR TRIP', duration: '1 Hr', price: '₹20,000', rawPrice: 20000 },
      { label: '2 HOURS TRIP', duration: '2 Hrs', price: '₹34,000', rawPrice: 34000 },
    ],
    description:
      "The Princess V39 is a sleek cabin cruiser that blends sport and luxury in equal measure. Ideal for small groups seeking a private and intimate experience on Goa's stunning coastline.",
    whyChoose:
      'With its elegant lines and powerful performance, the Princess V39 is the perfect choice for those who want a truly private experience without compromising on comfort. The spacious saloon and well-appointed cabin make it a favourite for small families and intimate groups.',
    inclusions: [
      'Experienced Captain',
      'Chilled Water & Soft Drinks',
      'Bluetooth Music System',
      'Life Jackets for All Guests',
      'Sunbathing Deck',
    ],
    exclusions: [
      'Catering & Food',
      'Alcoholic Beverages',
      'Decoration (available as add-on)',
      'Photography (available as add-on)',
    ],
    images: [
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798156?q=80&w=2044&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563299446-24e050986753?q=80&w=2070&auto=format&fit=crop',
    ],
    highlights: ['Private Getaway', 'Sunset Cruise', 'Coastal Exploration'],
    bestFor: ['Small Families', 'Couples', 'Friends'],
  },
  {
    id: 'azimut-55',
    name: 'Azimut 55',
    type: 'Flybridge Yacht',
    capacity: 16,
    duration: '2–5 Hours',
    price: '₹55,000',
    rawPrice: 55000,
    promoLabel: 'Free Decoration',
    photoCount: 70,
    priceTiers: [
      { label: '1 HOUR TRIP', duration: '1 Hr', price: '₹55,000', rawPrice: 55000 },
      { label: '2 HOURS TRIP', duration: '2 Hrs', price: '₹95,000', rawPrice: 95000 },
    ],
    description:
      "The Azimut 55 is a masterpiece of Italian design — spacious, powerful, and refined. With a full flybridge, generous outdoor deck space, and a luxurious saloon, it's built for memorable group experiences.",
    whyChoose:
      'The Azimut 55 combines Italian elegance with powerful sea performance. Its expansive flybridge offers 360° panoramic views, making it the ultimate platform for celebrations, photoshoots, and corporate events. With room for up to 16 guests and a professional crew, every detail is taken care of.',
    inclusions: [
      'Professional Captain & Crew',
      'Chilled Water & Soft Drinks',
      'Premium Sound System',
      'Life Jackets for All Guests',
      'Flybridge Access',
      'Deck Seating Setup',
    ],
    exclusions: [
      'Catering & Food',
      'Alcoholic Beverages',
      'Decoration (available as add-on)',
      'DJ (available as add-on)',
      'Fuel surcharge for extended trips',
    ],
    images: [
      'https://images.unsplash.com/photo-1621275079535-dd5df048427b?q=80&w=1935&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1974&auto=format&fit=crop',
    ],
    highlights: ['Corporate Events', 'Large Celebrations', 'Sunset Parties'],
    bestFor: ['Corporate', 'Large Groups', 'Parties'],
  },
  {
    id: 'sunseeker-predator',
    name: 'Sunseeker Predator 50',
    type: 'Sport Motor Yacht',
    capacity: 10,
    duration: '1–4 Hours',
    price: '₹30,000',
    rawPrice: 30000,
    photoCount: 45,
    priceTiers: [
      { label: '1 HOUR TRIP', duration: '1 Hr', price: '₹30,000', rawPrice: 30000 },
      { label: '2 HOURS TRIP', duration: '2 Hrs', price: '₹52,000', rawPrice: 52000 },
    ],
    description:
      'The Sunseeker Predator 50 is the definition of performance luxury. Its aggressive styling, powerful engines, and superbly finished interior make it a head-turner on the water and an unforgettable experience aboard.',
    whyChoose:
      "If you want speed, style, and excitement combined with real luxury, the Sunseeker Predator 50 is your ideal choice. It's perfect for groups who want an adrenaline-filled ride along Goa's coast without sacrificing comfort.",
    inclusions: [
      'Experienced Captain',
      'Chilled Water & Soft Drinks',
      'Bluetooth Music System',
      'Life Jackets for All Guests',
      'Open Cockpit Seating',
    ],
    exclusions: [
      'Catering & Food',
      'Alcoholic Beverages',
      'Decoration (available as add-on)',
      'Photography (available as add-on)',
    ],
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop',
    ],
    highlights: ['High Speed Cruise', 'Dolphin Spotting', 'Sunset Run'],
    bestFor: ['Friends', 'Thrill Seekers', 'Groups'],
  },
];

export const experiences = [
  {
    id: 'birthdays',
    title: 'Birthday Celebrations',
    description:
      'Celebrate another year surrounded by the sea, your favourite people, and unforgettable views.',
    image:
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1973&auto=format&fit=crop',
  },
  {
    id: 'sunsets',
    title: 'Sunset Cruises',
    description: "Slow down and enjoy Goa's beautiful waters as the sky turns golden.",
    image:
      'https://images.unsplash.com/photo-1534313314376-a72289b6181e?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 'couples',
    title: 'Couple Experiences',
    description:
      'A private escape designed for romance, from quiet cruises to special celebrations.',
    image:
      'https://images.unsplash.com/photo-1516589174184-c68d8e5ffe5e?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 'corporate',
    title: 'Corporate Events',
    description: 'Take your team meetings or networking out to sea for a fresh perspective.',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop',
  },
];
