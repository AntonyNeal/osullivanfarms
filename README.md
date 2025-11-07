# Claire Hamilton

A modern, elegant companion website built with React, TypeScript, and DigitalOcean cloud infrastructure.

---

## 🎯 Current State vs. Future Vision

> **Last Verified**: November 7, 2025 via DigitalOcean API  
> **Full Details**: See [INFRASTRUCTURE-ACTUAL-STATE.md](./INFRASTRUCTURE-ACTUAL-STATE.md)

### ✅ Currently Deployed (Production)

**Live Site**: https://avaliable.pro

**Architecture**:

- **Frontend**: React 18.3 SPA deployed via DigitalOcean App Platform
- **Backend**: Express.js API serving `/api/*` routes
- **Database**: PostgreSQL 16 (1GB, managed, Sydney region)
- **Deployment**: Single monolithic app with 2 services (api + frontend)
- **Region**: Sydney, Australia
- **Status**: Active and operational

**What's Working**:

- ✅ React SPA with Tailwind CSS
- ✅ Express.js API routes
- ✅ PostgreSQL database online
- ✅ Cloudflare DNS + SSL
- ✅ Single-tenant Claire Hamilton site

**What's NOT Deployed** (despite documentation):

- ❌ DigitalOcean Functions (0 namespaces - using Express.js instead)
- ❌ Spaces CDN (not created - serving assets from app)
- ❌ Multi-tenant subdomain routing (code ready, not deployed)
- ❌ Terraform-managed infrastructure (configs exist, not applied)
- ❌ prebooking.pro domain (registered but no DNS records)

### 🔮 Future Vision (Planned)

The codebase contains extensive multi-tenant platform infrastructure designed for future expansion:

- 📋 **Multi-Tenant Platform**: `*.prebooking.pro` subdomain routing for multiple companions
- 📋 **DigitalOcean Functions**: Serverless architecture (code written, ready to deploy)
- 📋 **Spaces + CDN**: Global asset delivery
- 📋 **Terraform IaC**: Infrastructure as Code for automated provisioning
- 📋 **A/B Testing Framework**: Photo variant testing and analytics
- 📋 **Advanced Analytics**: Social media correlation, conversion funnels

**Documentation Note**: Many documents (MULTI-TENANT-ARCHITECTURE.md, BOOKING_SYSTEM_GUIDE.md) describe this future vision, not the current production state.

---

## ✨ Key Features

### Backend Infrastructure (Phase 1 - 40% Complete)

- ✅ **PostgreSQL Database Schema** - Complete with 8 tables, indexes, triggers, constraints
- ✅ **UTM Attribution Tracking** - Frontend session management with browser fingerprinting
- ✅ **Booking API** - POST /api/bookings with validation, duplicate detection, email notifications
- ✅ **Session Registration** - POST /api/sessions/register for user tracking
- ✅ **Analytics Aggregation** - GET /api/analytics/bookings with platform attribution
- ⏳ **Payment Integration** - Eway/PayID (Phase 2)
- ⏳ **A/B Testing** - Experimentation framework (Phase 2)
- ⏳ **Privacy Analytics** - PostHog/Plausible integration (Phase 2)

### Frontend Features

- Responsive booking form with validation
- Real-time UTM parameter extraction
- Session persistence across browser tabs
- Conversion funnel tracking
- Mobile-optimized UI with Tailwind CSS

---

## 🚀 Tech Stack

### Frontend

- **Framework**: React 18.3 with TypeScript 5.8
- **Build Tool**: Vite 7.1
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router DOM 7.8
- **State Management**: TanStack Query 5.85
- **UI Components**: Headless UI, Heroicons, Lucide React
- **Testing**: Playwright 1.55, Vitest 3.2

### Backend

- **Runtime**: Node.js 20+
- **Framework**: Express.js ✅ (Production)
- **Database**: PostgreSQL 16 Managed ✅ (Production)
- **Serverless**: DigitalOcean Functions 📋 (Planned - code ready)

### Infrastructure

- **Hosting**: DigitalOcean App Platform ✅ (Sydney region)
- **Architecture**: Monolithic (api + frontend services)
- **CDN**: DigitalOcean Spaces 📋 (Planned - Terraform configs ready)
- **IaC**: Terraform 📋 (Configs written, not yet applied)

## 📁 Project Structure

```
sw_website/
├── src/                      # Frontend React application
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── config/             # Configuration files
│   ├── types/              # TypeScript type definitions
│   ├── assets/             # Static assets
│   └── test/               # Test utilities
├── api/                     # Express.js API
│   ├── routes/             # API routes
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   └── server.js           # Express server
├── functions/              # DigitalOcean Functions
│   ├── packages/           # Function packages
│   └── project.yml         # Functions config
├── terraform/              # Infrastructure as Code
│   ├── main.tf            # Main Terraform config
│   ├── variables.tf       # Input variables
│   └── outputs.tf         # Output values
├── tests/                  # E2E tests (Playwright)
├── .github/workflows/     # GitHub Actions
└── .do/                   # DigitalOcean App Platform config
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20.19.0 or higher
- npm or yarn
- DigitalOcean account (for deployment)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/AntonyNeal/sw_website.git
cd sw_website
```

2. **Install frontend dependencies**

```bash
npm install
```

3. **Install API dependencies**

```bash
cd api
npm install
cd ..
```

4. **Set up environment variables**

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration for Claire Hamilton's website:

```bash
VITE_API_BASE_URL=http://localhost:3001/api
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# Add other variables as needed
```

### Backend Deployment (Quick Start)

**For a complete step-by-step deployment guide, see [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)**

Quick summary:

1. Create PostgreSQL 15 database on DigitalOcean
2. Deploy schema: `psql "your_connection_string" -f db/schema.sql`
3. Configure environment variables in DigitalOcean App Platform
4. Set up SendGrid account and add credentials
5. Push to GitHub - auto-deploys via GitHub Actions

Expected time: **30-45 minutes**

### Backend Testing (Quick Start)

**For comprehensive testing procedures, see [TESTING-GUIDE.md](./TESTING-GUIDE.md)**

Quick verification:

1. POST /api/bookings - Create a test booking
2. Check inbox - Verify confirmation emails sent
3. GET /api/analytics/bookings - Query conversion data
4. Inspect database - Verify records created

---

## 🛠️ Getting Started (Development)

### Development

**Start the frontend development server:**

```bash
npm run dev
```

The app will be available at http://localhost:5173

**Start the API server (in a separate terminal):**

```bash
cd api
npm run dev
```

The API will be available at http://localhost:3001

### Building for Production

**Build the frontend:**

```bash
npm run build
```

**Preview the production build:**

```bash
npm run preview
```

## 🧪 Testing

**Run unit tests:**

```bash
npm run test:unit
```

**Run E2E tests:**

```bash
npm test
```

**Run unit tests with UI:**

```bash
npm run test:unit:ui
```

## 🎨 Code Quality

**Lint code:**

```bash
npm run lint
```

**Fix linting issues:**

```bash
npm run lint:fix
```

**Format code:**

```bash
npm run format
```

**Check formatting:**

```bash
npm run format:check
```

**Type check:**

```bash
npm run type-check
```

## 🚢 Deployment

### DigitalOcean App Platform

#### Using the Web Console:

1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect your GitHub repository
4. DigitalOcean will auto-detect settings from `.do/app.yaml`
5. Add environment variables
6. Deploy

#### Using CLI:

```bash
# Install DigitalOcean CLI
# Windows (using scoop)
scoop install doctl

# Authenticate
doctl auth init

# Create app
doctl apps create --spec .do/app.yaml

# Update app
doctl apps update YOUR_APP_ID --spec .do/app.yaml
```

### DigitalOcean Functions

```bash
# Navigate to functions directory
cd functions

# Deploy functions
doctl serverless deploy . --remote-build

# List deployed functions
doctl serverless functions list
```

### Infrastructure (Terraform)

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var="do_token=YOUR_TOKEN"

# Apply changes
terraform apply -var="do_token=YOUR_TOKEN"
```

## 🤖 DigitalOcean MCP Integration

**NEW**: Manage your DigitalOcean infrastructure directly through GitHub Copilot!

The Model Context Protocol (MCP) integration allows you to interact with DigitalOcean services using natural language in Copilot Chat.

### Quick Setup

1. Get your API token: https://cloud.digitalocean.com/account/api/tokens
2. Set environment variable:
   ```powershell
   [System.Environment]::SetEnvironmentVariable('DO_API_TOKEN', 'your_token', 'User')
   ```
3. Restart VS Code

### Usage

Ask Copilot about your infrastructure:

```
@workspace List my DigitalOcean apps
@workspace Show my database connection details
@workspace Add SSH key named "mykey"
```

📚 **Full documentation**: See `mcp-server/README.md`  
⚡ **Quick reference**: See `mcp-server/QUICK-REFERENCE.md`

---

## 🔧 Environment Variables

### Frontend

| Variable                 | Description                | Required |
| ------------------------ | -------------------------- | -------- |
| `VITE_API_BASE_URL`      | Backend API base URL       | Yes      |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 ID      | No       |
| `VITE_FUNCTIONS_URL`     | DigitalOcean Functions URL | No       |

### Backend

| Variable          | Description                          | Required |
| ----------------- | ------------------------------------ | -------- |
| `PORT`            | API server port                      | Yes      |
| `DATABASE_URL`    | PostgreSQL connection string         | Yes      |
| `ALLOWED_ORIGINS` | CORS allowed origins                 | Yes      |
| `NODE_ENV`        | Environment (development/production) | Yes      |

### MCP Server

| Variable       | Description            | Required |
| -------------- | ---------------------- | -------- |
| `DO_API_TOKEN` | DigitalOcean API token | Yes      |

## 📦 CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **PR Checks**: Runs on every pull request
  - Linting
  - Type checking
  - Unit tests
  - Build validation

- **Deployment**: Runs on pushes to `main`
  - Deploys to DigitalOcean App Platform
  - Deploys serverless functions

### Required GitHub Secrets

- `DIGITALOCEAN_ACCESS_TOKEN`: DigitalOcean API token
- `APP_ID`: DigitalOcean App Platform app ID
- `GA_MEASUREMENT_ID`: Google Analytics measurement ID
- `API_BASE_URL`: Production API URL

## 📊 Monitoring & Analytics

- **Google Analytics 4**: User behavior tracking
- **DigitalOcean Monitoring**: Built-in metrics for apps and databases
- **Web Vitals**: Core Web Vitals monitoring

## 🔒 Security

- HTTPS enforced via App Platform
- Environment variables stored as encrypted secrets
- CORS properly configured
- Database encryption at rest
- Regular dependency updates via Dependabot

## 💰 Cost Estimation

### Basic Setup

- App Platform (Basic): $5-12/month
- Managed PostgreSQL (1GB): $15/month
- Functions (1M requests): $1.85/month
- Spaces (250GB + CDN): $5/month
- **Total**: ~$27-33/month

### Production Setup

- App Platform (Professional): $12-24/month
- Managed PostgreSQL (4GB): $60/month
- Functions (5M requests): $9.25/month
- Spaces (1TB + CDN): $20/month
- **Total**: ~$113-125/month

## 📝 Scripts Reference

| Script                  | Description                  |
| ----------------------- | ---------------------------- |
| `npm run dev`           | Start development server     |
| `npm run build`         | Build for production         |
| `npm run preview`       | Preview production build     |
| `npm run lint`          | Lint code                    |
| `npm run lint:fix`      | Fix linting issues           |
| `npm run format`        | Format code with Prettier    |
| `npm run format:check`  | Check code formatting        |
| `npm run type-check`    | Run TypeScript type checking |
| `npm test`              | Run E2E tests                |
| `npm run test:unit`     | Run unit tests in watch mode |
| `npm run test:unit:run` | Run unit tests once          |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support & Documentation

### Project Documentation

- **[mcp-server/README.md](./mcp-server/README.md)** - Complete guide to DigitalOcean MCP integration with Copilot
- **[mcp-server/QUICK-REFERENCE.md](./mcp-server/QUICK-REFERENCE.md)** - Quick reference for MCP commands
- **[DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)** - Complete step-by-step guide to deploy backend to DigitalOcean (30-45 min)
- **[TESTING-GUIDE.md](./TESTING-GUIDE.md)** - Comprehensive testing procedures for all API endpoints and features
- **[BACKEND-IMPLEMENTATION.md](./BACKEND-IMPLEMENTATION.md)** - Backend architecture, 40% Phase 1 completion status, and remaining work
- **[TECHNICAL-ANALYSIS-REPORT.md](./TECHNICAL-ANALYSIS-REPORT.md)** - Architecture analysis and optimization recommendations
- **[DO-CLI-SETUP.md](./DO-CLI-SETUP.md)** - PowerShell wrapper for DigitalOcean CLI operations
- **[DO-CLI-QUICK-REF.md](./DO-CLI-QUICK-REF.md)** - Quick reference for DigitalOcean CLI commands

### External Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/)
- [DigitalOcean Functions](https://docs.digitalocean.com/products/functions/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SendGrid API](https://docs.sendgrid.com/)

## ✅ Deployment Checklist

- [ ] Configure environment variables
- [ ] Set up DigitalOcean account
- [ ] Generate DigitalOcean API token
- [ ] Configure Google Analytics (optional)
- [ ] Set up GitHub Actions secrets
- [ ] Deploy infrastructure with Terraform
- [ ] Deploy to App Platform
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificates (automatic via App Platform)
- [ ] Configure database backups
- [ ] Test deployment
- [ ] Monitor application logs

---

**Last Updated**: November 5, 2025  
**Stack Version**: 2.0 (DigitalOcean Edition)  
**Minimum Node Version**: 20.19.0
