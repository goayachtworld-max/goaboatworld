import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    // 1. Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        images jsonb DEFAULT '[]'::jsonb,
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        keywords TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='experiences' AND column_name='keywords') THEN
          ALTER TABLE experiences ADD COLUMN keywords TEXT;
        END IF;
      END $$;
    `;

    // 2. Handle existing tables with old schema (image_url instead of images)
    // We use a block to avoid errors if columns already exist/don't exist
    await sql`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='experiences' AND column_name='image_url') THEN
          ALTER TABLE experiences RENAME COLUMN image_url TO images;
        END IF;
      END $$;
    `;

    await sql`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='experiences' AND column_name='images' AND data_type = 'text') THEN
          -- Convert text to jsonb. If it's not a valid JSON array, wrap it in one.
          ALTER TABLE experiences ALTER COLUMN images TYPE jsonb
          USING (
            CASE
              WHEN images ~ '^\\s*\\[.*\\s*\\]$' THEN images::jsonb
              WHEN images IS NULL THEN '[]'::jsonb
              ELSE jsonb_build_array(images)
            END
          );
        END IF;
      END $$;
    `;

    // 3. Migrate data from site_config.experiences_items to experiences table
    const [configRow] = await sql`SELECT value FROM site_config WHERE key = 'experiences_items'`;
    if (configRow && configRow.value) {
      try {
        const oldItems = JSON.parse(configRow.value);
        if (Array.isArray(oldItems)) {
          for (let i = 0; i < oldItems.length; i++) {
            const item = oldItems[i];
            // Only insert if it doesn't already exist (based on title)
            const [exists] = await sql`SELECT 1 FROM experiences WHERE title = ${item.title}`;
            if (!exists) {
              await sql`
                INSERT INTO experiences (title, description, images, sort_order, is_active)
                VALUES (
                  ${item.title},
                  ${item.description},
                  ${JSON.stringify([item.image].filter(Boolean))},
                  ${i},
                  true
                )
              `;
            }
          }
        }
      } catch (e) {
        console.error('Data migration from site_config failed:', e);
      }
    }

    return Response.json({ success: true, message: 'Experiences table migrated and data synced successfully' });
  } catch (error) {
    console.error('Migration failed:', error);
    return Response.json({ error: 'Migration failed', details: error }, { status: 500 });
  }
}
