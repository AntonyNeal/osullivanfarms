/**
 * Demo Tenant Content Configuration
 * Professional services content for template demonstration
 */
import type { TenantContent } from '../../core/types/tenant.types';

export const content: TenantContent = {
  // Basic Information
  name: 'Professional Services Demo',
  tagline: 'Expert consultation and training services',
  bio: 'We provide comprehensive professional services designed to help individuals and organizations reach their full potential. Our team of experienced consultants, trainers, and coaches brings years of industry expertise to every engagement.\n\nOur approach is tailored, results-driven, and focused on sustainable growth. Whether you need strategic guidance, skills development, or organizational transformation, we have the expertise to help you succeed.',
  shortBio:
    'Professional services for business strategy, training, coaching, and workshops. Expert guidance for sustainable growth and success.',

  // Services Offered
  services: [
    {
      id: 'strategy-consultation',
      name: 'Strategy Consultation',
      description:
        'Comprehensive business strategy and planning session to help you develop clear direction and actionable plans for growth.',
      duration: '60 minutes',
      price: 150,
      priceDisplay: '$150/session',
      featured: true,
      icon: 'strategy',
    },
    {
      id: 'training-session',
      name: 'Training Session',
      description:
        'Hands-on skills training and development sessions tailored to your specific learning objectives and professional goals.',
      duration: '90 minutes',
      price: 120,
      priceDisplay: '$120/session',
      featured: false,
      icon: 'training',
    },
    {
      id: 'coaching-call',
      name: 'Coaching Call',
      description:
        'One-on-one coaching and mentorship session focused on personal development and goal achievement.',
      duration: '45 minutes',
      price: 100,
      priceDisplay: '$100/session',
      featured: false,
      icon: 'coaching',
    },
    {
      id: 'group-workshop',
      name: 'Group Workshop',
      description:
        'Interactive group learning and development session designed for teams and organizations.',
      duration: '120 minutes',
      price: 200,
      priceDisplay: '$200/session',
      featured: true,
      icon: 'workshop',
    },
  ],

  // Pricing Structure
  pricing: {
    hourly: 100,
    currency: 'USD',
    customRates: [
      {
        duration: '30 minutes',
        price: 75,
        description: 'Quick consultation',
      },
      {
        duration: '60 minutes',
        price: 150,
        description: 'Standard session',
      },
      {
        duration: '90 minutes',
        price: 200,
        description: 'Extended session',
      },
    ],
  },

  // Contact Information
  contact: {
    email: 'contact@example.com',
    phone: '+1 (555) 123-4567',
    phoneDisplay: '(555) 123-4567',
    availableHours: 'Monday-Friday, 9 AM - 6 PM EST',
    responseTime: 'Usually responds within 2-4 hours',
    preferredContact: 'email',
  },

  // Social Media
  socialMedia: {
    linkedin: 'https://linkedin.com/company/professional-services-demo',
    twitter: 'https://twitter.com/proservicesdemo',
    facebook: 'https://facebook.com/professionalservicesdemo',
  },

  // Availability
  availability: {
    location: 'New York, NY',
    willingToTravel: true,
    travelCities: ['Boston', 'Philadelphia', 'Washington DC'],
    timezone: 'America/New_York',
  },

  // Booking Preferences
  preferences: {
    minNotice: '24 hours',
    depositRequired: false,
    screeningRequired: false,
  },

  // SEO Configuration
  seo: {
    title: 'Professional Services Demo - Expert Consultation & Training',
    description:
      'Professional consultation, training, and coaching services designed to help you achieve your business and personal goals. Book your session today.',
    keywords: [
      'professional services',
      'business consultation',
      'training services',
      'coaching',
      'workshops',
      'strategy',
      'professional development',
    ],
    ogImage: 'hero-main',
  },
};
