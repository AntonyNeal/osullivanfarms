# Deployment Guide - Service Booking Platform Template

This guide provides platform-agnostic deployment instructions for the Service Booking Platform template.

## 🚀 Quick Deployment Options

### 1. DigitalOcean App Platform (Recommended)
**Best for**: Full-stack applications with database needs

**Pros**: Managed database, auto-scaling, simple configuration
**Cons**: Vendor lock-in, limited to DigitalOcean regions

```bash
# 1. Copy deployment template
cp deployment/app-spec-digitalocean.yaml app-spec.yaml

# 2. Customize configuration
# - Replace 'yourdomain.com' with your domain
# - Update GitHub repository references
# - Configure environment variables

# 3. Deploy via DigitalOcean CLI
doctl apps create app-spec.yaml

# 4. Configure domain and SSL (automatic)
```

### 2. Vercel (Great for Frontend + Serverless)
**Best for**: Frontend-heavy applications with serverless functions

**Pros**: Excellent performance, automatic deployments, global CDN
**Cons**: Limited backend capabilities, pricing for high traffic

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Copy configuration
cp deployment/vercel-template.json vercel.json

# 3. Configure environment variables in Vercel dashboard
# 4. Deploy
vercel --prod
```

### 3. Netlify (Simple Static + Functions)
**Best for**: Static sites with light backend requirements

**Pros**: Free tier, excellent CI/CD, simple deployment
**Cons**: Limited database options, function limitations

```bash
# 1. Copy configuration
cp deployment/netlify-template.toml netlify.toml

# 2. Connect GitHub repository in Netlify dashboard
# 3. Configure environment variables
# 4. Deploy automatically on push
```

### 4. AWS (Maximum Control)
**Best for**: Enterprise applications with complex requirements

**Pros**: Full control, extensive services, global reach
**Cons**: Complex setup, higher cost for small apps

```bash
# Use provided CloudFormation or CDK templates
# See deployment/aws/ directory for detailed instructions
```

### 5. Docker (Universal)
**Best for**: Self-hosted or any container platform

**Pros**: Platform agnostic, consistent environments
**Cons**: Requires container orchestration knowledge

```bash
# 1. Build Docker image
docker build -t service-booking-platform .

# 2. Run locally
docker-compose up

# 3. Deploy to any container platform
```

## 🔧 Configuration Steps

### 1. Environment Variables Setup

Create your environment configuration based on `.env.example`:

```bash
# Copy example file
cp .env.example .env

# Edit with your specific values
nano .env
```

**Required Variables:**
- `DATABASE_URL`: Your database connection string
- `SENDGRID_API_KEY`: Email service API key
- `VITE_API_BASE_URL`: Your domain URL
- `JWT_SECRET`: Authentication secret (generate with `openssl rand -base64 32`)

### 2. Database Setup

**PostgreSQL (Recommended)**
```sql
-- Create database
CREATE DATABASE service_booking_platform;

-- Run migrations (if using Prisma/similar)
npm run db:migrate
```

**Alternative Databases:**
- MySQL/MariaDB: Update connection string format
- SQLite: Good for development/small deployments
- MongoDB: Requires schema adjustments

### 3. Domain and DNS Configuration

**Custom Domain Setup:**
1. Point your domain to deployment platform
2. Configure SSL certificate (usually automatic)
3. Update CORS origins in environment variables

**Subdomain Strategy:**
- `yourdomain.com` - Main platform
- `api.yourdomain.com` - API endpoints
- `admin.yourdomain.com` - Admin panel

### 4. Email Service Configuration

**SendGrid Setup:**
1. Create SendGrid account
2. Verify sender email
3. Generate API key
4. Configure templates (optional)

**Alternative Providers:**
- Mailgun: Update email service implementation
- Amazon SES: AWS integration
- Postmark: Transaction email specialist

### 5. Payment Gateway Integration

**Stripe (International)**
```javascript
// Configure in your environment
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

**Regional Alternatives:**
- Australia: Eway, Tyro
- Europe: Mollie, Adyen
- Asia: Razorpay, PayU

## 📊 Analytics and Monitoring

### Google Analytics 4
```javascript
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Error Monitoring
- Sentry: Error tracking and performance monitoring
- LogRocket: Session replay and debugging
- DataDog: Full-stack monitoring

### Uptime Monitoring
- Pingdom: Website uptime monitoring
- StatusCake: Free uptime monitoring
- UptimeRobot: Simple uptime checks

## 🔒 Security Considerations

### SSL/TLS
- Enable HTTPS everywhere
- Use HTTP Strict Transport Security (HSTS)
- Configure proper CORS policies

### API Security
- Rate limiting implementation
- JWT token expiration
- Input validation and sanitization

### Database Security
- Use connection pooling
- Enable SSL for database connections
- Regular backups and encryption

## 🚀 Performance Optimization

### Frontend
- Enable gzip compression
- Configure CDN for static assets
- Implement caching headers

### Backend
- Database connection pooling
- Redis for session storage
- Implement API response caching

### Monitoring
- Set up performance alerts
- Monitor database query performance
- Track Core Web Vitals

## 📖 Platform-Specific Guides

Detailed platform-specific instructions:

- [DigitalOcean Deployment](./digitalocean.md)
- [Vercel Deployment](./vercel.md)
- [Netlify Deployment](./netlify.md)
- [AWS Deployment](./aws.md)
- [Docker Deployment](./docker.md)

## 🆘 Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version compatibility
- Verify environment variables are set
- Review build logs for specific errors

**Database Connection:**
- Verify connection string format
- Check firewall and security group settings
- Ensure database server is running

**CORS Errors:**
- Update ALLOWED_ORIGIN environment variable
- Check API endpoint URLs
- Verify domain configuration

### Getting Help

1. Check the [troubleshooting guide](../troubleshooting.md)
2. Review platform-specific documentation
3. Open an issue on GitHub
4. Join our Discord community

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Database read replicas
- CDN for global distribution

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching strategies

### Cost Optimization
- Right-size your infrastructure
- Use auto-scaling features
- Monitor and optimize resource usage

---

**Need Help?** Check our [community support channels](../support.md) or [open an issue](https://github.com/your-repo/issues) for deployment assistance.