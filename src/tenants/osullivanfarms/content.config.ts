import type { TenantContent } from '../../core/types/tenant.types';

/**
 * O'Sullivan Farms Content Configuration
 * Hay production, transport, and sheep management
 * Echuca, Victoria, Australia
 */
export const content: TenantContent = {
  // Basic Information
  name: "O'Sullivan Farms",
  tagline: 'Premium Hay Production & Sheep Management',
  bio: "O'Sullivan Farms Pty Ltd operates in Echuca, Victoria, producing premium quality hay and straw for livestock operations across southeastern Australia. Our modern farming practices combine traditional agricultural wisdom with innovative technology.\n\nWe specialize in lucerne, oaten, and wheaten hay production, with reliable transport services ensuring your feed arrives fresh and on schedule. Our commitment to quality and consistency has built lasting relationships with farms throughout the region.\n\nOur newest initiative brings digital transformation to sheep flock management, helping farmers track mob health, manage paddock rotation, and optimize breeding programs with intuitive tools designed for real-world conditions.",
  shortBio:
    'Family-operated agricultural business in Echuca, VIC. Premium hay production, reliable transport, and innovative sheep flock management solutions.',

  // Services/Products
  services: [
    {
      id: 'hay-production',
      name: 'Hay Production',
      description:
        'Premium quality lucerne, oaten, and wheaten hay. Consistent cuts throughout the season, stored in optimal conditions. Multiple hay varieties available with quality testing every cut.',
      duration: 'Year-round availability',
      price: 280,
      priceDisplay: 'From $280/tonne',
      featured: true,
      icon: 'hay',
    },
    {
      id: 'transport',
      name: 'Transport Services',
      description:
        'Reliable transport for hay, straw, and general agricultural freight across Victoria and southern NSW. B-double capable with GPS tracked deliveries.',
      duration: 'Scheduled deliveries',
      price: 0,
      priceDisplay: 'Quote on request',
      featured: false,
      icon: 'transport',
    },
    {
      id: 'straw-sales',
      name: 'Straw Sales',
      description:
        'Clean, quality straw for bedding and feed. Multiple varieties available in small or bulk quantities. Wheat and oat straw in small squares or large rounds.',
      duration: 'Subject to availability',
      price: 120,
      priceDisplay: 'From $120/tonne',
      featured: false,
      icon: 'straw',
    },
    {
      id: 'sheep-management',
      name: 'Flock Management System',
      description:
        'Digital sheep flock management platform. Track mob health, breeding records, paddock rotation, and treatments with offline-capable mobile access. Multi-worker coordination and automated compliance reports.',
      duration: 'Beta testing Q1 2026',
      price: 0,
      priceDisplay: 'Coming Soon - Beta Program',
      featured: true,
      icon: 'sheep',
    },
  ],

  // Pricing Structure
  pricing: {
    hourly: 280,
    currency: 'AUD',
    customRates: [
      {
        duration: '1 tonne',
        price: 280,
        description: 'Lucerne hay',
      },
      {
        duration: '1 tonne',
        price: 120,
        description: 'Wheat/oat straw',
      },
    ],
  },

  // Contact Information
  contact: {
    email: 'admin@osfarms.com',
    phone: '+61 3 5480 XXXX', // Replace with actual
    phoneDisplay: '(03) 5480 XXXX',
    availableHours: 'Mon-Fri: 7am-5pm, Sat: 8am-12pm',
    responseTime: 'Usually responds within 24 hours',
    preferredContact: 'email',
  },

  // Social Media (if any)
  socialMedia: {
    // facebook: '',
    // instagram: '',
    // twitter: '',
  },

  // Availability
  availability: {
    location: 'Echuca, VIC',
    willingToTravel: true,
    travelCities: ['Melbourne', 'Bendigo', 'Shepparton', 'Deniliquin', 'Griffith'],
    timezone: 'Australia/Melbourne',
  },

  // Booking Preferences
  preferences: {
    minNotice: '48 hours',
    depositRequired: false,
    screeningRequired: false,
  },

  // SEO
  seo: {
    title: "O'Sullivan Farms - Premium Hay Production & Sheep Management | Echuca, VIC",
    description:
      "O'Sullivan Farms: Quality hay production, reliable transport, and innovative sheep flock management solutions. Serving Victoria and southern NSW.",
    keywords: [
      'hay production victoria',
      'lucerne hay echuca',
      'agricultural transport victoria',
      'sheep flock management',
      'hay sales echuca',
      'farm management software',
    ],
    ogImage: 'hero-main',
  },
};

export default content;
