export const projectLogos: Record<string, string> = {
  'style-os': '/projects/logos/style-os.png',
  'haven-medical-beauty-clinic': '/projects/logos/haven.png',
  'm-clinic-cosmecare': '/projects/logos/m-clinic.png',
};

export const projectBrandNames: Record<string, string> = {
  'event-planning-digitalized-system': 'Event Planning Digitalization',
};

export const featuredProjectSlugs = new Set([
  'style-os',
  'multigraphic',
  'happy-pages-bookstore',
  'jad-obeid',
  'haven-medical-beauty-clinic',
  'event-planning-digitalized-system',
  'm-clinic-cosmecare',
]);

export const featuredProjectCopy: Record<string, {
  summary: string;
  description: string;
  imageUrl: string | null;
  imageFit: 'cover' | 'contain';
}> = {
  'style-os': {
    summary: 'Beauty & wellness business platform',
    description: 'Platform engineering for StyleOS: booking, client records, teams, finance, and marketing across six beauty and wellness trades, in English, French, and Arabic.',
    imageUrl: '/projects/style-os-site.jpg',
    imageFit: 'cover',
  },
  multigraphic: {
    summary: 'Agency website',
    description: 'Public website presenting the Multigraphic brand and its creative and digital services.',
    imageUrl: '/projects/multigraphic-site.jpg',
    imageFit: 'cover',
  },
  'happy-pages-bookstore': {
    summary: 'Bookstore website',
    description: 'Online bookstore with a visible catalog of books and curated bundles.',
    imageUrl: '/projects/happy-pages-site.jpg',
    imageFit: 'cover',
  },
  'jad-obeid': {
    summary: 'Artist portfolio',
    description: 'Public artist website presenting music, media, portfolio work, and updates.',
    imageUrl: '/projects/jad-obeid-site.jpg',
    imageFit: 'cover',
  },
  'haven-medical-beauty-clinic': {
    summary: 'Clinic website',
    description: 'Clinic website presenting treatment information, services, and appointment links.',
    imageUrl: '/projects/haven-site.jpg',
    imageFit: 'cover',
  },
  'event-planning-digitalized-system': {
    summary: 'Event-planning product site',
    description: 'Public product site presenting event-planning information, pricing, and registration entry points.',
    imageUrl: '/projects/event-planning-site.jpg',
    imageFit: 'cover',
  },
  'm-clinic-cosmecare': {
    summary: 'Cosmetic clinic website',
    description: 'Clinic website presenting cosmetic services and products.',
    imageUrl: '/projects/m-clinic-site.jpg',
    imageFit: 'cover',
  },
};