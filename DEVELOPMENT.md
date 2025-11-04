# Development Setup Guide

## Quick Start

### 1. Install Dependencies

```powershell
# Install frontend dependencies
npm install

# Install API dependencies
cd api
npm install
cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the values in `.env` with your configuration.

### 3. Start Development Servers

**Frontend (Terminal 1):**
```powershell
npm run dev
```

**API (Terminal 2):**
```powershell
cd api
npm run dev
```

## First Time Setup

### Initialize Git Hooks

```powershell
npm run prepare
```

This will set up Husky for pre-commit hooks.

### Install DigitalOcean CLI (Optional)

For deployment and functions testing:

```powershell
# Using scoop
scoop install doctl

# Authenticate
doctl auth init
```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Run checks before committing**
   ```powershell
   npm run lint
   npm run type-check
   npm run test:unit:run
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

   Husky will automatically run linting and formatting.

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Common Tasks

### Adding a New Page

1. Create component in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Update navigation if needed

### Adding a New API Endpoint

1. Create controller in `api/controllers/`
2. Create route in `api/routes/`
3. Import route in `api/server.js`

### Adding a New Component

1. Create in `src/components/YourComponent.tsx`
2. Export from component file
3. Import where needed

## Troubleshooting

### Port Already in Use

If port 5173 or 3001 is in use:

```powershell
# Find process using port
netstat -ano | findstr :5173

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Dependencies Out of Sync

```powershell
# Clean install
rm -rf node_modules
rm package-lock.json
npm install
```

### Build Errors

```powershell
# Clean build
rm -rf dist
npm run build
```

## Useful Commands

```powershell
# Check all files status
git status

# View recent commits
git log --oneline -10

# Undo last commit (keep changes)
git reset HEAD~1

# Stash changes
git stash
git stash pop

# Update from main
git fetch origin
git rebase origin/main
```

## Next Steps

- Read the main [README.md](README.md) for full documentation
- Check [COMPLETE-STACK-SETUP.md](COMPLETE-STACK-SETUP.md) for deployment guide
- Review code in `src/` to understand structure
