import { Metadata } from 'next';
import { projects } from '@/lib/portfolio-data';

export const metadata: Metadata = {
  title: 'Our Portfolio | Neetrino - AI-Powered Solutions',
  description: 'Explore our best projects and solutions we\'ve created for our clients. From web development to AI solutions, mobile apps to e-commerce platforms.',
  keywords: [
    'portfolio',
    'projects',
    'web development',
    'mobile apps',
    'AI solutions',
    'e-commerce',
    'dashboards',
    'corporate websites',
    'Neetrino'
  ],
  openGraph: {
    title: 'Our Portfolio | Neetrino',
    description: 'Explore our best projects and solutions we\'ve created for our clients.',
    type: 'website',
    url: 'https://neetrino.com/portfolio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=630&fit=crop&crop=center',
        width: 1200,
        height: 630,
        alt: 'Neetrino Portfolio - AI-Powered Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Portfolio | Neetrino',
    description: 'Explore our best projects and solutions we\'ve created for our clients.',
    images: ['https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=630&fit=crop&crop=center'],
  },
  alternates: {
    canonical: 'https://neetrino.com/portfolio',
  },
};

// Generate JSON-LD structured data
function generatePortfolioJsonLd() {
  const portfolioItems = projects.map((project, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'CreativeWork',
      name: project.title,
      description: project.summary,
      url: project.liveUrl || `https://neetrino.com/portfolio/${project.slug}`,
      image: project.cover.url,
      creator: {
        '@type': 'Organization',
        name: 'Neetrino',
        url: 'https://neetrino.com',
      },
      dateCreated: `${project.year}-01-01`,
      keywords: project.tags.join(', '),
      about: project.category,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Neetrino Portfolio',
    description: 'Our best projects and solutions we\'ve created for our clients',
    url: 'https://neetrino.com/portfolio',
    numberOfItems: projects.length,
    itemListElement: portfolioItems,
  };
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = generatePortfolioJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
