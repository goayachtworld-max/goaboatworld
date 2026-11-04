const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const files = {
    site_config: '/Users/sunilyadav/Downloads/site_config.json',
    yachts_master: '/Users/sunilyadav/Downloads/yachts_master.json',
    yacht_amenities: '/Users/sunilyadav/Downloads/yacht_amenities.json',
    gallery: '/Users/sunilyadav/Downloads/gallery.json'
  };

  try {
    // 1. site_config
    console.log('Seeding site_config...');
    const siteConfig = JSON.parse(fs.readFileSync(files.site_config, 'utf8'));
    for (const item of siteConfig) {
      await pool.query('INSERT INTO public.site_config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value', [item.key, item.value]);
    }

    // 2. yachts_master
    console.log('Seeding yachts_master...');
    const yachts = JSON.parse(fs.readFileSync(files.yachts_master, 'utf8'));
    for (const y of yachts) {
      await pool.query(
        `INSERT INTO public.yachts_master (id, name, description, why_choose, type, capacity, duration, sailing_price, sailing_price_2hr, anchorage_price, banner_image, images, inclusions, exclusions, best_for, promo_label, reel_url, live_video_url, is_active, sort_order) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) 
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description`,
        [y.id, y.name, y.description, y.why_choose, y.type, y.capacity, y.duration, y.sailing_price, y.sailing_price_2hr, y.anchorage_price, y.banner_image, JSON.stringify(y.images), JSON.stringify(y.inclusions), JSON.stringify(y.exclusions), JSON.stringify(y.best_for), y.promo_label, y.reel_url, y.live_video_url, y.is_active, y.sort_order]
      );
    }

    // 3. yacht_amenities
    console.log('Seeding yacht_amenities...');
    const amenities = JSON.parse(fs.readFileSync(files.yacht_amenities, 'utf8'));
    for (const a of amenities) {
      await pool.query(
        `INSERT INTO public.yacht_amenities (id, yacht_id, name, description, icon, enabled, sort_order) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
        [a.id, a.yacht_id, a.name, a.description, a.icon, a.enabled, a.sort_order]
      );
    }

    // 4. gallery
    console.log('Seeding gallery...');
    const gallery = JSON.parse(fs.readFileSync(files.gallery, 'utf8'));
    for (const g of gallery) {
      await pool.query(
        `INSERT INTO public.gallery (id, image_url, caption, trip_date, yacht_name, category, is_active, sort_order) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url`,
        [g.id, g.image_url, g.caption, g.trip_date, g.yacht_name, g.category, g.is_active, g.sort_order]
      );
    }

    console.log('All data seeded successfully!');
  } catch (e) {
    console.error('Seeding error:', e);
  } finally {
    await pool.end();
  }
}

seed();
