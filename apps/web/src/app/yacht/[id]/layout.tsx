import type { Metadata } from 'next';
import type React from 'react';
import sql from '@/app/api/utils/sql';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const [yacht] =
      await sql`SELECT name, description, banner_image FROM yachts_master WHERE id = ${id}`;
    if (!yacht) {
      return { title: 'Yacht not found', robots: { index: false } };
    }

    const description =
      (yacht.description || '').replace(/\s+/g, ' ').trim().slice(0, 155) ||
      `Book ${yacht.name} — private yacht charter in Goa with Goaboatworld.`;

    return {
      title: `${yacht.name} — Private Yacht Charter in Goa`,
      description,
      alternates: { canonical: `/yacht/${id}` },
      openGraph: {
        title: `${yacht.name} | Goaboatworld`,
        description,
        url: `/yacht/${id}`,
        images: yacht.banner_image
          ? [{ url: yacht.banner_image, alt: `${yacht.name} yacht in Goa` }]
          : undefined,
      },
    };
  } catch {
    return { title: 'Yacht Charter in Goa' };
  }
}

export default function YachtLayout({ children }: { children: React.ReactNode }) {
  return children;
}
