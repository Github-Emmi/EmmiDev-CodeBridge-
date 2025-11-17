# 🚀 EmmiDev CodeBridge Frontend - Vercel Deployment Guide

Complete step-by-step guide to deploy the EmmiDev CodeBridge frontend to Vercel.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Deployment Methods](#deployment-methods)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Custom Domain Configuration](#custom-domain-configuration)
6. [Post-Deployment Steps](#post-deployment-steps)
7. [Troubleshooting](#troubleshooting)
8. [Performance Optimization](#performance-optimization)

---

## ✅ Prerequisites

Before deploying to Vercel, ensure you have:

- ✅ **GitHub Account** with repository access
- ✅ **Vercel Account** (Sign up at https://vercel.com)
- ✅ **Backend Deployed** on Render (https://emmidev-codebridge.onrender.com)
- ✅ **Node.js v18+** installed locally (for testing)
- ✅ **Git** installed and configured

---

## 🔍 Pre-Deployment Checklist

### 1. Verify Backend Connectivity

Test your backend API is live:

```bash
curl https://emmidev-codebridge.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "environment": "production"
}
```

### 2. Test Local Production Build

From the `frontend` directory:

```bash
# Install dependencies
npm install

# Create production build
npm run build

# Test production build locally
npm run preview
```

Visit http://localhost:4173 and verify:
- ✅ All pages load correctly
- ✅ API calls work (login, courses, etc.)
- ✅ Socket.io connects properly
- ✅ Images and assets load
- ✅ Dark mode works
- ✅ Routing works (try navigating to different pages)

### 3. Verify Configuration Files

Ensure these files are present in `frontend/` directory:

- ✅ `vercel.json` - Vercel configuration
- ✅ `.env.production` - Production environment variables
- ✅ `vite.config.js` - Build optimization
- ✅ `package.json` - Dependencies and scripts

---

## 🌐 Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended for First Time)

#### Step 1: Connect GitHub Repository

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select **"EmmiDev-CodeBridge-"** repository
5. Click **"Import"**

#### Step 2: Configure Project Settings

On the **"Configure Project"** screen:

**Project Name:**
```
emmidev-codebridge
```

**Framework Preset:**
```
Vite
```

**Root Directory:**
```
frontend
```
*Important: Click "Edit" and set this to `frontend` since your frontend is in a subdirectory*

**Build & Output Settings:**
- Build Command: `npm run build` (auto-detected)
- Output Directory: `dist` (auto-detected)
- Install Command: `npm install` (auto-detected)

#### Step 3: Add Environment Variables

Click **"Environment Variables"** section and add these:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `https://emmidev-codebridge.onrender.com/api` | Production |
| `VITE_SOCKET_URL` | `https://emmidev-codebridge.onrender.com` | Production |
| `VITE_PAYSTACK_PUBLIC_KEY` | `pk_test_your_key_here` | Production (Optional) |

**How to add:**
1. Enter variable name in "Key" field
2. Enter value in "Value" field
3. Select "Production" environment
4. Click "Add"
5. Repeat for all variables

#### Step 4: Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. Vercel will show build logs in real-time

#### Step 5: Get Your Deployment URL

After successful deployment:

Your frontend will be live at:
```
https://emmidev-codebridge.vercel.app
```

Or a similar URL like:
```
https://emmidev-codebridge-<unique-hash>.vercel.app
```

---

### Method 2: Deploy via Vercel CLI (Alternative)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

#### Step 3: Navigate to Frontend Directory

```bash
cd frontend
```

#### Step 4: Deploy to Production

```bash
vercel --prod
```

The CLI will ask:

**Q: Set up and deploy "~/Desktop/Projects/emmidev-codebridge/frontend"?**
```
Yes
```

**Q: Which scope do you want to deploy to?**
```
Select your username/organization
```

**Q: Link to existing project?**
```
No (for first deployment)
```

**Q: What's your project's name?**
```
emmidev-codebridge
```

**Q: In which directory is your code located?**
```
./ (current directory)
```

**Q: Want to override the settings?**
```
No
```

#### Step 5: Add Environment Variables via CLI

```bash
vercel env add VITE_API_URL production
# Enter: https://emmidev-codebridge.onrender.com/api

vercel env add VITE_SOCKET_URL production
# Enter: https://emmidev-codebridge.onrender.com

vercel env add VITE_PAYSTACK_PUBLIC_KEY production
# Enter: pk_test_your_key_here
```

#### Step 6: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## 🔐 Environment Variables Setup

### Required Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_API_URL` | Backend API endpoint | `https://emmidev-codebridge.onrender.com/api` |
| `VITE_SOCKET_URL` | Socket.io server URL | `https://emmidev-codebridge.onrender.com` |

### Optional Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack payment integration | `pk_test_...` or `pk_live_...` |

### How Variables Are Used

**In the codebase:**

```javascript
// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// src/services/socket.js
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
```

**Fallback behavior:**
- Development: Uses `localhost:5000` if not set
- Production: **MUST** have environment variables set in Vercel

---

## 🌍 Custom Domain Configuration

### Option 1: Use Vercel Subdomain (Free)

Your app is automatically available at:
```
https://emmidev-codebridge.vercel.app
```

### Option 2: Add Custom Domain

#### Step 1: Go to Project Settings

1. Go to Vercel Dashboard
2. Select your project: **emmidev-codebridge**
3. Click **Settings** → **Domains**

#### Step 2: Add Domain

Enter your domain (examples):
- `app.emmidevcode.com`
- `codebridge.emmidevcode.com`
- `emmidevcode.com`

#### Step 3: Configure DNS

Vercel will provide DNS records. Add these to your domain registrar:

**For subdomain (app.emmidevcode.com):**
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

**For root domain (emmidevcode.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

#### Step 4: Wait for DNS Propagation

- Propagation takes 5 minutes to 48 hours
- Vercel auto-provisions SSL certificate
- Your site will be available at your custom domain with HTTPS

---

## 🔄 Post-Deployment Steps

### 1. Update Backend FRONTEND_URL

After deployment, update your Render backend environment:

1. Go to Render Dashboard
2. Select **emmidev-codebridge** service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` to your Vercel URL:

```bash
FRONTEND_URL=https://emmidev-codebridge.vercel.app
```

Or your custom domain:
```bash
FRONTEND_URL=https://app.emmidevcode.com
```

4. Click **Save Changes**
5. Render will auto-deploy with new URL

### 2. Update GitHub OAuth Callback

The backend GitHub OAuth redirect will now send users to your Vercel frontend:

**Verify the callback flow:**
1. Backend GitHub callback: `https://emmidev-codebridge.onrender.com/api/auth/github/callback`
2. Backend redirects to: `${FRONTEND_URL}/auth/callback?token=...`
3. Frontend receives token and logs user in

**No changes needed** - this should work automatically after updating `FRONTEND_URL`.

### 3. Test Complete Authentication Flow

1. Visit your Vercel URL: `https://emmidev-codebridge.vercel.app`
2. Click **"Login with GitHub"**
3. Authorize the app
4. Verify you're redirected back and logged in
5. Check browser console for errors

### 4. Verify Socket.io Connection

1. Login to your app
2. Open browser DevTools → Console
3. Look for: `✅ Socket connected: <socket-id>`
4. If you see connection errors, verify `VITE_SOCKET_URL` is correct

### 5. Test Core Features

Go through these user flows:

**Student Dashboard:**
- ✅ View enrolled courses
- ✅ Access course materials
- ✅ Submit assignments
- ✅ Join Zoom classes
- ✅ Real-time chat works

**Tutor Dashboard:**
- ✅ Create new course
- ✅ Add Zoom sessions
- ✅ View student submissions
- ✅ Grade assignments
- ✅ Start Zoom classes

**Community:**
- ✅ Create posts
- ✅ Comment on posts
- ✅ Real-time updates work

---

## 🐛 Troubleshooting

### Issue 1: 404 on Page Refresh

**Problem:** Refreshing `/dashboard` or other routes shows 404

**Solution:** Ensure `vercel.json` has rewrites:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This is already configured in your project ✅

---

### Issue 2: Environment Variables Not Working

**Problem:** API calls fail with CORS errors or wrong URL

**Diagnostic Steps:**

1. Check Vercel dashboard → Project → Settings → Environment Variables
2. Verify variables are set for "Production" environment
3. Check build logs for variable values:

```bash
vercel logs <deployment-url> --follow
```

**Solution:**
1. Add/update environment variables in Vercel
2. Trigger new deployment:
   - Via Dashboard: Deployments → Click "..." → Redeploy
   - Via Git: Make a commit and push to trigger auto-deploy

---

### Issue 3: CORS Errors

**Problem:** Browser console shows CORS errors when calling API

**Error message:**
```
Access to XMLHttpRequest at 'https://emmidev-codebridge.onrender.com/api/...'
from origin 'https://emmidev-codebridge.vercel.app' has been blocked by CORS policy
```

**Solution:**

Your backend is already configured for CORS, but verify:

1. Check `FRONTEND_URL` in Render environment variables
2. Verify backend `server.js` has:
```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
];
```

3. Update `FRONTEND_URL` to match your Vercel URL exactly

---

### Issue 4: Socket.io Not Connecting

**Problem:** Real-time features don't work (chat, notifications)

**Diagnostic:**

Open DevTools → Console, look for:
```
Socket connection error: ...
```

**Solutions:**

1. Verify `VITE_SOCKET_URL` in Vercel environment:
   - Should be: `https://emmidev-codebridge.onrender.com`
   - NOT: `https://emmidev-codebridge.onrender.com/api`

2. Check backend Socket.io CORS configuration:
```javascript
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});
```

3. Ensure backend allows your Vercel URL in CORS origins

---

### Issue 5: Build Fails

**Problem:** Vercel build fails with errors

**Common causes:**

**A. Missing dependencies:**
```bash
# In frontend directory
npm install
```

**B. TypeScript/ESLint errors:**
- Check build logs for specific errors
- Fix locally first, then redeploy

**C. Out of memory:**
- Vercel free tier has memory limits
- Solution: Reduce bundle size (already optimized in vite.config.js)

**View build logs:**
1. Vercel Dashboard → Deployments
2. Click on failed deployment
3. View "Build Logs" tab

---

### Issue 6: Images/Assets Not Loading

**Problem:** Images return 404 errors

**Solution:**

Verify images are in `public/` folder:
```
frontend/
  public/
    vite.svg
    logo.png
    ...
```

Reference in code:
```jsx
<img src="/logo.png" alt="Logo" />
```

**NOT:**
```jsx
<img src="./logo.png" alt="Logo" />  ❌
<img src="public/logo.png" alt="Logo" />  ❌
```

---

### Issue 7: Slow Load Times

**Problem:** App takes long to load initially

**Solutions:**

1. **Already implemented:** Code splitting in `vite.config.js`
2. **Check bundle size:**
```bash
npm run build
```

Look for large chunks (>500KB)

3. **Lazy load routes:**
```javascript
// Instead of:
import Dashboard from './pages/Dashboard';

// Use:
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

4. **Enable Vercel Edge Network:**
   - Automatic with Vercel
   - CDN caching already configured in `vercel.json`

---

## ⚡ Performance Optimization

Your app is already optimized with:

### 1. Code Splitting ✅

```javascript
// vite.config.js
manualChunks: {
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
  'vendor-ui': ['framer-motion', 'lucide-react'],
}
```

**Result:** Smaller initial bundle, faster load

### 2. Asset Caching ✅

```json
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Result:** Browser caches assets for 1 year

### 3. SPA Routing ✅

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Result:** Fast client-side navigation

### Additional Optimizations

**A. Compress Images:**

Use tools like:
- TinyPNG (https://tinypng.com)
- ImageOptim
- Squoosh (https://squoosh.app)

**B. Enable Vercel Analytics:**

```bash
npm install @vercel/analytics
```

```javascript
// main.jsx
import { Analytics } from '@vercel/analytics/react';

<App />
<Analytics />
```

Already installed ✅ - just need to add to `main.jsx`

**C. Monitor Performance:**

- Vercel Dashboard → Analytics (free tier included)
- Lighthouse scores in Chrome DevTools
- Web Vitals tracking

---

## 📊 Deployment Checklist

Before going live, verify:

### Pre-Deployment
- [ ] Backend deployed and healthy on Render
- [ ] Local production build tested (`npm run build && npm run preview`)
- [ ] All environment variables documented
- [ ] `.gitignore` excludes `.env` files
- [ ] `vercel.json` configuration present

### During Deployment
- [ ] Repository connected to Vercel
- [ ] Root directory set to `frontend`
- [ ] All environment variables added to Vercel
- [ ] Build succeeds without errors
- [ ] Deployment URL accessible

### Post-Deployment
- [ ] `FRONTEND_URL` updated in Render backend
- [ ] GitHub OAuth flow tested
- [ ] Socket.io connection verified
- [ ] All major features tested
- [ ] Mobile responsiveness checked
- [ ] Browser console has no errors
- [ ] Custom domain configured (if applicable)

---

## 🎯 Quick Reference

### Vercel Dashboard URLs

- **Main Dashboard:** https://vercel.com/dashboard
- **Project Settings:** https://vercel.com/dashboard/projects/emmidev-codebridge/settings
- **Environment Variables:** https://vercel.com/dashboard/projects/emmidev-codebridge/settings/environment-variables
- **Deployments:** https://vercel.com/dashboard/projects/emmidev-codebridge/deployments
- **Domains:** https://vercel.com/dashboard/projects/emmidev-codebridge/settings/domains

### Common Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs <deployment-url> --follow

# List all deployments
vercel ls

# Add environment variable
vercel env add <NAME> production
```

### Environment Variables Reference

```bash
# Required
VITE_API_URL=https://emmidev-codebridge.onrender.com/api
VITE_SOCKET_URL=https://emmidev-codebridge.onrender.com

# Optional
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
```

### URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://emmidev-codebridge.vercel.app |
| Backend (Render) | https://emmidev-codebridge.onrender.com |
| API Endpoint | https://emmidev-codebridge.onrender.com/api |
| Socket.io | https://emmidev-codebridge.onrender.com |

---

## 🆘 Support

If you encounter issues:

1. **Check build logs** in Vercel dashboard
2. **Test locally** with `npm run build && npm run preview`
3. **Verify environment variables** are set correctly
4. **Check browser console** for JavaScript errors
5. **Review Vercel documentation:** https://vercel.com/docs

---

## 🎉 Success!

Your EmmiDev CodeBridge frontend is now live on Vercel! 

**Next Steps:**
1. Share your app with beta testers
2. Monitor analytics and performance
3. Set up custom domain
4. Configure production payment gateway (Paystack)
5. Enable monitoring and error tracking

**Your live app:**
```
https://emmidev-codebridge.vercel.app
```

Happy coding! 🚀✨
