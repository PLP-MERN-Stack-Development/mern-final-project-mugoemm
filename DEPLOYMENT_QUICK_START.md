# Quick Deployment Checklist

## Pre-Deployment

### 1. Push to GitHub
```bash
cd "d:\plp-africa\week 8 assignment"
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Backend (Render)

### 2. Create Web Service
1. Go to [render.com](https://dashboard.render.com/)
2. New + → Web Service
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build: `npm install`
6. Start: `npm start`

### 3. Environment Variables (Render)
```
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_EXPIRES_IN=7d
COOKIE_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
FRONTEND_URL=https://your-app.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

### 4. MongoDB Atlas
- Create free cluster
- Network Access → Allow 0.0.0.0/0
- Copy connection string

## Frontend (Vercel)

### 5. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com/dashboard)
2. New Project → Import from GitHub
3. Root Directory: `frontend`
4. Framework: Vite (auto-detected)

### 6. Environment Variable (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### 7. Update Backend CORS
- Go back to Render
- Update `FRONTEND_URL` with Vercel URL
- Redeploy

## Test Deployment

```bash
# Test backend
curl https://your-backend.onrender.com/health

# Test frontend
Visit: https://your-app.vercel.app
```

## Done! 🚀

Your app is live at:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.onrender.com
- **Admin:** https://your-app.vercel.app/admin

**Note:** Render free tier spins down after 15 minutes of inactivity. First request may take 30-60 seconds.

---

For detailed instructions, see [DEPLOYMENT_RENDER_VERCEL.md](./DEPLOYMENT_RENDER_VERCEL.md)
