# 🚀 Quick Start: Creating Your Custom Booking App

This guide walks you through forking this template and customizing it for your specific business using the built-in SDK generators.

## 📋 Prerequisites

- GitHub account
- Node.js 18+ installed
- Git installed
- Basic command line knowledge

## 🍴 Step 1: Fork This Repository

1. Click the **"Fork"** button at the top right of this repository
2. Choose your GitHub account as the destination
3. Name your fork (e.g., `my-business-booking`)
4. Click **"Create fork"**

## 💻 Step 2: Clone Your Fork

```bash
# Clone your forked repository
git clone https://github.com/YOUR-USERNAME/YOUR-FORK-NAME.git
cd YOUR-FORK-NAME

# Install dependencies
npm install
```

## 🎨 Step 3: Generate Your Theme & Configuration

The SDK includes powerful generators that create your entire app configuration from a simple prompt.

### Option A: Use the SDK Programmatically

Create a file `generate-my-app.js`:

```javascript
import { generateApp, generateFileStructure, generateAssetChecklist } from './sdk/src/index.js';
import fs from 'fs';

async function setup() {
  // 🎯 CUSTOMIZE THIS PROMPT FOR YOUR BUSINESS
  const config = await generateApp(
    "Fitness studio called FitLife with modern blue theme and energetic vibe, domain fitlife.com"
  );

  console.log('\n✅ Generated Configuration:');
  console.log('  Business:', config.name);
  console.log('  Domain:', config.domain);
  console.log('  Theme:', config.theme.colors.primary);
  console.log('  Terminology:', JSON.stringify(config.theme.terminology, null, 2));

  // Generate files
  const files = generateFileStructure(config);
  
  // Save configuration
  fs.writeFileSync('my-app-config.json', JSON.stringify(config, null, 2));
  
  // Save asset checklist
  const checklist = generateAssetChecklist(config.assets);
  fs.writeFileSync('MY-ASSETS-CHECKLIST.md', checklist);

  console.log('\n📄 Files generated:');
  console.log('  - my-app-config.json (your complete config)');
  console.log('  - MY-ASSETS-CHECKLIST.md (assets you need to create)');
  console.log('\nNext: Review the config and follow Step 4 to apply it!\n');
}

setup();
```

Run it:
```bash
node generate-my-app.js
```

### Option B: Use Interactive Prompts

```javascript
import { generateApp, parseThemePrompt, generateTheme } from './sdk/src/index.js';

// Answer these questions about your business:
const businessName = "Your Business Name";
const industry = "fitness"; // or: mtg-tournaments, consulting, wellness, education
const primaryColor = "blue"; // or: orange, purple, green, red, teal
const visualStyle = "modern"; // or: maximalist, minimalist, corporate
const domain = "yourdomain.com";

const prompt = `${industry} business called ${businessName} with ${visualStyle} ${primaryColor} theme, domain ${domain}`;
const config = await generateApp(prompt);

// Save and review
console.log(config);
```

## 📝 Step 4: Apply Your Configuration

After generating your config, apply it to the template:

### 4.1 Update Tenant Configuration

Copy generated content to `src/tenants/custom/content.config.ts`:

```typescript
export const content: TenantContent = {
  name: "YOUR_BUSINESS_NAME",
  tagline: "YOUR_TAGLINE",
  email: "contact@yourdomain.com",
  phone: "+1234567890",
  location: "Your City, State",
  website: "https://yourdomain.com",
  
  // Services from your generated config
  services: [
    {
      id: "service-1",
      name: "Your Service Name",
      description: "Service description",
      duration: "60 minutes",
      priceDisplay: "$100",
      category: "standard"
    }
  ],
  
  // ... rest from generated config
};
```

### 4.2 Update Theme Configuration

Update `src/tenants/custom/theme.config.ts`:

```typescript
export const theme: TenantTheme = {
  colors: {
    primary: 'YOUR_PRIMARY_COLOR',    // From generated config
    secondary: 'YOUR_SECONDARY_COLOR',
    accent: 'YOUR_ACCENT_COLOR',
  },
  // ... rest from generated config
};
```

### 4.3 Update Environment Variables

Create `.env` file:

```bash
VITE_API_BASE_URL=https://your-api.azurewebsites.net/api
VITE_TENANT_ID=custom
# Add other vars from generated config
```

### 4.4 Update Meta Tags

Replace `index.html` content with your generated index.html, or manually update:

```html
<!-- Primary Meta Tags -->
<title>Your Business - Your Tagline</title>
<meta name="description" content="Your description" />

<!-- Open Graph / Facebook -->
<meta property="og:title" content="Your Business - Your Tagline" />
<meta property="og:description" content="Your description" />
<meta property="og:image" content="https://yourdomain.com/og-image.jpg" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Your Business" />
<meta property="twitter:description" content="Your description" />
<meta property="twitter:image" content="https://yourdomain.com/og-image.jpg" />
```

## 🎨 Step 5: Create Your Assets

Follow the generated `MY-ASSETS-CHECKLIST.md` to create:

### Required Assets:
1. **Open Graph Image** (`public/og-image.jpg`)
   - Dimensions: 1200x630px
   - Contains: Business name, tagline, brand colors
   - Format: JPG or PNG

2. **Favicon** (`public/favicon.svg` or multiple sizes)
   - 16x16, 32x32, 180x180 PNG formats
   - SVG for modern browsers

3. **Hero Background** (`public/images/hero-bg.jpg`)
   - Dimensions: 1920x1080px or higher
   - Matches your theme style

### Tools for Creating Assets:
- **Canva**: Easy templates for og-image and graphics
- **Figma**: Professional design tool
- **Favicon.io**: Generate favicon sets
- **Unsplash/Pexels**: Free stock photos
- **Midjourney/DALL-E**: AI-generated images

## 🔍 Step 6: Audit Content

Before deploying, scan for any remaining template content:

```javascript
import { auditFiles, formatAuditReport, generateTheme, parseThemePrompt } from './sdk/src/index.js';
import fs from 'fs';
import { glob } from 'glob';

async function auditMyApp() {
  // Load your theme
  const themePrompt = parseThemePrompt("YOUR PROMPT HERE");
  const theme = generateTheme(themePrompt);

  // Scan all files
  const filePaths = await glob('src/**/*.{tsx,ts,html}');
  const files = await Promise.all(
    filePaths.map(async path => ({
      path,
      content: await fs.promises.readFile(path, 'utf-8')
    }))
  );

  // Run audit
  const report = auditFiles(files, theme);
  console.log(formatAuditReport(report));

  if (report.summary.criticalIssues > 0) {
    console.error(`\n❌ Found ${report.summary.criticalIssues} critical issues!`);
    console.error('Please fix before deploying.\n');
    process.exit(1);
  }
}

auditMyApp();
```

## 🚀 Step 7: Deploy to Azure

### 7.1 Create Azure Resources

```bash
# Install Azure CLI if needed
# Then login
az login

# Create resource group
az group create --name my-app-rg --location eastus

# Create PostgreSQL database
az postgres flexible-server create \
  --resource-group my-app-rg \
  --name my-app-db \
  --location eastus \
  --admin-user myadmin \
  --admin-password 'YourPassword123!' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 14

# Create Static Web App
az staticwebapp create \
  --name my-app-web \
  --resource-group my-app-rg \
  --location eastus2 \
  --source https://github.com/YOUR-USERNAME/YOUR-FORK-NAME \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

### 7.2 Configure Custom Domain

```bash
# Add your custom domain
az staticwebapp hostname set \
  --name my-app-web \
  --resource-group my-app-rg \
  --hostname www.yourdomain.com

# Get validation token
az staticwebapp hostname list \
  --name my-app-web \
  --resource-group my-app-rg
```

Then add DNS records at your domain registrar:
- **TXT record** for validation
- **CNAME record** pointing to your Azure Static Web App URL

### 7.3 Set Environment Variables

In Azure Portal → Static Web App → Configuration:
```
VITE_API_BASE_URL=https://your-api.azurewebsites.net/api
VITE_TENANT_ID=custom
```

## ✅ Step 8: Test & Verify

1. **Local Testing**:
   ```bash
   npm run dev
   # Visit http://localhost:5173
   ```

2. **Build Test**:
   ```bash
   npm run build
   npm run preview
   ```

3. **Check Deployment**:
   - Visit your Azure URL
   - Test all pages
   - Verify booking flow
   - Check mobile responsiveness

4. **SEO Check**:
   - Use Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
   - Use Twitter Card Validator: https://cards-dev.twitter.com/validator
   - Check Google Search Console

## 🎯 Common Customization Scenarios

### Scenario 1: "I want different terminology"

Edit `src/tenants/custom/content.config.ts`:
```typescript
// Change what users see
services: [
  {
    name: "Personal Training",  // Not "Service"
    // ...
  }
]
```

Or regenerate with different prompt:
```javascript
const config = await generateApp("fitness studio where we call services 'classes' and clients 'members'");
```

### Scenario 2: "I want a different color scheme"

Regenerate theme:
```javascript
const theme = generateTheme({
  industry: 'fitness',
  vibe: 'energetic',
  primaryColor: 'teal',  // Change this
  visualStyle: 'modern'
});
```

Then update `tailwind.config.js` with new colors.

### Scenario 3: "I want to add more services"

Edit `src/tenants/custom/content.config.ts`:
```typescript
services: [
  // Add new services here
  {
    id: "new-service",
    name: "New Service Name",
    description: "Description",
    duration: "90 minutes",
    priceDisplay: "$150",
    category: "premium"
  }
]
```

### Scenario 4: "I want different page layouts"

The generators create starting points. Customize:
- `src/pages/Home.tsx` - Landing page
- `src/pages/Services.tsx` - Services listing
- `src/pages/Prices.tsx` - Pricing page
- `src/pages/About.tsx` - About page

## 🆘 Troubleshooting

### "I see template content still"
Run the content auditor:
```bash
node audit-my-app.js
```
It will show you exactly what needs to be changed.

### "My colors aren't applying"
1. Check `tailwind.config.js` has your colors
2. Run `npm run build` to regenerate CSS
3. Clear browser cache

### "Social media preview not working"
1. Ensure `og-image.jpg` exists in `public/`
2. Verify meta tags in `index.html`
3. Use Facebook/Twitter debugger tools to refresh cache

### "Deployment failing"
1. Check GitHub Actions logs
2. Verify build command: `npm run build`
3. Ensure output directory: `dist`
4. Check for TypeScript errors: `npm run type-check`

## 📚 Additional Resources

- **SDK Documentation**: `sdk/GENERATORS-GUIDE.md`
- **API Documentation**: `SDK-USAGE-GUIDE.md`
- **Deployment Guide**: `DEPLOYMENT-GUIDE.md`
- **Multi-tenant Setup**: `MULTI-TENANT-ARCHITECTURE.md`

## 🎉 You're Ready!

Your forked repository is now customized for your business. The SDK generators have:
- ✅ Created your theme configuration
- ✅ Generated appropriate terminology
- ✅ Set up SEO meta tags
- ✅ Provided asset specifications
- ✅ Audited content for issues

Now go build something amazing! 🚀

---

**Questions or Issues?**
- Check the documentation in `/docs`
- Open an issue on GitHub
- Review example: `sdk/examples/generate-bosca-slingers.ts`
