# SDK Generators - Quick Start Guide

This SDK includes powerful generators that can create complete themed booking apps from natural language prompts.

## 🚀 Quick Start

```bash
npm install @your-organization/service-booking-sdk
```

## 📦 What's Included

### 1. **Theme Generator** - `generateTheme()`
Creates complete theme configurations from industry and style prompts.

```typescript
import { parseThemePrompt, generateTheme } from '@your-organization/service-booking-sdk';

// Parse natural language prompt
const prompt = parseThemePrompt("MTG tournament platform with epic warrior theme and orange colors");

// Generate complete theme
const theme = generateTheme(prompt);

console.log(theme.colors.primary);        // #ea580c (orange-600)
console.log(theme.terminology.book);      // "register"
console.log(theme.terminology.service);   // "format"
console.log(theme.typography.headingFont); // "Cinzel"
```

**Supported Industries:**
- `mtg-tournaments` - Magic: The Gathering tournaments
- `fitness` - Fitness studios and gyms
- `consulting` - Professional consulting services
- `wellness` - Wellness and spa services
- `education` - Educational services and tutoring

**Visual Styles:**
- `maximalist` - Epic, dramatic, particle effects
- `minimalist` - Clean, simple, focused
- `modern` - Contemporary, balanced
- `corporate` - Professional, business-focused

### 2. **App Generator** - `generateApp()`
Creates complete app configurations from prompts.

```typescript
import { generateApp, generateFileStructure } from '@your-organization/service-booking-sdk';

// Generate from simple prompt
const config = await generateApp("MTG tournament platform with epic warrior theme");

console.log(config.name);          // "The Gathering"
console.log(config.domain);        // "thegathering.com"
console.log(config.theme);         // Complete ThemeConfig
console.log(config.seo);           // SEO meta tags
console.log(config.assets);        // Asset suggestions
console.log(config.content);       // Page structure & copy

// Generate actual files
const files = generateFileStructure(config);
// Returns: { 'index.html': '...', 'tailwind.config.js': '...', etc }
```

### 3. **SEO Generator** - `generateSocialTags()`
Creates optimized meta tags for search engines and social platforms.

```typescript
import { generateSocialTags } from '@your-organization/service-booking-sdk';

const seo = generateSocialTags({
  businessName: "Bosca's Slingers",
  tagline: "Where Warriors Gather",
  domain: "boscaslingers.ai",
  industry: "mtg-tournaments"
});

console.log(seo.title);              // "Bosca's Slingers - Where Warriors Gather"
console.log(seo.ogTitle);            // Open Graph title
console.log(seo.twitterCard);        // "summary_large_image"
console.log(seo.keywords);           // ["magic the gathering", "mtg tournaments", ...]
```

### 4. **Asset Suggestions** - `suggestAssets()`
Generates specifications for all needed visual assets.

```typescript
import { suggestAssets, generateAssetChecklist } from '@your-organization/service-booking-sdk';

const theme = generateTheme(/* ... */);
const assets = suggestAssets(theme);

console.log(assets.ogImage.dimensions);    // "1200x630px"
console.log(assets.favicon.formats);       // Array of sizes/formats
console.log(assets.heroImages);            // Hero image specs
console.log(assets.logo.variations);       // Logo variations needed

// Get printable checklist
const checklist = generateAssetChecklist(assets);
console.log(checklist);
// Outputs formatted markdown checklist
```

### 5. **Content Auditor** - `auditFiles()`
Scans files for template content and suggests fixes.

```typescript
import { auditFiles, formatAuditReport } from '@your-organization/service-booking-sdk';

const files = [
  { path: 'src/pages/About.tsx', content: fs.readFileSync('...', 'utf-8') },
  { path: 'index.html', content: fs.readFileSync('...', 'utf-8') },
];

const theme = generateTheme(/* ... */);
const report = auditFiles(files, theme);

console.log(report.summary.totalIssues);      // Number of issues found
console.log(report.summary.criticalIssues);   // Critical issues count
console.log(report.recommendations);          // Array of recommendations

// Get formatted report
const formatted = formatAuditReport(report);
console.log(formatted);
```

## 💡 Complete Examples

### Example 1: Generate MTG Tournament Platform

```typescript
import { generateApp, generateFileStructure, generateAssetChecklist } from '@your-organization/service-booking-sdk';

async function createMTGPlatform() {
  // Generate configuration
  const config = await generateApp(
    "MTG tournament platform called Bosca's Slingers with epic warrior theme and orange colors"
  );

  // Create files
  const files = generateFileStructure(config);
  
  // Write to disk
  for (const [path, content] of Object.entries(files)) {
    await fs.writeFile(path, content);
  }

  // Get asset checklist
  const checklist = generateAssetChecklist(config.assets);
  await fs.writeFile('ASSETS.md', checklist);

  console.log('✅ Platform generated!');
  console.log(`Business: ${config.name}`);
  console.log(`Domain: ${config.domain}`);
  console.log(`Terminology: ${config.theme.terminology.book} → ${config.theme.terminology.service}`);
}
```

### Example 2: Audit Existing Project

```typescript
import { auditFiles, formatAuditReport, generateTheme, parseThemePrompt } from '@your-organization/service-booking-sdk';
import { readFile } from 'fs/promises';
import { glob } from 'glob';

async function auditProject() {
  // Get theme for terminology checks
  const themePrompt = parseThemePrompt("MTG tournaments with warrior theme");
  const theme = generateTheme(themePrompt);

  // Scan all relevant files
  const filePaths = await glob('src/**/*.{tsx,ts,html}');
  const files = await Promise.all(
    filePaths.map(async path => ({
      path,
      content: await readFile(path, 'utf-8')
    }))
  );

  // Run audit
  const report = auditFiles(files, theme);
  
  // Print report
  console.log(formatAuditReport(report));

  // Check for critical issues
  if (report.summary.criticalIssues > 0) {
    console.error(`❌ Found ${report.summary.criticalIssues} critical issues!`);
    process.exit(1);
  }
}
```

### Example 3: Custom Theme with Multiple Styles

```typescript
import { generateTheme } from '@your-organization/service-booking-sdk';

// Generate multiple theme variations
const themes = {
  maximalist: generateTheme({
    industry: 'mtg-tournaments',
    vibe: 'epic warrior',
    primaryColor: 'orange',
    visualStyle: 'maximalist'
  }),
  
  clean: generateTheme({
    industry: 'mtg-tournaments',
    vibe: 'professional',
    primaryColor: 'blue',
    visualStyle: 'minimalist'
  }),
  
  modern: generateTheme({
    industry: 'fitness',
    vibe: 'energetic',
    primaryColor: 'teal',
    visualStyle: 'modern'
  })
};

// Use different themes for different pages
console.log(themes.maximalist.components.buttons.primary);
console.log(themes.clean.components.buttons.primary);
```

## 🎨 Industry Presets

The SDK includes presets for common industries:

| Industry | Terminology Example | Suggested Colors |
|----------|-------------------|------------------|
| **MTG Tournaments** | register, format, warrior | orange, red |
| **Fitness** | schedule, class, member | blue, green, teal |
| **Consulting** | schedule, consultation, client | blue, purple |
| **Wellness** | book, session, client | green, teal, purple |
| **Education** | enroll, course, student | blue, purple, teal |

## 📚 API Reference

### Theme Generator

```typescript
function parseThemePrompt(prompt: string): ThemePrompt
function generateTheme(prompt: ThemePrompt): ThemeConfig
function generateTailwindConfig(theme: ThemeConfig): string
function generateThemedButton(theme: ThemeConfig): string
function suggestIndustry(keywords: string[]): string[]
```

### App Generator

```typescript
function parsePrompt(prompt: string): AppPrompt
function generateApp(prompt: string | AppPrompt): Promise<AppConfig>
function generateFileStructure(config: AppConfig): Record<string, string>
```

### SEO Generator

```typescript
function generateSocialTags(input: SocialTagsInput): SEOConfig
function generateStructuredData(config: SEOConfig, businessInfo: {...}): string
function generateRobotsTxt(domain: string): string
function generateSitemap(domain: string, pages: string[]): string
function generatePageMeta(baseConfig: SEOConfig, pageTitle: string, ...): Partial<SEOConfig>
```

### Asset Generator

```typescript
function suggestAssets(theme: ThemeConfig): AssetSuggestions
function generateAssetChecklist(assets: AssetSuggestions): string
function generateAssetCSS(assets: AssetSuggestions): string
```

### Content Auditor

```typescript
function auditFile(filePath: string, content: string, theme?: ThemeConfig): AuditResult
function auditFiles(files: {path: string, content: string}[], theme?: ThemeConfig): AuditReport
function formatAuditReport(report: AuditReport): string
function generateMigrationScript(results: AuditResult[], theme: ThemeConfig): string
function exportAuditJSON(report: AuditReport): string
```

## 🔧 Integration with Template

```typescript
// 1. Generate configuration
const config = await generateApp("your prompt here");

// 2. Clone template
git clone https://github.com/AntonyNeal/service-booking-platform-template.git my-project
cd my-project

// 3. Apply generated config
const files = generateFileStructure(config);
// Write files to overwrite template files

// 4. Update tenant config
// Copy config to src/tenants/custom/content.config.ts

// 5. Generate assets
const checklist = generateAssetChecklist(config.assets);
// Follow checklist to create images

// 6. Deploy
npm install
npm run build
```

## 📖 Learn More

- [Full API Documentation](../README.md)
- [Template Repository](https://github.com/AntonyNeal/service-booking-platform-template)
- [Example Projects](../examples/)

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](../LICENSE)
