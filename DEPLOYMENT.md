# E-Commerce Platform - Production Deployment Guide

## Pre-Deployment Checklist

### Backend

- [ ] Update `.env` with production values
- [ ] Change `JWT_SECRET` to a strong random string (min 32 characters)
- [ ] Change `COOKIE_SECRET` to a strong random string
- [ ] Update `MONGO_URI` with production MongoDB connection string
- [ ] Configure email service (Gmail/SendGrid/AWS SES)
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Enable HTTPS
- [ ] Configure CORS with specific frontend domain
- [ ] Review and adjust rate limits
- [ ] Set up database backups
- [ ] Configure logging to external service (CloudWatch, Papertrail)

### Frontend

- [ ] Update API URLs in production build
- [ ] Enable production mode
- [ ] Optimize images and assets
- [ ] Enable CDN for static assets
- [ ] Configure environment variables
- [ ] Test all user flows
- [ ] Run accessibility audit
- [ ] Test on multiple browsers and devices

## Deployment Steps

### Backend Deployment (Node.js)

#### Option 1: Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-secret"
# ... set all env vars

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

#### Option 2: AWS EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone your-repo-url
cd backend

# Install dependencies
npm install --production

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start server.js --name ecommerce-api

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Set up Nginx as reverse proxy
sudo apt-get install nginx
# Configure nginx (see nginx.conf below)
```

#### Option 3: Docker

```bash
# Build image
docker build -t ecommerce-backend .

# Run container
docker run -d -p 5000:5000 --env-file .env.production ecommerce-backend

# Or use docker-compose
docker-compose up -d
```

### Frontend Deployment

#### Option 1: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Option 2: Netlify

```bash
# Build
npm run build

# Deploy via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option 3: AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Nginx Configuration

Create `/etc/nginx/sites-available/ecommerce`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Configuration

### MongoDB Atlas (Recommended)

1. Create cluster at mongodb.com/cloud/atlas
2. Configure network access
3. Create database user
4. Get connection string
5. Enable automated backups

## Monitoring & Logging

### Sentry Integration

```bash
npm install @sentry/node @sentry/tracing
```

In `server.js`:
```javascript
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# Web dashboard
pm2 web
```

## Security Checklist

- [ ] Enable HTTPS everywhere
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)
- [ ] Implement rate limiting
- [ ] Enable CORS with specific origins
- [ ] Sanitize all user inputs
- [ ] Use parameterized queries
- [ ] Keep dependencies updated
- [ ] Implement CSP headers
- [ ] Regular security audits (`npm audit`)
- [ ] Use environment variables for secrets
- [ ] Implement request logging
- [ ] Set up DDoS protection (Cloudflare)

## Performance Optimization

- [ ] Enable compression
- [ ] Implement caching (Redis)
- [ ] Use CDN for static assets
- [ ] Optimize database queries (indexes)
- [ ] Enable HTTP/2
- [ ] Lazy load images
- [ ] Code splitting
- [ ] Minify assets

## Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test API endpoint
ab -n 1000 -c 100 https://your-api.com/api/products

# Or use k6
k6 run loadtest.js
```

## Backup Strategy

### Database Backups

```bash
# Automated backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGO_URI" --out="/backups/mongodb_$TIMESTAMP"

# Upload to S3
aws s3 cp /backups/mongodb_$TIMESTAMP s3://your-backup-bucket/
```

## SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
sudo certbot renew --dry-run  # Test renewal
```

## Health Checks

Implement health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if app is running: `pm2 list`
   - Check port: `netstat -tulpn | grep 5000`
   - Check firewall: `sudo ufw status`

2. **Database Connection Failed**
   - Verify MongoDB URI
   - Check network access in MongoDB Atlas
   - Verify credentials

3. **High Memory Usage**
   - Check for memory leaks
   - Increase instance size
   - Enable swapfile

## Maintenance

```bash
# Update dependencies
npm update

# Security audit
npm audit fix

# Check logs
pm2 logs

# Restart application
pm2 restart all

# Zero-downtime reload
pm2 reload all
```

## Support & Documentation

- Backend API Docs: /api-docs (if Swagger enabled)
- Frontend: deployed-url.com
- Backend: api-url.com
- Status Page: status.your-domain.com