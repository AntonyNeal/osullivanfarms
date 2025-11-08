/**
 * SEO and Social Media Tags Generator
 * Generates optimized meta tags for search engines and social platforms
 */

import type { ThemeConfig } from './theme';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonical?: string;
}

export interface SocialTagsInput {
  businessName: string;
  tagline: string;
  domain: string;
  industry: string;
  description?: string;
  keywords?: string[];
}

/**
 * Generate comprehensive SEO configuration
 */
export function generateSocialTags(input: SocialTagsInput): SEOConfig {
  const { businessName, tagline, domain, industry, description, keywords } = input;

  // Generate description if not provided
  const defaultDescription = description || generateDescription(industry, businessName);

  // Generate keywords if not provided
  const defaultKeywords = keywords || generateKeywords(industry, businessName);

  // Generate title variations
  const pageTitle = `${businessName} - ${tagline}`;
  const ogTitle = `${businessName} | ${tagline}`;
  const twitterTitle = businessName;

  return {
    title: pageTitle,
    description: defaultDescription,
    keywords: defaultKeywords,
    ogTitle,
    ogDescription: defaultDescription,
    ogImage: `https://${domain}/og-image.jpg`,
    twitterTitle,
    twitterDescription: defaultDescription,
    twitterImage: `https://${domain}/og-image.jpg`,
    twitterCard: 'summary_large_image',
    canonical: `https://${domain}`,
  };
}

/**
 * Generate description based on industry
 */
function generateDescription(industry: string, businessName: string): string {
  const descriptions: Record<string, string> = {
    'mtg-tournaments': `Join ${businessName} for epic Magic: The Gathering tournaments. Register for events, compete with fellow planeswalkers, and forge legendary battles.`,
    'fitness': `Transform your fitness journey at ${businessName}. Book personal training sessions, join group classes, and achieve your health goals.`,
    'consulting': `${businessName} provides expert consulting services. Schedule consultations with industry professionals and drive your business success.`,
    'wellness': `Experience holistic wellness at ${businessName}. Book massage therapy, yoga sessions, and wellness consultations for mind, body, and spirit.`,
    'education': `Learn with ${businessName}. Enroll in courses, schedule tutoring sessions, and unlock your full potential with expert instruction.`,
  };

  return descriptions[industry] || `Book professional services with ${businessName}. Expert quality, easy scheduling, and exceptional results.`;
}

/**
 * Generate keywords based on industry
 */
function generateKeywords(industry: string, businessName: string): string[] {
  const keywordSets: Record<string, string[]> = {
    'mtg-tournaments': [
      'magic the gathering',
      'mtg tournaments',
      'trading card game',
      'commander',
      'standard',
      'draft',
      'tournament registration',
      businessName.toLowerCase(),
    ],
    'fitness': [
      'fitness',
      'personal training',
      'gym',
      'workout classes',
      'health',
      'wellness',
      'training sessions',
      businessName.toLowerCase(),
    ],
    'consulting': [
      'consulting',
      'business consulting',
      'professional services',
      'expert advice',
      'strategy',
      'consultation',
      businessName.toLowerCase(),
    ],
    'wellness': [
      'wellness',
      'massage',
      'spa',
      'holistic health',
      'yoga',
      'meditation',
      'therapy',
      businessName.toLowerCase(),
    ],
    'education': [
      'education',
      'tutoring',
      'courses',
      'learning',
      'teaching',
      'instruction',
      'training',
      businessName.toLowerCase(),
    ],
  };

  return keywordSets[industry] || [
    'booking',
    'appointments',
    'scheduling',
    'professional services',
    businessName.toLowerCase(),
  ];
}

/**
 * Generate structured data (JSON-LD) for rich snippets
 */
export function generateStructuredData(config: SEOConfig, businessInfo: {
  name: string;
  type: string;
  address?: string;
  phone?: string;
  email?: string;
}): string {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': businessInfo.type || 'LocalBusiness',
    name: businessInfo.name,
    description: config.description,
    url: config.canonical,
    image: config.ogImage,
    ...(businessInfo.address && { address: businessInfo.address }),
    ...(businessInfo.phone && { telephone: businessInfo.phone }),
    ...(businessInfo.email && { email: businessInfo.email }),
  };

  return JSON.stringify(structuredData, null, 2);
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(domain: string): string {
  return `# https://${domain}/robots.txt
User-agent: *
Allow: /

Sitemap: https://${domain}/sitemap.xml
`;
}

/**
 * Generate sitemap.xml content
 */
export function generateSitemap(domain: string, pages: string[]): string {
  const urls = pages.map(page => `  <url>
    <loc>https://${domain}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/**
 * Generate meta tags for specific page
 */
export function generatePageMeta(
  baseConfig: SEOConfig,
  pageTitle: string,
  pageDescription?: string,
  pagePath?: string
): Partial<SEOConfig> {
  const domain = baseConfig.canonical?.replace('https://', '') || '';
  const fullUrl = pagePath ? `https://${domain}${pagePath}` : baseConfig.canonical;

  return {
    title: `${pageTitle} | ${baseConfig.title.split(' - ')[0]}`,
    description: pageDescription || baseConfig.description,
    ogTitle: pageTitle,
    ogDescription: pageDescription || baseConfig.description,
    twitterTitle: pageTitle,
    twitterDescription: pageDescription || baseConfig.description,
    canonical: fullUrl,
  };
}
