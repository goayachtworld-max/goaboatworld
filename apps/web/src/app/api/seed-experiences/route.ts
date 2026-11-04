import sql from '@/app/api/utils/sql';

export async function GET() {
  const EXPERIENCES = [
    {
      title: 'Birthday Celebrations',
      description: 'Celebrate another year surrounded by the sea, your favourite people, and unforgettable views.',
      image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1973&auto=format&fit=crop',
    },
    {
      title: 'Sunset Cruises',
      description: "Slow down and enjoy Goa's beautiful waters as the sky turns golden.",
      image_url: 'https://images.unsplash.com/photo-1534313314376-a72289b6181e?q=80&w=1974&auto=format&fit=crop',
    },
    {
      title: 'Couple Experiences',
      description: 'A private escape designed for romance, from quiet cruises to special celebrations.',
      image_url: 'https://images.unsplash.com/photo-1516589174184-c68d8e5ffe5e?q=80&w=1974&auto=format&fit=crop',
    },
    {
      title: 'Corporate Events',
      description: 'Take your team meetings or networking out to sea for a fresh perspective.',
      image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop',
    },
  ];

  try {
    // Use a transaction or sequential inserts without ON CONFLICT if the table is fresh
    // But safer to just use basic inserts.
    // Since I don't have a PK on title, ON CONFLICT DO NOTHING only works if there's a unique constraint.
    for (const exp of EXPERIENCES) {
      await sql`INSERT INTO experiences (title, description, image_url, is_active, sort_order)
                 VALUES (${exp.title}, ${exp.description}, ${exp.image_url}, true, 0)`;
    }
    return Response.json({ success: true, message: 'Experiences seeded' });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Seed failed', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
