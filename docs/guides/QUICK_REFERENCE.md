# 🚀 Quick Reference

## Essential Commands

### Development

```powershell
# Install everything
.\install.ps1

# Start frontend (http://localhost:5173)
npm run dev

# Start backend (http://localhost:3001)
cd api && npm run dev

# Run all checks
npm run lint && npm run type-check && npm run test:unit:run
```

### Testing

```powershell
npm run test              # E2E tests (Playwright)
npm run test:unit         # Unit tests watch mode
npm run test:unit:run     # Unit tests once
```

### Building

```powershell
npm run build            # Production build
npm run preview          # Preview build locally
```

### Code Quality

```powershell
npm run lint             # Check for errors
npm run lint:fix         # Fix errors
npm run format           # Format code
npm run format:check     # Check formatting
npm run type-check       # TypeScript check
```

## Project Structure Quick View

```
sw_website/
├── src/                    # Frontend code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   └── services/          # API services
├── api/                   # Backend API
├── functions/             # Serverless functions
└── tests/                 # E2E tests
```

## Important Files

| File                 | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `.env`               | Environment variables (create from .env.example) |
| `package.json`       | Frontend dependencies & scripts                  |
| `api/package.json`   | Backend dependencies                             |
| `vite.config.ts`     | Build configuration                              |
| `tailwind.config.js` | Styling configuration                            |
| `.do/app.yaml`       | DigitalOcean deployment                          |

## Environment Variables

**Required for Frontend:**

- `VITE_API_BASE_URL` - API endpoint (default: http://localhost:3001/api)

**Required for Backend:**

- `PORT` - Server port (default: 3001)
- `ALLOWED_ORIGINS` - CORS origins
- `DATABASE_URL` - PostgreSQL connection string

## Deployment Quick Steps

### DigitalOcean App Platform

```powershell
# Install CLI
scoop install doctl

# Login
doctl auth init

# Deploy
doctl apps create --spec .do/app.yaml
```

### Functions

```powershell
cd functions
doctl serverless deploy . --remote-build
```

## Git Workflow

```powershell
# Start new feature
git checkout -b feature/my-feature

# Check status
git status

# Commit (auto-lints)
git add .
git commit -m "feat: my feature"

# Push
git push origin feature/my-feature
```

## Common Issues

**Port in use:**

```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Dependencies issue:**

```powershell
rm -rf node_modules
rm package-lock.json
npm install
```

**Build errors:**

```powershell
rm -rf dist
npm run build
```

## URLs

- **Frontend Dev**: http://localhost:5173
- **Backend Dev**: http://localhost:3001
- **API Health**: http://localhost:3001/health
- **Preview**: http://localhost:5174

## Documentation

- **README.md** - Full documentation
- **DEVELOPMENT.md** - Setup guide
- **CHECKLIST.md** - Setup checklist
- **IMPLEMENTATION_SUMMARY.md** - What was built

## Tech Stack at a Glance

**Frontend**: React 18 + TypeScript + Vite + Tailwind  
**Backend**: Express.js + Node.js 20+  
**Database**: PostgreSQL  
**Hosting**: DigitalOcean App Platform  
**Testing**: Playwright + Vitest  
**CI/CD**: GitHub Actions

## Cost Estimate

**Basic**: ~$27-33/month  
**Production**: ~$113-125/month

## Support

Check the documentation files or review the example code in `src/` and `api/`.

---

**Quick Start**: Run `.\install.ps1` then `npm run dev` 🚀
