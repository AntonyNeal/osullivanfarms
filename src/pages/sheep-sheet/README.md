# SheepSheet - Farm Management CRUD Application

## 📋 Overview

SheepSheet is a mobile-first, offline-capable farm management application designed for tracking sheep mobs through complete breeding cycles. Built specifically for Leigh O'Sullivan's sheep farm near Wagga Wagga, NSW, this application digitizes traditional Excel spreadsheet workflows into a modern, responsive web application.

## 🎯 Key Features

### ✅ Complete Breeding Cycle Tracking

- **5 Stages**: Joining → Scanning → Lambing → Marking → Weaning
- **26 Mobs**: Track multiple sheep groups simultaneously
- **55+ Data Points**: Comprehensive data capture per mob

### ✅ KPI Dashboard

- Real-time calculation of 6 critical percentages
- Scanning %, Marking %, Weaning %, Lamb Survival %
- Farm-wide summary statistics
- Stage distribution visualization

### ✅ Advanced Filtering

- Multi-dimensional filtering by:
  - Breed (Merinos, Dohnes)
  - Zone (Deni, Elmore, Goolgowi)
  - Team (Self Replacing, Terminal)
  - Status (ewe, maidens, ewe lamb)
  - Current Stage

### ✅ Offline-First Architecture

- Works completely without internet for 48+ hours
- Local IndexedDB storage
- Automatic sync when connectivity returns
- Conflict resolution system
- Visual sync status indicator

### ✅ Mobile-Optimized UI

- Large touch targets (48px minimum) for glove usage
- High contrast for outdoor visibility
- One-handed operation
- Fast data entry forms
- Minimal typing required

## 🗄️ Database Schema

### Core Tables

1. **Mobs** - Main entity tracking each sheep mob
2. **JoiningData** - Stage 1: Ram introduction data
3. **ScanningData** - Stage 2: Pregnancy ultrasound results
4. **LambingData** - Stage 3: Birth statistics
5. **MarkingData** - Stage 4: Lamb processing data
6. **WeaningData** - Stage 5: Lamb separation metrics

### Lookup Tables

- **Breeds** - Merinos, Dohnes
- **Zones** - Geographic locations
- **Teams** - Self Replacing, Terminal
- **StatusTypes** - ewe, maidens, ewe lamb
- **BreedingStages** - 5 breeding cycle stages

### Sync Tables

- **AuditLog** - Complete change history
- **SyncQueue** - Offline operation queue

## 📐 Calculated KPIs

All percentages are automatically calculated:

1. **Scanning %** = ((twins × 2) + singles) ÷ in_lamb × 100
2. **% Marked to Joined** = lambs_marked ÷ ewes_joined × 100
3. **% Marked to Scanned** = lambs_marked ÷ in_lamb × 100
4. **Lamb Survival %** = (wet_ewes ÷ total_ewes) × 100
5. **% Weaned to Joined** = lambs_weaned ÷ ewes_joined × 100
6. **% Weaned to Marked** = lambs_weaned ÷ lambs_marked × 100

## 🏗️ Architecture

### Frontend

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **State**: React Hooks + Context
- **Offline Storage**: IndexedDB
- **PWA**: Service Workers for offline capability

### Backend (Planned)

- **API**: Azure Functions (REST)
- **Database**: Azure SQL Database
- **Auth**: Azure AD B2C
- **Storage**: Azure Blob Storage
- **Hosting**: Azure Static Web Apps

## 📱 Pages & Components

### Main Pages

1. **Dashboard** (`/sheep-sheet`)
   - KPI scoreboard
   - Mob list view
   - Advanced filtering
   - Stage distribution charts

2. **Mob Detail** (`/sheep-sheet/mob/:mobId`)
   - Overview tab with quick stats
   - Individual tabs for each breeding stage
   - Timeline visualization
   - Change history

### Key Components

- **MobDashboard**: Main listing with filters and KPIs
- **MobDetail**: Individual mob data with tabbed interface
- **SyncStatusIndicator**: Offline/online status
- **FilterPanel**: Multi-select filtering system

## 🔧 Setup & Installation

### Prerequisites

```bash
Node.js 18+
npm or yarn
```

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Database Setup

```bash
# Run schema creation script on Azure SQL
sqlcmd -S your-server.database.windows.net -U admin -P password -d SheepSheet -i src/pages/sheep-sheet/schema.sql
```

## 📊 Data Model

### Type Definitions

All TypeScript interfaces are defined in `types.ts`:

- Core entities (Mob, JoiningData, etc.)
- Composite views (MobKPI, FarmSummary)
- Form data types
- Filter interfaces
- Sync queue types

### Sample Mob Data

```typescript
{
  mob_id: 1,
  mob_name: "Mob 1 - Merino Ewes",
  breed_name: "Merinos",
  zone_name: "Deni",
  team_name: "Self Replacing",
  current_stage: "Scanning",
  ewes_joined: 545,
  scanning_percent: 158.0,
  in_lamb: 465
}
```

## 🎨 Design Principles

1. **Mobile-First**: Designed for phone, scales to tablet/desktop
2. **Offline-First**: Works without internet
3. **KPI-Focused**: Percentages drive all decisions
4. **Filter-Powered**: Fast multi-dimensional filtering
5. **Familiar**: Feels like enhanced spreadsheet
6. **Generic**: Scalable beyond single farm

## 🚀 Deployment

### Azure Static Web Apps

```bash
# Build
npm run build

# Deploy via GitHub Actions (automated)
git push origin main
```

### Environment Variables

```env
VITE_API_BASE_URL=https://your-api.azurewebsites.net
VITE_ENABLE_OFFLINE=true
VITE_SYNC_INTERVAL=300000
```

## 📈 Performance Targets

- ✅ Form submission: < 1 second
- ✅ List view load: < 2 seconds
- ✅ Offline capability: 48+ hours
- ✅ Touch target size: 48px minimum
- ✅ Contrast ratio: 4.5:1 minimum

## 🔐 Security

- No hardcoded credentials
- Azure AD B2C authentication (planned)
- Row-level security in database
- HTTPS only
- Audit logging enabled

## 📝 Future Enhancements (Phase 2+)

- [ ] AI-powered predictions
- [ ] IoT sensor integration
- [ ] Automated workflow alerts
- [ ] Multi-farm management
- [ ] Advanced reporting & analytics
- [ ] Photo uploads
- [ ] NLIS integration
- [ ] LPA compliance tracking

## 🐛 Known Issues

- Mock data currently used (API integration pending)
- Offline sync not yet implemented
- Photo upload not available
- Export to Excel pending

## 📖 Documentation

- **Schema**: `schema.sql` - Complete database structure
- **Types**: `types.ts` - TypeScript interfaces
- **Project Brief**: See parent directory for full requirements

## 🤝 Contributing

This is a private farm management system. For questions or issues:

- Contact: Julian (Developer)
- Farm Owner: Leigh O'Sullivan
- Location: Near Wagga Wagga, NSW

## 📄 License

Proprietary - All rights reserved

---

**Version**: 1.0.0 (MVP)  
**Last Updated**: November 16, 2025  
**Status**: Development - Phase 1
