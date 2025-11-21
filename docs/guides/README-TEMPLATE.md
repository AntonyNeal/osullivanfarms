# Service Booking Platform Template

A comprehensive, multi-tenant service booking platform built with React, TypeScript, and Vite. This template provides a complete foundation for building booking systems across various industries including consulting, coaching, professional services, and more.

## 🚀 Features

### Multi-Tenant Architecture

- **Subdomain-based routing** for tenant isolation
- **Dynamic theme and content configuration** per tenant
- **Scalable tenant management** system
- **A/B testing support** for photos and content

### Booking System

- **Real-time availability** management
- **Service catalog** with pricing options
- **Customer booking** interface
- **Admin dashboard** for booking management
- **Email notifications** and reminders

### Professional Features

- **Payment integration** (Stripe, PayPal ready)
- **Analytics dashboard** with booking insights
- **Photo gallery** with category management
- **Testimonial system** with ratings
- **SEO optimization** built-in
- **Responsive design** for all devices

### Technical Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom theming
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router with tenant detection
- **Build Tool**: Vite with optimized bundling

## 🏗️ Architecture

### Tenant System

Each tenant has isolated configurations for:

- **Content**: Services, pricing, contact info, bio
- **Theme**: Colors, fonts, layout preferences
- **Photos**: Hero images, galleries, testimonials
- **Features**: Enabled/disabled functionality per tenant

### File Structure

```
src/
├── core/                 # Core platform functionality
│   ├── types/           # TypeScript interfaces
│   ├── components/      # Shared components
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utility functions
├── tenants/            # Tenant-specific configurations
│   └── demo/           # Demo tenant (professional services)
│       ├── content.config.ts
│       ├── theme.config.ts
│       ├── photos.config.ts
│       └── index.ts
└── infrastructure/     # Backend and deployment configs
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the template**:

   ```bash
   git clone https://github.com/AntonyNeal/service-booking-platform-template.git
   cd service-booking-platform-template
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Visit the demo tenant**:
   - Open `http://localhost:5173` (main domain)
   - Or `http://demo.localhost:5173` (tenant subdomain)

## 🎨 Customization

### Creating Your First Tenant

1. **Copy the demo tenant**:

   ```bash
   cp -r src/tenants/demo src/tenants/yourbusiness
   ```

2. **Update content configuration**:

   ```typescript
   // src/tenants/yourbusiness/content.config.ts
   export const content: TenantContent = {
     name: 'Your Business Name',
     tagline: 'Your unique value proposition',
     bio: 'Your business description...',
     services: [
       {
         id: 'your-service',
         name: 'Your Service',
         description: 'What you offer...',
         duration: '60 minutes',
         price: 150,
         featured: true,
       },
     ],
     // ... rest of configuration
   };
   ```

3. **Customize theme**:

   ```typescript
   // src/tenants/yourbusiness/theme.config.ts
   export const theme: TenantTheme = {
     colors: {
       primary: '#your-brand-color',
       secondary: '#your-secondary-color',
       // ... other colors
     },
     fonts: {
       heading: 'Your-Font, sans-serif',
       body: 'Your-Body-Font, sans-serif',
     },
     layout: 'modern', // or 'elegant', 'minimal'
   };
   ```

4. **Add your photos**:
   ```typescript
   // src/tenants/yourbusiness/photos.config.ts
   export const photos: TenantPhotos = {
     hero: {
       control: {
         id: 'hero-main',
         url: 'https://your-image-url.com/hero.jpg',
         alt: 'Your hero image description',
       },
     },
     gallery: [
       // Your gallery photos
     ],
   };
   ```

### Deployment Options

#### DigitalOcean App Platform (Recommended)

The platform is optimized for DigitalOcean deployment with:

- **Automatic scaling** based on traffic
- **Built-in CDN** for global performance
- **Database integration** for bookings and tenant data
- **Environment variable management**

#### Other Platforms

- **Vercel**: Perfect for frontend deployment
- **Netlify**: Great for static hosting with serverless functions
- **AWS**: Complete control with S3, CloudFront, and Lambda

## 🛠️ Environment Configuration

### Required Environment Variables

```bash
# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_ENV=production

# Payment Integration
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_key

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENTS=true
```

### Development vs Production

The template includes environment-specific configurations:

- **Development**: Hot reloading, detailed error messages
- **Production**: Optimized bundles, error tracking, analytics

## 📊 Analytics & Monitoring

### Built-in Analytics

- **Booking conversion rates**
- **Service popularity metrics**
- **Revenue tracking**
- **Customer behavior insights**

### Supported Platforms

- Google Analytics 4
- Plausible Analytics
- Custom analytics endpoints

## 🔒 Security Features

- **Input validation** on all forms
- **CSRF protection** for state-changing requests
- **Rate limiting** for booking endpoints
- **Sanitized user content** display
- **Secure payment processing** (PCI compliant)

## 🌍 Multi-Language Support

The template is ready for internationalization:

- **Content translation** system
- **Date/time localization**
- **Currency formatting**
- **RTL language support**

## 📱 Mobile Optimization

- **Progressive Web App (PWA)** capabilities
- **Touch-optimized** booking interface
- **Offline support** for browsing
- **Fast loading** on mobile networks

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Check TypeScript types
npm run type-check

# Lint code
npm run lint
```

## 📚 Documentation

- **[API Documentation](./docs/api.md)**: Backend API reference
- **[Deployment Guide](./docs/deployment.md)**: Step-by-step deployment
- **[Customization Guide](./docs/customization.md)**: Advanced customization
- **[Tenant Management](./docs/tenants.md)**: Multi-tenant setup

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive guides and examples
- **Community**: Join our Discord for help and discussion

## 🚀 Roadmap

### Upcoming Features

- [ ] Advanced calendar integration (Google Calendar, Outlook)
- [ ] Multi-language content management
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered booking optimization
- [ ] Integration marketplace

### Recent Updates

- ✅ Multi-tenant architecture
- ✅ Payment system integration
- ✅ Real-time availability
- ✅ Photo management system
- ✅ SEO optimization

---

**Ready to launch your service booking platform?**

This template provides everything you need to get started. Customize the demo tenant, deploy to your preferred platform, and start accepting bookings today!

For questions or support, please [open an issue](https://github.com/AntonyNeal/service-booking-platform-template/issues) or contact us directly.
