import type { TenantContent } from '../../core/types/tenant.types';

export const content: TenantContent = {
  // Basic Information
  name: '[Business Name]',
  tagline: '[Your Business Tagline - e.g., "Professional Services in Your City"]',
  bio: `
    [Full business description - 2-3 paragraphs about your services, experience, and what makes you unique.
    
    Replace this with your actual business description, highlighting your expertise, years of experience, 
    and what clients can expect when working with you.]
    
    [Additional paragraph about your approach, values, or specializations.]
  `,

  // Contact Information
  contact: {
    email: 'contact@yourdomain.com',
    phone: '+1234567890',
    location: 'Your City, State',
    website: 'https://yourdomain.com',
  },

  // Services (customize these for your business)
  services: [
    {
      id: 'consultation',
      name: 'Initial Consultation',
      description: 'One-on-one consultation to understand your needs and develop a plan',
      duration: '60 minutes',
      priceDisplay: 'See Pricing',
      category: 'consultation',
    },
    {
      id: 'standard-service',
      name: 'Standard Service',
      description: 'Core service offering with comprehensive support',
      duration: '90 minutes',
      priceDisplay: 'See Pricing',
      category: 'service',
    },
    {
      id: 'premium-service',
      name: 'Premium Service Package',
      description: 'Enhanced service with additional features and extended support',
      duration: '2-3 hours',
      priceDisplay: 'See Pricing',
      category: 'premium',
    },
    {
      id: 'workshop',
      name: 'Group Workshop',
      description: 'Educational workshop or training session for multiple participants',
      duration: 'Half day',
      priceDisplay: 'Contact for pricing',
      category: 'group',
    },
  ],

  // Pricing (customize for your business model)
  pricing: {
    consultation: {
      duration: '1 hour',
      price: 150,
      description: 'Initial consultation and needs assessment',
    },
    'standard-service': {
      duration: '90 minutes',
      price: 250,
      description: 'Core service delivery',
    },
    'premium-service': {
      duration: '2-3 hours',
      price: 450,
      description: 'Comprehensive premium package',
    },
    workshop: {
      duration: 'Half day',
      price: 75,
      description: 'Per person for group workshops',
    },
  },

  // Business Hours
  availability: {
    monday: { start: '09:00', end: '17:00' },
    tuesday: { start: '09:00', end: '17:00' },
    wednesday: { start: '09:00', end: '17:00' },
    thursday: { start: '09:00', end: '17:00' },
    friday: { start: '09:00', end: '15:00' },
    saturday: { start: '10:00', end: '14:00' },
    sunday: { closed: true },
  },

  // Social Media (optional)
  socialMedia: {
    linkedin: 'https://linkedin.com/company/yourbusiness',
    twitter: 'https://twitter.com/yourbusiness',
    facebook: 'https://facebook.com/yourbusiness',
    instagram: 'https://instagram.com/yourbusiness',
  },

  // SEO Configuration
  seo: {
    title: '[Business Name] - [Service Type] in [City]',
    description:
      '[Brief description for search engines - 150-160 characters. Highlight your main services and location.]',
    keywords: ['[your service]', '[your city]', 'professional services', '[your specialty]'],
  },

  // Additional Settings
  settings: {
    bookingRequiresApproval: true,
    allowOnlinePayments: true,
    showPricing: true,
    requireDeposit: false,
    cancellationPolicy: '24 hours notice required for cancellations',
  },
};
