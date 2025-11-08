/**
 * Prompt-Driven App Generator
 * Creates complete themed booking apps from natural language prompts
 */

import { generateTheme, parseThemePrompt, type ThemeConfig } from './theme';
import { generateSocialTags, type SEOConfig } from './seo';
import { suggestAssets, type AssetSuggestions } from './assets';

export interface AppPrompt {
  description: string;  // Natural language: "MTG tournament platform with epic warrior theme"
  businessName?: string;
  domain?: string;
  features?: string[];
}

export interface AppConfig {
  name: string;
  domain: string;
  theme: ThemeConfig;
  seo: SEOConfig;
  assets: AssetSuggestions;
  content: ContentStructure;
  deployment: DeploymentConfig;
}

export interface ContentStructure {
  pages: PageConfig[];
  copy: CopyTemplates;
  forms: FormConfig[];
}

export interface PageConfig {
  name: string;
  route: string;
  title: string;
  sections: SectionConfig[];
}

export interface SectionConfig {
  type: 'hero' | 'features' | 'pricing' | 'cta' | 'testimonials' | 'about';
  content: Record<string, any>;
}

export interface CopyTemplates {
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  features: {
    title: string;
    items: Array<{ title: string; description: string }>;
  };
  pricing: {
    title: string;
    tiers: Array<{ name: string; price: string; features: string[] }>;
  };
}

export interface FormConfig {
  id: string;
  title: string;
  steps: FormStep[];
}

export interface FormStep {
  title: string;
  fields: FormField[];
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

export interface DeploymentConfig {
  platform: 'azure' | 'vercel' | 'netlify';
  region: string;
  envVars: Record<string, string>;
  buildSettings: {
    buildCommand: string;
    outputDirectory: string;
    installCommand: string;
  };
}

/**
 * Parse natural language prompt into structured app configuration
 */
export function parsePrompt(prompt: string): AppPrompt {
  const lower = prompt.toLowerCase();
  
  // Extract business name if quoted
  const nameMatch = prompt.match(/"([^"]+)"|'([^']+)'/);
  const businessName = nameMatch ? (nameMatch[1] || nameMatch[2]) : undefined;

  // Extract domain if present
  const domainMatch = prompt.match(/(?:domain|url|site):\s*([a-z0-9-]+\.[a-z]{2,})/i);
  const domain = domainMatch ? domainMatch[1] : undefined;

  // Detect features
  const features: string[] = [];
  if (lower.includes('payment') || lower.includes('stripe')) features.push('payments');
  if (lower.includes('calendar') || lower.includes('scheduling')) features.push('calendar');
  if (lower.includes('email') || lower.includes('notification')) features.push('email');
  if (lower.includes('multi-tenant')) features.push('multi-tenant');
  if (lower.includes('analytics')) features.push('analytics');

  return {
    description: prompt,
    businessName,
    domain,
    features: features.length > 0 ? features : undefined,
  };
}

/**
 * Generate complete app configuration from prompt
 */
export async function generateApp(prompt: string | AppPrompt): Promise<AppConfig> {
  const parsedPrompt = typeof prompt === 'string' ? parsePrompt(prompt) : prompt;
  const description = parsedPrompt.description;

  // Generate theme from prompt
  const themePrompt = parseThemePrompt(description);
  const theme = generateTheme(themePrompt);

  // Generate business name if not provided
  const businessName = parsedPrompt.businessName || generateBusinessName(themePrompt.industry);
  const domain = parsedPrompt.domain || `${businessName.toLowerCase().replace(/\s+/g, '')}.com`;

  // Generate SEO configuration
  const seo = generateSocialTags({
    businessName,
    tagline: generateTagline(themePrompt.industry),
    domain,
    industry: themePrompt.industry,
  });

  // Generate asset suggestions
  const assets = suggestAssets(theme);

  // Generate content structure
  const content = generateContentStructure(theme, businessName);

  // Generate deployment configuration
  const deployment = generateDeploymentConfig(parsedPrompt.features || []);

  return {
    name: businessName,
    domain,
    theme,
    seo,
    assets,
    content,
    deployment,
  };
}

/**
 * Generate business name based on industry
 */
function generateBusinessName(industry: string): string {
  const names: Record<string, string> = {
    'mtg-tournaments': "The Gathering",
    'fitness': "FitLife Studio",
    'consulting': "Strategic Insights",
    'wellness': "Serenity Wellness",
    'education': "LearnHub Academy",
  };
  return names[industry] || "Professional Services";
}

/**
 * Generate tagline based on industry
 */
function generateTagline(industry: string): string {
  const taglines: Record<string, string> = {
    'mtg-tournaments': "Where Legends Are Forged",
    'fitness': "Transform Your Life",
    'consulting': "Driving Business Success",
    'wellness': "Balance Mind, Body & Spirit",
    'education': "Unlock Your Potential",
  };
  return taglines[industry] || "Excellence in Service";
}

/**
 * Generate complete content structure
 */
function generateContentStructure(theme: ThemeConfig, businessName: string): ContentStructure {
  const term = theme.terminology;

  return {
    pages: [
      {
        name: 'Home',
        route: '/',
        title: businessName,
        sections: [
          {
            type: 'hero',
            content: {
              headline: `Welcome to ${businessName}`,
              subheadline: `${term.book} your ${term.service} today`,
              cta: `${term.book} Now`,
              backgroundStyle: theme.animations.particleSystem ? 'particles' : 'gradient',
            },
          },
          {
            type: 'features',
            content: {
              title: `Why Choose ${businessName}`,
              items: [
                { title: 'Expert Service', description: 'Professional quality you can trust' },
                { title: 'Easy Booking', description: `${term.book} online in minutes` },
                { title: 'Flexible Scheduling', description: 'Times that work for you' },
              ],
            },
          },
          {
            type: 'cta',
            content: {
              title: `Ready to Get Started?`,
              description: `${term.book} your ${term.service} today`,
              buttonText: `${term.book} Now`,
            },
          },
        ],
      },
      {
        name: 'Services',
        route: '/services',
        title: `Our ${term.service}s`,
        sections: [
          {
            type: 'features',
            content: {
              title: `Available ${term.service}s`,
              items: [],  // Will be populated from tenant config
            },
          },
        ],
      },
      {
        name: 'Pricing',
        route: '/pricing',
        title: 'Pricing',
        sections: [
          {
            type: 'pricing',
            content: {
              title: 'Simple, Transparent Pricing',
              tiers: [],  // Will be populated from tenant config
            },
          },
        ],
      },
      {
        name: 'About',
        route: '/about',
        title: `About ${businessName}`,
        sections: [
          {
            type: 'about',
            content: {
              title: `About ${businessName}`,
              story: `Learn more about our journey and values`,
            },
          },
        ],
      },
    ],
    copy: {
      hero: {
        headline: `Welcome to ${businessName}`,
        subheadline: `${term.book} your ${term.service} today`,
        cta: `${term.book} Now`,
      },
      features: {
        title: `Why Choose ${businessName}`,
        items: [
          { title: 'Expert Service', description: 'Professional quality you can trust' },
          { title: 'Easy Booking', description: `${term.book} online in minutes` },
          { title: 'Flexible Scheduling', description: 'Times that work for you' },
        ],
      },
      pricing: {
        title: 'Simple, Transparent Pricing',
        tiers: [],
      },
    },
    forms: [
      {
        id: 'booking',
        title: `${term.book} Your ${term.service}`,
        steps: [
          {
            title: 'Select Date & Time',
            fields: [
              { name: 'date', label: 'Date', type: 'date', required: true },
              { name: 'time', label: 'Time', type: 'time', required: true },
            ],
          },
          {
            title: `Choose ${term.service}`,
            fields: [
              { name: 'service', label: term.service, type: 'select', required: true, options: [] },
            ],
          },
          {
            title: 'Your Information',
            fields: [
              { name: 'name', label: 'Full Name', type: 'text', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'phone', label: 'Phone', type: 'tel', required: true },
            ],
          },
          {
            title: 'Confirm & Pay',
            fields: [
              { name: 'notes', label: 'Additional Notes', type: 'textarea', required: false },
            ],
          },
        ],
      },
    ],
  };
}

/**
 * Generate deployment configuration
 */
function generateDeploymentConfig(features: string[]): DeploymentConfig {
  return {
    platform: 'azure',  // Default, can be customized
    region: 'eastus',
    envVars: {
      'VITE_API_BASE_URL': 'https://your-api.azurewebsites.net/api',
      ...(features.includes('payments') && { 'STRIPE_PUBLIC_KEY': 'pk_test_...' }),
      ...(features.includes('analytics') && { 'VITE_GA_MEASUREMENT_ID': 'G-...' }),
    },
    buildSettings: {
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      installCommand: 'npm ci',
    },
  };
}

/**
 * Generate file structure for the app
 */
export function generateFileStructure(config: AppConfig): Record<string, string> {
  const files: Record<string, string> = {};

  // Generate index.html with SEO tags
  files['index.html'] = generateIndexHTML(config);

  // Generate tailwind config
  files['tailwind.config.js'] = generateTailwindConfig(config.theme);

  // Generate tenant config
  files['src/tenants/custom/content.config.ts'] = generateTenantConfig(config);

  // Generate Home page
  files['src/pages/Home.tsx'] = generateHomePage(config);

  // Generate .env file
  files['.env'] = generateEnvFile(config.deployment);

  return files;
}

/**
 * Generate index.html with SEO tags
 */
function generateIndexHTML(config: AppConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary Meta Tags -->
    <title>${config.seo.title}</title>
    <meta name="title" content="${config.seo.title}" />
    <meta name="description" content="${config.seo.description}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://${config.domain}/" />
    <meta property="og:title" content="${config.seo.ogTitle}" />
    <meta property="og:description" content="${config.seo.ogDescription}" />
    <meta property="og:image" content="https://${config.domain}/og-image.jpg" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://${config.domain}/" />
    <meta property="twitter:title" content="${config.seo.twitterTitle}" />
    <meta property="twitter:description" content="${config.seo.twitterDescription}" />
    <meta property="twitter:image" content="https://${config.domain}/og-image.jpg" />
    
    <!-- Theme Color -->
    <meta name="theme-color" content="${config.theme.colors.primary}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

/**
 * Generate Tailwind config
 */
function generateTailwindConfig(theme: ThemeConfig): string {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '${theme.colors.primary}',
        secondary: '${theme.colors.secondary}',
        accent: '${theme.colors.accent}',
      },
      fontFamily: {
        heading: ['${theme.typography.headingFont}', 'sans-serif'],
        body: ['${theme.typography.bodyFont}', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
`;
}

/**
 * Generate tenant config
 */
function generateTenantConfig(config: AppConfig): string {
  return `import type { TenantContent } from "../../core/types/tenant.types";

export const content: TenantContent = {
  name: "${config.name}",
  tagline: "${config.seo.description}",
  email: "contact@${config.domain}",
  location: "Your City",
  website: "https://${config.domain}",
  
  services: [],  // Add your services here
  
  seo: {
    title: "${config.seo.title}",
    description: "${config.seo.description}",
    keywords: ${JSON.stringify(config.seo.keywords)},
  },
};
`;
}

/**
 * Generate Home page component
 */
function generateHomePage(config: AppConfig): string {
  const { theme, content } = config;
  const hero = content.copy.hero;

  return `import { useState } from 'react';
import BookingModal from '../components/BookingModal';

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b ${theme.colors.background.from} via-${theme.colors.background.via} to-${theme.colors.background.to}">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="${theme.typography.headingStyle} ${theme.typography.headingWeight} text-6xl lg:text-8xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-${theme.colors.primary} to-${theme.colors.secondary}">
            ${hero.headline}
          </h1>
          <p className="text-xl lg:text-2xl text-${theme.colors.text.secondary} mb-12 max-w-3xl mx-auto">
            ${hero.subheadline}
          </p>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="${theme.components.buttons.primary} px-10 py-5 rounded-xl text-lg transform hover:scale-105 transition-all duration-300"
          >
            ${hero.cta}
          </button>
        </div>
      </section>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
}
`;
}

/**
 * Generate .env file
 */
function generateEnvFile(deployment: DeploymentConfig): string {
  return Object.entries(deployment.envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}
