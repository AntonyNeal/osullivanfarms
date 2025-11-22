# Project Setup Checklist

## ✅ Completed

- [x] Project structure created
- [x] Package configuration (package.json, tsconfig.json)
- [x] Tailwind CSS configured
- [x] Vite configuration with optimizations
- [x] React application setup
- [x] Express.js API structure
- [x] DigitalOcean Functions setup
- [x] ESLint and Prettier configuration
- [x] Testing setup (Playwright, Vitest)
- [x] Environment configuration
- [x] DigitalOcean App Platform config (.do/app.yaml)
- [x] GitHub Actions CI/CD pipeline
- [x] Documentation (README, DEVELOPMENT guide)

## 📝 Next Steps

### 1. Install Dependencies

```powershell
# Option A: Use the install script
.\install.ps1

# Option B: Manual installation
npm install
cd api && npm install && cd ..
```

### 2. Configure Environment Variables

- [ ] Copy `.env.example` to `.env`
- [ ] Update `.env` with your values:
  - [ ] API URLs (for development, use defaults)
  - [ ] Google Analytics ID (if applicable)
  - [ ] Other service credentials

### 3. Test Local Development

- [ ] Start frontend: `npm run dev`
- [ ] Start API: `cd api && npm run dev`
- [ ] Visit http://localhost:5173
- [ ] Test API at http://localhost:3001/health

### 4. Set Up DigitalOcean (For Deployment)

- [ ] Create DigitalOcean account
- [ ] Generate Personal Access Token
- [ ] Install doctl: `scoop install doctl`
- [ ] Authenticate: `doctl auth init`

### 5. Configure GitHub Repository

- [ ] Initialize Git (if not already): `git init`
- [ ] Add all files: `git add .`
- [ ] Initial commit: `git commit -m "Initial commit: complete stack setup"`
- [ ] Add remote: `git remote add origin https://github.com/AntonyNeal/sw_website.git`
- [ ] Push to GitHub: `git push -u origin main`

### 6. Set Up GitHub Secrets (For CI/CD)

Go to GitHub repository → Settings → Secrets and variables → Actions

- [ ] `DIGITALOCEAN_ACCESS_TOKEN` - Your DigitalOcean API token
- [ ] `APP_ID` - DigitalOcean App Platform app ID (after first deployment)
- [ ] `GA_MEASUREMENT_ID` - Google Analytics measurement ID (optional)
- [ ] `API_BASE_URL` - Production API URL (optional)

### 7. Deploy to DigitalOcean

**Option A: Web Console**

1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect GitHub repository
4. Auto-detects config from `.do/app.yaml`
5. Add environment variables
6. Deploy

**Option B: CLI**

```powershell
doctl apps create --spec .do/app.yaml
```

### 8. Deploy Functions (Optional)

```powershell
cd functions
doctl serverless deploy . --remote-build
```

### 10. Post-Deployment

- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificates (automatic via App Platform)
- [ ] Configure database backups
- [ ] Set up monitoring alerts
- [ ] Test production deployment
- [ ] Review application logs

## 🔧 Development Workflow

### Daily Development

1. Pull latest changes: `git pull`
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes
4. Run tests: `npm run test:unit:run`
5. Run linting: `npm run lint`
6. Commit: `git commit -m "feat: description"`
7. Push: `git push origin feature/your-feature`
8. Create Pull Request on GitHub

### Before Committing

```powershell
npm run lint          # Check for linting errors
npm run type-check    # Check TypeScript types
npm run format:check  # Check code formatting
npm run test:unit:run # Run unit tests
```

## 📚 Important Files

- **README.md** - Main documentation
- **DEVELOPMENT.md** - Developer setup guide
- **COMPLETE-STACK-SETUP.md** - Detailed stack documentation
- **.env.example** - Environment variables template
- **.do/app.yaml** - DigitalOcean App Platform config
- **terraform/** - Infrastructure as Code
- **.github/workflows/** - CI/CD pipelines

## 🆘 Troubleshooting

### Dependencies Not Installing

```powershell
rm -rf node_modules
rm package-lock.json
npm install
```

### Port Already in Use

```powershell
# Find and kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Build Errors

```powershell
rm -rf dist
npm run build
```

### TypeScript Errors

The TypeScript errors you see are expected until dependencies are installed:

```powershell
npm install
```

## 📞 Support

- Check [README.md](README.md) for comprehensive documentation
- Review [DEVELOPMENT.md](DEVELOPMENT.md) for development setup
- See [COMPLETE-STACK-SETUP.md](COMPLETE-STACK-SETUP.md) for detailed stack info

## 🎯 Current Status

**Status**: ✅ Project scaffolding complete  
**Next Action**: Install dependencies using `.\install.ps1` or `npm install`  
**Ready for**: Local development and deployment

---

**Last Updated**: November 5, 2025  
**Version**: 1.0.0
