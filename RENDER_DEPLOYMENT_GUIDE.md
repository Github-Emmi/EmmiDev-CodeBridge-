# 🚀 EmmiDev CodeBridge - Render Deployment Guide

Complete guide to deploying the EmmiDev CodeBridge backend to Render.com

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Testing Your Deployment](#testing-your-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Production Optimizations](#production-optimizations)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account with your code pushed to a repository
- ✅ Render.com account (free tier available)
- ✅ MongoDB Atlas account (or other MongoDB hosting)
- ✅ All third-party API keys ready (GitHub OAuth, LinkedIn, Cloudinary, etc.)

---

## Pre-Deployment Checklist

### 1. **Verify Dependencies**

Check that `package.json` has all required dependencies:
```bash
cd backend
npm install
npm start  # Test locally first
```

### 2. **Update Production Settings**

The following files have been optimized for production:

✅ **server.js**
- CORS configured for multiple frontend URLs
- Session cookies configured for production (secure, httpOnly, sameSite)
- Server listens on `0.0.0.0` for Render compatibility
- Request size limits added (10mb)
- Enhanced Socket.io configuration

✅ **package.json**
- Added Node.js version requirements (>=18.x)
- Added npm version requirements (>=9.x)
- Build script for Render
- Seed script for database initialization

✅ **render.yaml**
- Infrastructure as Code configuration
- Environment variables template
- Health check endpoint configured

### 3. **Sensitive Data Review**

⚠️ **IMPORTANT**: Remove sensitive data from `.env` file before committing!

The `.gitignore` file already excludes `.env`, but double-check:
```bash
cat .gitignore | grep .env
```

---

## Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
# In the project root directory
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to https://render.com/
2. Sign up or log in
3. Click **"New +"** → **"Web Service"**

### Step 3: Connect Repository

1. Click **"Connect account"** to link your GitHub
2. Select your repository: `EmmiDev-CodeBridge-`
3. Grant Render access to the repository

### Step 4: Configure Service

**Basic Settings:**
```
Name: emmidev-codebridge-api
Region: Oregon (or closest to your users)
Branch: main
Root Directory: backend
Runtime: Node
```

**Build & Deploy:**
```
Build Command: npm install
Start Command: npm start
```

**Instance Type:**
```
Free (for testing) or Starter ($7/month for production)
```

### Step 5: Advanced Settings

Click **"Advanced"** and configure:

**Health Check Path:**
```
/health
```

**Auto-Deploy:**
```
✅ Enable (deploys automatically on git push)
```

---

## Environment Variables Setup

### Required Variables

In Render dashboard, go to **"Environment"** tab and add these variables:

#### Core Configuration

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Sets production mode |
| `PORT` | `10000` | Render's default port |

#### Database

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster...` | Your MongoDB Atlas connection string |

**MongoDB Atlas Setup:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Add database user
4. Whitelist Render's IP: `0.0.0.0/0` (all IPs) in Network Access
5. Get connection string from "Connect" → "Connect your application"

#### Security

| Key | Value | Notes |
|-----|-------|-------|
| `JWT_SECRET` | Click "Generate" | Auto-generate secure value |
| `SESSION_SECRET` | Click "Generate" | Auto-generate secure value |
| `JWT_EXPIRE` | `30d` | Token expiration time |

#### Frontend Configuration

| Key | Value | Notes |
|-----|-------|-------|
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Your deployed frontend URL |

⚠️ If you have multiple frontend URLs (staging + production), separate with commas:
```
https://your-frontend.vercel.app,https://staging.vercel.app
```

#### OAuth - GitHub

| Key | Value | Notes |
|-----|-------|-------|
| `GITHUB_CLIENT_ID` | Your GitHub OAuth App Client ID | From GitHub Settings |
| `GITHUB_CLIENT_SECRET` | Your GitHub OAuth App Secret | From GitHub Settings |
| `GITHUB_CALLBACK_URL` | `https://your-api.onrender.com/api/auth/github/callback` | Update after deployment |

**GitHub OAuth App Configuration:**
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set Homepage URL: `https://your-frontend.vercel.app`
4. Set Authorization callback: `https://your-api.onrender.com/api/auth/github/callback`

#### OAuth - LinkedIn

| Key | Value | Notes |
|-----|-------|-------|
| `LINKEDIN_CLIENT_ID` | Your LinkedIn App Client ID | From LinkedIn Developers |
| `LINKEDIN_CLIENT_SECRET` | Your LinkedIn App Secret | From LinkedIn Developers |
| `LINKEDIN_CALLBACK_URL` | `https://your-api.onrender.com/api/auth/linkedin/callback` | Update after deployment |

**LinkedIn OAuth App Configuration:**
1. Go to https://www.linkedin.com/developers/apps
2. Update redirect URLs to include Render URL

#### Optional Services

##### Cloudinary (File Uploads)
| Key | Value |
|-----|-------|
| `CLOUDINARY_CLOUD_NAME` | Your cloud name |
| `CLOUDINARY_API_KEY` | Your API key |
| `CLOUDINARY_API_SECRET` | Your API secret |

##### OpenAI (AI Features)
| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |

##### Paystack (Nigerian Payments)
| Key | Value |
|-----|-------|
| `PAYSTACK_SECRET_KEY` | Your Paystack secret key |
| `PAYSTACK_PUBLIC_KEY` | Your Paystack public key |

##### Email (NodeMailer)
| Key | Value |
|-----|-------|
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | Your email address |
| `EMAIL_PASSWORD` | App-specific password |
| `EMAIL_FROM` | `EmmiDev CodeBridge <noreply@emmidevcode.com>` |

---

## Post-Deployment Configuration

### 1. Get Your API URL

After deployment, Render will give you a URL like:
```
https://emmidev-codebridge-api.onrender.com
```

### 2. Update OAuth Callback URLs

**GitHub:**
1. Go to GitHub OAuth App settings
2. Update Authorization callback URL:
   ```
   https://emmidev-codebridge-api.onrender.com/api/auth/github/callback
   ```

**LinkedIn:**
1. Go to LinkedIn App settings
2. Update Redirect URLs:
   ```
   https://emmidev-codebridge-api.onrender.com/api/auth/linkedin/callback
   ```

### 3. Update Environment Variables in Render

Go back to Render Environment tab and update:
- `GITHUB_CALLBACK_URL`
- `LINKEDIN_CALLBACK_URL`

Then click **"Save Changes"** (will redeploy automatically)

### 4. Update Frontend Configuration

In your frontend `.env` file:
```
VITE_API_URL=https://emmidev-codebridge-api.onrender.com/api
```

---

## Testing Your Deployment

### 1. Health Check

Visit:
```
https://your-api.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "EmmiDev-CodeBridge API is running",
  "timestamp": "2025-11-17T..."
}
```

### 2. API Root

Visit:
```
https://your-api.onrender.com/
```

Should see API documentation with all endpoints listed.

### 3. Test Authentication

Try logging in from your frontend:
- Email/password login
- GitHub OAuth
- LinkedIn OAuth

### 4. Check Logs

In Render dashboard:
1. Go to your service
2. Click **"Logs"** tab
3. Look for:
   ```
   ✅ MongoDB Connected: cluster...
   🚀 Server running in production mode on port 10000
   ```

---

## Troubleshooting

### Common Issues

#### Issue 1: "Cannot connect to MongoDB"

**Problem:** MongoDB connection string incorrect or IP not whitelisted

**Solution:**
1. Check `MONGODB_URI` in environment variables
2. In MongoDB Atlas, go to Network Access
3. Add IP: `0.0.0.0/0` to allow all IPs
4. Restart Render service

#### Issue 2: "CORS Error"

**Problem:** Frontend URL not configured correctly

**Solution:**
1. Check `FRONTEND_URL` environment variable
2. Ensure it matches your deployed frontend exactly
3. No trailing slashes
4. For multiple URLs, use comma separation

#### Issue 3: "OAuth Redirect Mismatch"

**Problem:** OAuth callback URLs don't match

**Solution:**
1. Check Render URL (e.g., `https://your-app.onrender.com`)
2. Update GitHub/LinkedIn OAuth apps with correct callback URLs
3. Update `GITHUB_CALLBACK_URL` and `LINKEDIN_CALLBACK_URL` in Render
4. Redeploy

#### Issue 4: "Session/Cookie Issues"

**Problem:** Sessions not persisting in production

**Solution:**
1. Ensure `SESSION_SECRET` is set
2. Check browser allows third-party cookies
3. Verify `secure: true` in cookie settings (requires HTTPS)
4. Check `sameSite` cookie attribute

#### Issue 5: "Build Failed"

**Problem:** npm install failed

**Solution:**
1. Check Render build logs
2. Verify `package.json` has correct dependencies
3. Ensure Node version compatibility
4. Try manual build locally: `npm install --production`

#### Issue 6: "Port Already in Use"

**Problem:** Render assigns port dynamically

**Solution:**
Server is already configured to use `process.env.PORT`, which Render sets automatically. No action needed.

### Checking Logs

```bash
# In Render dashboard
1. Go to your service
2. Click "Logs" tab
3. Use filters: Error, Warning, Info
4. Download logs for detailed analysis
```

---

## Production Optimizations

### 1. Database Indexing

Ensure MongoDB indexes are created. Run seed script once:

```bash
# In Render Shell (Dashboard → Shell tab)
npm run seed
```

Or connect to deployed API and run:
```
POST https://your-api.onrender.com/api/admin/initialize-db
```

### 2. Rate Limiting

Already configured in `middleware/rateLimiter.js`. Verify it's working:
```javascript
// Try making 100+ requests quickly
// Should see: 429 Too Many Requests
```

### 3. Monitoring

**Set up monitoring:**
1. Render provides basic metrics (CPU, Memory, Response Time)
2. Consider external monitoring:
   - UptimeRobot (free)
   - Better Uptime
   - StatusCake

### 4. Custom Domain (Optional)

Add custom domain:
1. In Render dashboard, go to Settings
2. Click "Custom Domains"
3. Add domain: `api.yourdomain.com`
4. Update DNS records as instructed
5. SSL certificate auto-provisioned

### 5. Enable Auto-Deploy

Render already configured for auto-deploy. Each git push to `main` branch triggers deployment.

To disable:
```
Settings → Auto-Deploy → Toggle OFF
```

### 6. Scaling

**Free Tier:**
- Limited to 750 hours/month
- Sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds

**Paid Plans:**
- Starter ($7/month): Always on, 512MB RAM
- Standard ($25/month): 2GB RAM
- Pro ($85/month): 4GB RAM

---

## Database Seeding (Optional)

To populate database with sample data:

### Option 1: Via Render Shell

1. In Render dashboard, click **"Shell"** tab
2. Run:
   ```bash
   npm run seed
   ```

### Option 2: Via API Endpoint

Create an admin endpoint for initialization (secure it!):

```javascript
// routes/adminRoutes.js
router.post('/initialize-db', protect, adminOnly, async (req, res) => {
  // Run seed logic
});
```

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check error logs
- Monitor response times
- Review MongoDB Atlas metrics

**Monthly:**
- Update dependencies: `npm outdated`
- Review and rotate API keys
- Check disk usage

**Security:**
- Rotate JWT_SECRET every 6 months
- Review OAuth app permissions
- Update Node.js version when needed

---

## Backup Strategy

### Database Backups

MongoDB Atlas provides automatic backups on paid plans:
1. Go to MongoDB Atlas
2. Clusters → Your Cluster → Backup
3. Enable Cloud Backups

### Manual Backup

```bash
# Export database
mongodump --uri="your-mongodb-uri"

# Restore
mongorestore --uri="your-mongodb-uri" dump/
```

---

## Environment-Specific URLs

### Development
```
Backend: http://localhost:5000
Frontend: http://localhost:5173
```

### Production
```
Backend: https://emmidev-codebridge-api.onrender.com
Frontend: https://your-frontend-url.vercel.app
```

---

## Cost Estimate

### Free Tier
- Render Free Plan: $0/month
- MongoDB Atlas Free (M0): $0/month
- **Total: $0/month**
- ⚠️ Limitations: App sleeps after inactivity

### Production (Recommended)
- Render Starter: $7/month
- MongoDB Atlas Shared (M2): $9/month
- **Total: $16/month**
- ✅ Always on, better performance

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **Render Community**: https://community.render.com/

---

## Deployment Checklist

Before going live:

- [ ] All environment variables set in Render
- [ ] MongoDB Atlas cluster created and accessible
- [ ] OAuth apps configured with production URLs
- [ ] Frontend deployed and `FRONTEND_URL` updated
- [ ] Health check endpoint responding
- [ ] Test all authentication methods
- [ ] Check logs for errors
- [ ] Set up monitoring
- [ ] Configure custom domain (optional)
- [ ] Test critical user flows
- [ ] Backup strategy in place

---

## Quick Deploy Commands

```bash
# 1. Commit latest changes
git add .
git commit -m "Production deployment"
git push origin main

# 2. Render auto-deploys (if enabled)
# Monitor at: https://dashboard.render.com

# 3. Test deployment
curl https://your-api.onrender.com/health

# 4. Check logs
# Via Render dashboard → Logs tab
```

---

**Deployment Status**: ✅ Ready for Production

**Last Updated**: November 17, 2025  
**Version**: 1.0.0

---

For issues or questions:
- Check Render logs first
- Review this guide's troubleshooting section
- Contact Render support: https://render.com/support
