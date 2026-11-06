import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    // 1. Create Tables
    await sql`CREATE TABLE IF NOT EXISTS public.yacht_categories (
      id SERIAL PRIMARY KEY,
      name text NOT NULL,
      is_active boolean DEFAULT true,
      sort_order integer DEFAULT 0
    )`;

    await sql`CREATE TABLE IF NOT EXISTS public.yacht_types (
      id SERIAL PRIMARY KEY,
      name text NOT NULL,
      is_active boolean DEFAULT true,
      sort_order integer DEFAULT 0
    )`;

    await sql`CREATE TABLE IF NOT EXISTS public.yacht_occasions (
      id SERIAL PRIMARY KEY,
      name text NOT NULL,
      is_active boolean DEFAULT true,
      sort_order integer DEFAULT 0
    )`;

    await sql`CREATE TABLE IF NOT EXISTS public.yacht_occasion_map (
      yacht_id text REFERENCES public.yachts_master(id) ON DELETE CASCADE,
      occasion_id integer REFERENCES public.yacht_occasions(id) ON DELETE CASCADE,
      PRIMARY KEY (yacht_id, occasion_id)
    )`;

    // 2. Add Columns to yachts_master
    try {
      await sql`ALTER TABLE public.yachts_master ADD COLUMN category_id integer REFERENCES public.yacht_categories(id)`;
    } catch (e) {}
    try {
      await sql`ALTER TABLE public.yachts_master ADD COLUMN type_id integer REFERENCES public.yacht_types(id)`;
    } catch (e) {}
    try {
      await sql`ALTER TABLE public.yachts_master ADD COLUMN is_featured boolean DEFAULT false`;
    } catch (e) {}

    // 3. Seed Data
    const categories = ['Budget Yachts', 'Premium Yachts', 'Luxury Yachts'];
    for (let i = 0; i < categories.length; i++) {
      await sql`INSERT INTO public.yacht_categories (name, sort_order) VALUES (${categories[i]}, ${i})`;
    }

    const types = ['Motor Yacht', 'Luxury Yacht', 'Catamaran', 'Speed Boat', 'Houseboat', 'Wooden Boat', 'Sailing Boat'];
    for (let i = 0; i < types.length; i++) {
      await sql`INSERT INTO public.yacht_types (name, sort_order) VALUES (${types[i]}, ${i})`;
    }

    const occasions = [
      'Birthday Celebration', 'Anniversary', 'Romantic Date', 'Marriage Proposal',
      'Bachelor/Bachelorette Party', 'Family Outing', 'Friends Party', 'Corporate Events',
      'Photoshoot', 'Sunset Cruise'
    ];
    for (let i = 0; i < occasions.length; i++) {
      await sql`INSERT INTO public.yacht_occasions (name, sort_order) VALUES (${occasions[i]}, ${i})`;
    }


    return Response.json({ success: true, message: 'Migration completed successfully' });
  } catch (e: any) {
    console.error(e);
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
