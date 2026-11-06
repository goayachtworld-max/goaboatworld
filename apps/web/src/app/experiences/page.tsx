import { Metadata } from 'next';
import ExperiencesClientPage from './ExperiencesClientPage';
import sql from '@/app/api/utils/sql';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const experiences = await sql`SELECT title, keywords FROM experiences WHERE is_active = true ORDER BY sort_order ASC`;

    const titles = experiences.map(e => e.title).join(', ');
    const keywords = experiences.map(e => e.keywords).filter(Boolean).join(', ');

    return {
      title: 'Our Experiences',
      description: `Discover our unique yacht experiences in Goa: ${titles}.`,
      keywords: keywords || 'yacht experiences, boat charters, Goa luxury sailing',
      alternates: { canonical: '/experiences' },
      openGraph: {
        title: 'Our Experiences | Goaboatworld',
        description: `Discover our unique yacht experiences in Goa: ${titles}.`,
        url: '/experiences',
      },
    };
  } catch (e) {
    return {
      title: 'Our Experiences | Goaboatworld',
    };
  }
}

export default function Page() {
  return <ExperiencesClientPage />;
}
