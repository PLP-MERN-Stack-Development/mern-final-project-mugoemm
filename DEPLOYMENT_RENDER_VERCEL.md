# Deployment Guide: Render + Vercel

This guide will help you deploy your e-commerce platform with the backend on Render and frontend on Vercel.

---

## Prerequisites

- [GitHub](https://github.com) account
- [Render](https://render.com) account (free tier available)
- [Vercel](https://vercel.com) account (free tier available)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database (free tier available)
- Git installed locally

---

## Part 1: Prepare Your Repository

### 1. Initialize Git Repository

```bash
cd "d:\plp-africa\week 8 assignment"
git init
git add .
git commit -m "Initial commit: E-commerce platform"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `ecommerce-platform`)
3. **Do not** initialize with README, .gitignore, or license
4. Push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-platform.git
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy Backend to Render

### Step 1: Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository: `ecommerce-platform`

### Step 2: Configure Service

**Basic Settings:**
- **Name:** `ecommerce-backend` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Select **Free** (or paid for production)

### Step 3: Environment Variables

Add these environment variables in Render dashboard:

```bash
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_string_min_32_chars
JWT_EXPIRES_IN=7d
COOKIE_SECRET=your_secure_random_string_min_32_chars
FRONTEND_URL=https://your-app.vercel.app

# Email Configuration (Choose one provider)
# Option 1: Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=your-email@gmail.com

# Option 2: SendGrid
# EMAIL_HOST=smtp.sendgrid.net
# EMAIL_PORT=587
# EMAIL_USER=apikey
# EMAIL_PASS=your-sendgrid-api-key
# EMAIL_FROM=noreply@yourdomain.com
```

### Step 4: Generate Secrets

Generate secure secrets using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this twice to get `JWT_SECRET` and `COOKIE_SECRET`.

### Step 5: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get connection string:
   - Click **"Connect"** → **"Connect your application"**
   - Copy connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `ecommerce`)

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

5. **Important:** Whitelist Render's IP addresses:
   - In Atlas, go to **Network Access**
   - Click **"Add IP Address"**
   - Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add Render's specific IPs

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your backend will be available at: `https://ecommerce-backend.onrender.com`

### Step 7: Test Backend

```bash
# Test health endpoint
curl https://ecommerce-backend.onrender.com/health

# Expected response:
# {"status":"healthy","uptime":123.45,"timestamp":"2025-11-17T..."}
```

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration

### Step 3: Configure Project

**Framework Preset:** Vite
**Root Directory:** `frontend`
**Build Command:** `npm run build` (auto-detected)
**Output Directory:** `dist` (auto-detected)
**Install Command:** `npm install` (auto-detected)

### Step 4: Environment Variables

Add in Vercel project settings:

```bash
VITE_API_URL=https://ecommerce-backend.onrender.com/api
```

**Important:** Update this with your actual Render backend URL!

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build (2-5 minutes)
3. Your frontend will be available at: `https://your-app.vercel.app`

### Step 6: Update Backend CORS

1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Render will automatically redeploy

---

## Part 4: Post-Deployment Configuration

### 1. Update Frontend Environment Variable

If you didn't have the Render URL initially:

1. Go to Vercel project settings
2. Navigate to **Environment Variables**
3. Update `VITE_API_URL` with your Render backend URL
4. Trigger a new deployment

### 2. Configure Custom Domain (Optional)

#### For Vercel (Frontend):
1. Go to project settings → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

#### For Render (Backend):
1. Go to service settings → **Custom Domains**
2. Add your custom domain (e.g., `api.yourdomain.com`)
3. Update DNS records as instructed
4. Update `VITE_API_URL` in Vercel to use custom domain

### 3. Set Up Email Service

#### Gmail Setup:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account → Security
   - App Passwords → Select "Mail" and "Other"
   - Copy the generated password
   - Use this as `EMAIL_PASS` in Render

#### SendGrid Setup:
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key
3. Verify a sender email address
4. Use API key as `EMAIL_PASS` in Render

---

## Part 5: Testing Your Deployment

### Test Checklist

- [ ] Backend health check: `https://your-backend.onrender.com/health`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] User registration works
- [ ] Email verification sends (check spam folder)
- [ ] User login works
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Admin panel accessible (for admin users)
- [ ] Product CRUD operations (admin)
- [ ] Order creation works

### API Testing with cURL

```bash
# Register user
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Get products
curl https://your-backend.onrender.com/api/products
```

---

## Part 6: Monitoring & Maintenance

### Render Monitoring

1. **Logs:** View in Render dashboard → Logs tab
2. **Metrics:** CPU, Memory, and Request metrics available
3. **Alerts:** Set up in Settings → Notifications

### Vercel Monitoring

1. **Analytics:** Built-in Web Analytics
2. **Logs:** View deployment and function logs
3. **Insights:** Performance metrics available

### Database Monitoring

1. Go to MongoDB Atlas dashboard
2. Monitor:
   - Database size
   - Network traffic
   - Slow queries
   - Connection count

---

## Part 7: Continuous Deployment

### Automatic Deployments

Both Render and Vercel support automatic deployments:

1. **Push to GitHub:** Any push to `main` branch triggers deployment
2. **Pull Request Previews:** Vercel creates preview deployments for PRs
3. **Rollbacks:** Both platforms support instant rollbacks

### Deployment Workflow

```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main

# Render and Vercel will automatically deploy
```

---

## Part 8: Troubleshooting

### Common Issues

#### Backend Issues

**Problem:** "Application failed to respond"
- **Solution:** Check Render logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set

**Problem:** CORS errors
- **Solution:** Update `FRONTEND_URL` in Render
- Check `backend/middleware/security.js` CORS configuration

**Problem:** Email not sending
- **Solution:** Verify email credentials
- Check spam folder
- Test email service separately

#### Frontend Issues

**Problem:** API calls fail
- **Solution:** Verify `VITE_API_URL` is correct
- Check backend is running
- Inspect browser console for errors

**Problem:** Build fails
- **Solution:** Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**Problem:** Environment variables not working
- **Solution:** Variables must start with `VITE_`
- Redeploy after adding variables
- Clear browser cache

### Render Free Tier Limitations

- **Spin Down:** Free services sleep after 15 minutes of inactivity
- **First Request:** May take 30-60 seconds to wake up
- **Upgrade:** Consider paid tier for production (no spin down)

**Workaround for spin down:**
```javascript
// Add to your frontend to keep backend alive
setInterval(() => {
  fetch('https://your-backend.onrender.com/health');
}, 14 * 60 * 1000); // Every 14 minutes
```

---

## Part 9: Production Optimizations

### Backend Optimizations

1. **Enable Compression:** Already configured in `middleware/security.js`
2. **Database Indexing:**
   ```javascript
   // Add indexes in your models
   userSchema.index({ email: 1 });
   productSchema.index({ category: 1, price: 1 });
   ```

3. **Caching:** Consider Redis for session storage (paid tiers)

### Frontend Optimizations

1. **Code Splitting:** Already configured in `vite.config.js`
2. **Image Optimization:** Use WebP format
3. **Lazy Loading:** Implement for routes

### Security Hardening

1. **Rate Limiting:** Already configured
2. **Input Validation:** Already implemented
3. **SSL/TLS:** Automatic on both platforms
4. **Environment Secrets:** Never commit `.env` files

---

## Part 10: Backup & Recovery

### Database Backups

MongoDB Atlas (Free Tier):
- Automatic backups not included in free tier
- Manual export:
  ```bash
  mongodump --uri="your_connection_string" --out=/backup/folder
  ```

### Code Backups

- Git repository serves as code backup
- Tag releases:
  ```bash
  git tag -a v1.0.0 -m "Version 1.0.0"
  git push origin v1.0.0
  ```

---

## Part 11: Scaling Considerations

### When to Upgrade

**Render:**
- Consistent traffic (no spin down needed)
- Need for guaranteed uptime
- More than 750 hours/month usage

**Vercel:**
- High traffic volumes
- Need for commercial usage
- Team collaboration features

**MongoDB Atlas:**
- Database size > 512MB
- Need for better performance
- Backup and point-in-time recovery

---

## Part 12: Cost Estimates

### Free Tier Limits

**Render Free:**
- 750 hours/month (1 service running 24/7)
- Spins down after 15 min inactivity
- $0/month

**Vercel Free:**
- Unlimited deployments
- 100GB bandwidth/month
- $0/month

**MongoDB Atlas Free:**
- 512MB storage
- Shared CPU
- $0/month

### Paid Tiers (Starting Prices)

- **Render:** $7/month (Starter plan, no spin down)
- **Vercel:** $20/month (Pro plan)
- **MongoDB Atlas:** $9/month (M2 cluster)

---

## Quick Reference Commands

```bash
# Backend deployment (Render handles automatically)
cd backend
npm install
npm start

# Frontend build locally
cd frontend
npm install
npm run build

# Test production build locally
npm run preview

# View Render logs
# Use Render dashboard → Logs tab

# View Vercel logs
vercel logs [deployment-url]

# Force redeploy
# Push any commit to trigger redeployment
git commit --allow-empty -m "Trigger redeployment"
git push origin main
```

---

## Support Resources

- **Render Documentation:** https://render.com/docs
- **Vercel Documentation:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Vite Documentation:** https://vitejs.dev/guide

---

## Security Reminders

✅ Never commit `.env` files
✅ Use strong, unique secrets for JWT and cookies
✅ Keep dependencies updated
✅ Monitor logs for suspicious activity
✅ Set up alerts for errors
✅ Regular security audits: `npm audit`
✅ Use HTTPS only in production
✅ Implement rate limiting (already done)
✅ Validate all user inputs (already done)
✅ Keep MongoDB network access restricted

---

## Congratulations! 🎉

Your e-commerce platform is now deployed and accessible worldwide!

- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.onrender.com
- **Admin Panel:** https://your-app.vercel.app/admin

Remember to test thoroughly and monitor your application regularly.
