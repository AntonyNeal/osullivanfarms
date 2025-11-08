/**
 * Asset Generation Suggestions Module
 * Suggests image specs, designs, and assets based on theme configuration
 */

import type { ThemeConfig } from './theme';

export interface AssetSuggestions {
  ogImage: OGImageSpec;
  favicon: FaviconSpec;
  heroImages: HeroImageSpec[];
  logo: LogoSpec;
  additionalAssets: AdditionalAsset[];
}

export interface OGImageSpec {
  dimensions: string;
  aspectRatio: string;
  fileSize: string;
  format: string[];
  design: DesignSuggestion;
  colors: string[];
  typography: TypographySuggestion;
  elements: string[];
  examples: string[];
}

export interface FaviconSpec {
  formats: FaviconFormat[];
  design: DesignSuggestion;
  colors: string[];
  style: string;
}

export interface FaviconFormat {
  size: string;
  format: string;
  purpose: string;
}

export interface HeroImageSpec {
  name: string;
  dimensions: string;
  style: string;
  description: string;
  suggestedSources: string[];
}

export interface LogoSpec {
  style: string;
  elements: string[];
  colors: string[];
  variations: LogoVariation[];
}

export interface LogoVariation {
  name: string;
  description: string;
  usage: string;
}

export interface AdditionalAsset {
  name: string;
  type: string;
  purpose: string;
  specs: string;
}

export interface DesignSuggestion {
  layout: string;
  composition: string;
  mood: string;
  elements: string[];
}

export interface TypographySuggestion {
  titleFont: string;
  titleSize: string;
  subtitleFont: string;
  subtitleSize: string;
  style: string;
}

/**
 * Generate comprehensive asset suggestions based on theme
 */
export function suggestAssets(theme: ThemeConfig): AssetSuggestions {
  return {
    ogImage: generateOGImageSpec(theme),
    favicon: generateFaviconSpec(theme),
    heroImages: generateHeroImageSpecs(theme),
    logo: generateLogoSpec(theme),
    additionalAssets: generateAdditionalAssets(theme),
  };
}

/**
 * Generate Open Graph image specifications
 */
function generateOGImageSpec(theme: ThemeConfig): OGImageSpec {
  const isMaximalist = theme.animations.particleSystem !== undefined;
  
  return {
    dimensions: '1200x630px',
    aspectRatio: '1.91:1',
    fileSize: '<1MB (ideally 200-300KB)',
    format: ['JPG (recommended)', 'PNG', 'WebP'],
    design: {
      layout: isMaximalist ? 'Dramatic hero composition with layered elements' : 'Clean centered design with subtle gradients',
      composition: isMaximalist 
        ? 'Multi-layered background, large title text, decorative elements, particle effects'
        : 'Gradient background, centered logo, clear typography, minimalist borders',
      mood: isMaximalist ? 'Epic, dramatic, bold' : 'Professional, clean, modern',
      elements: isMaximalist 
        ? ['Large title text', 'Logo/icon', theme.typography.decorativeElements[0], 'Gradient overlays', 'Glow effects']
        : ['Logo', 'Business name', 'Tagline', 'Subtle gradient', 'Clean borders'],
    },
    colors: [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.accent,
      theme.colors.background.from,
      theme.colors.background.via,
    ],
    typography: {
      titleFont: theme.typography.headingFont,
      titleSize: isMaximalist ? '72-96px' : '48-64px',
      subtitleFont: theme.typography.bodyFont,
      subtitleSize: '24-32px',
      style: theme.typography.headingStyle,
    },
    elements: [
      'Business name/logo',
      'Tagline or key message',
      'Brand colors and gradients',
      ...(isMaximalist ? ['Decorative elements', 'Particle effects visual'] : ['Clean borders', 'Subtle shadows']),
    ],
    examples: [
      `Center: "${theme.terminology.book} Your ${theme.terminology.service}" in large ${theme.typography.headingFont} font`,
      `Background: Gradient from ${theme.colors.primary} to ${theme.colors.secondary}`,
      isMaximalist 
        ? `Decorative: ${theme.typography.decorativeElements[0]} in corners`
        : `Border: 1px solid ${theme.colors.border}`,
    ],
  };
}

/**
 * Generate favicon specifications
 */
function generateFaviconSpec(theme: ThemeConfig): FaviconSpec {
  const isMaximalist = theme.animations.particleSystem !== undefined;

  return {
    formats: [
      { size: '16x16', format: 'PNG', purpose: 'Browser tab' },
      { size: '32x32', format: 'PNG', purpose: 'Browser tab (retina)' },
      { size: '48x48', format: 'PNG', purpose: 'Windows tiles' },
      { size: '180x180', format: 'PNG', purpose: 'Apple Touch Icon' },
      { size: 'Scalable', format: 'SVG', purpose: 'Modern browsers' },
    ],
    design: {
      layout: 'Centered icon or initials',
      composition: isMaximalist 
        ? 'Bold symbolic icon with decorative touches'
        : 'Simple geometric icon or letter monogram',
      mood: isMaximalist ? 'Bold, recognizable, iconic' : 'Clean, professional, minimal',
      elements: isMaximalist 
        ? ['Main icon/symbol', 'Border/frame', 'Accent details']
        : ['Letter monogram or simple icon', 'Clean background'],
    },
    colors: [theme.colors.primary, theme.colors.secondary, theme.colors.background.from],
    style: isMaximalist 
      ? `Iconic symbol (e.g., ${theme.typography.decorativeElements[0].split(' ')[0]}) on gradient background`
      : 'Simple letter monogram or geometric icon on solid background',
  };
}

/**
 * Generate hero image specifications
 */
function generateHeroImageSpecs(theme: ThemeConfig): HeroImageSpec[] {
  const isMaximalist = theme.animations.particleSystem !== undefined;

  const specs: HeroImageSpec[] = [
    {
      name: 'Hero Background',
      dimensions: '1920x1080px (Full HD) or 3840x2160px (4K)',
      style: isMaximalist ? 'Epic dramatic scene' : 'Clean modern gradient',
      description: isMaximalist
        ? `Atmospheric scene matching ${theme.typography.decorativeElements[0]} theme, with depth and drama. Dark tones with ${theme.colors.primary} accents.`
        : `Clean gradient background from ${theme.colors.background.from} to ${theme.colors.background.via} with subtle patterns.`,
      suggestedSources: [
        'Unsplash.com (search: ' + (isMaximalist ? 'epic landscape, dramatic sky, fantasy scene' : 'gradient, abstract, minimal background') + ')',
        'Pexels.com (search: ' + (isMaximalist ? 'dramatic scene, atmospheric' : 'clean background, modern') + ')',
        'Midjourney/DALL-E (generate custom)',
      ],
    },
  ];

  if (isMaximalist) {
    specs.push({
      name: 'Particle/Overlay Texture',
      dimensions: '512x512px (tileable)',
      style: 'Subtle particle or texture overlay',
      description: 'Semi-transparent particles, embers, or atmospheric effects to overlay on hero section',
      suggestedSources: [
        'Generate with CSS animations',
        'Particle.js configurations',
        'Custom SVG animations',
      ],
    });
  }

  return specs;
}

/**
 * Generate logo specifications
 */
function generateLogoSpec(theme: ThemeConfig): LogoSpec {
  const isMaximalist = theme.animations.particleSystem !== undefined;

  return {
    style: isMaximalist ? 'Bold iconic design with decorative elements' : 'Clean modern typography or simple icon',
    elements: isMaximalist
      ? ['Primary symbol/icon', 'Business name in display font', 'Decorative accents', 'Tagline (optional)']
      : ['Clean wordmark or icon', 'Business name in modern font', 'Simple geometric shapes'],
    colors: [theme.colors.primary, theme.colors.secondary, theme.colors.text.heading],
    variations: [
      {
        name: 'Full Logo',
        description: 'Complete logo with icon and text',
        usage: 'Website header, marketing materials, full-size displays',
      },
      {
        name: 'Icon Only',
        description: 'Just the symbol/icon without text',
        usage: 'Favicon, app icon, social media profile',
      },
      {
        name: 'Wordmark',
        description: 'Text-only version',
        usage: 'Narrow spaces, mobile header',
      },
      {
        name: 'Monochrome',
        description: 'Single-color version',
        usage: 'Print, watermarks, limited-color contexts',
      },
    ],
  };
}

/**
 * Generate additional asset suggestions
 */
function generateAdditionalAssets(theme: ThemeConfig): AdditionalAsset[] {
  return [
    {
      name: 'Loading Spinner',
      type: 'SVG animation',
      purpose: 'Show during async operations',
      specs: `Circular spinner in ${theme.colors.primary} color, 40x40px`,
    },
    {
      name: 'Default Avatar',
      type: 'PNG/SVG',
      purpose: 'Placeholder for user profiles',
      specs: `Simple icon on ${theme.colors.background.via} background, 200x200px`,
    },
    {
      name: 'Email Template Header',
      type: 'PNG',
      purpose: 'Branding for email notifications',
      specs: `600px wide, logo + brand colors, ~150px height`,
    },
    {
      name: '404 Illustration',
      type: 'SVG/PNG',
      purpose: 'Error page visual',
      specs: `Thematic illustration matching brand style, 400x300px`,
    },
  ];
}

/**
 * Generate asset creation checklist
 */
export function generateAssetChecklist(assets: AssetSuggestions): string {
  return `
# Asset Creation Checklist

## Required Assets

### 1. Open Graph Image (og-image.jpg)
- [ ] Dimensions: ${assets.ogImage.dimensions}
- [ ] Format: ${assets.ogImage.format.join(', ')}
- [ ] File size: ${assets.ogImage.fileSize}
- [ ] Design elements: ${assets.ogImage.elements.join(', ')}
- [ ] Colors: ${assets.ogImage.colors.join(', ')}
- [ ] Typography: ${assets.ogImage.typography.titleFont}

### 2. Favicon (Multiple Formats)
${assets.favicon.formats.map(f => `- [ ] ${f.size} ${f.format} - ${f.purpose}`).join('\n')}

### 3. Logo Variations
${assets.logo.variations.map(v => `- [ ] ${v.name} - ${v.description}`).join('\n')}

### 4. Hero Images
${assets.heroImages.map(h => `- [ ] ${h.name} (${h.dimensions}) - ${h.description}`).join('\n')}

### 5. Additional Assets
${assets.additionalAssets.map(a => `- [ ] ${a.name} - ${a.purpose}`).join('\n')}

## Design Guidelines
- Primary color: ${assets.ogImage.colors[0]}
- Secondary color: ${assets.ogImage.colors[1]}
- Font family: ${assets.ogImage.typography.titleFont}
- Style: ${assets.favicon.design.mood}

## Recommended Tools
- Figma/Canva: For og-image and graphics
- Favicon.io: For generating favicon sets
- Midjourney/DALL-E: For custom illustrations
- Unsplash/Pexels: For stock photography
- SVG editors: For scalable icons
`.trim();
}

/**
 * Generate CSS for common asset usage
 */
export function generateAssetCSS(assets: AssetSuggestions): string {
  return `
/* Hero Background */
.hero-background {
  background-image: url('/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* Logo Container */
.logo {
  width: auto;
  height: 48px;
}

/* Favicon Links (add to <head>) */
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
`.trim();
}
