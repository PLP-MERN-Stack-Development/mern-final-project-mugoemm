# Vercel Deployment Instructions

## Your Backend URL (Update this):
https://your-backend-name.onrender.com

## Steps to Deploy Frontend:

1. **Delete your existing Vercel project** (if you have one)
   - Go to vercel.com → Your project → Settings → Delete Project

2. **Create New Project:**
   - Click "Add New..." → "Project"
   - Import: `mern-final-project-mugoemm`
   
3. **Configure Build Settings:**
   - Framework Preset: **Vite**
   - Root Directory: **frontend** ← IMPORTANT! Click Edit and type "frontend"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variable:**
   - Click "Environment Variables"
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-name.onrender.com/api` ← Use your actual Render URL
   - Select all environments (Production, Preview, Development)
   - Click "Add"

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes

## After Deployment:

Copy your Vercel URL and update Render:
1. Go to Render → Your backend service → Environment
2. Update `FRONTEND_URL` to your Vercel URL
3. Save (auto-redeploys)

Done!
