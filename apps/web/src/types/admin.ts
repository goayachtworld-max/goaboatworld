export interface Amenity {
  id: number;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  sort_order: number;
}

export interface Inquiry {
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

export interface YachtDB {
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
