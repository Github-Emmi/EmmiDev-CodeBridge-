# ⚡ Vercel Deployment - Quick Start (5 Minutes)

Lightning-fast deployment guide for EmmiDev CodeBridge frontend to Vercel.

---

## 🚀 Steps

### 1️⃣ Push to GitHub (if not already done)

```bash
cd /Users/emmidev/Desktop/Projects/emmidev-codebridge
git add .
git commit -m "Ready for Vercel deployment"
git push origin production
```

---

### 2️⃣ Deploy to Vercel

#### Option A: Via Dashboard (Recommended)

1. **Go to:** https://vercel.com/new
2. **Click:** "Import Git Repository"
3. **Select:** EmmiDev-CodeBridge- repository
4. **Configure:**
   - **Root Directory:** `frontend` ⚠️ Important!
   - **Framework:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. **Add Environment Variables:**
   ```
   VITE_API_URL = https://emmidev-codebridge.onrender.com/api
   VITE_SOCKET_URL = https://emmidev-codebridge.onrender.com
   VITE_PAYSTACK_PUBLIC_KEY = pk_test_your_key_here
   ```

6. **Click:** Deploy 🚀

#### Option B: Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod

# Follow prompts:
# - Project name: emmidev-codebridge
# - Set up and deploy: Yes
```

**Add environment variables:**
```bash
vercel env add VITE_API_URL production
# Enter: https://emmidev-codebridge.onrender.com/api

vercel env add VITE_SOCKET_URL production
# Enter: https://emmidev-codebridge.onrender.com

vercel env add VITE_PAYSTACK_PUBLIC_KEY production
# Enter: pk_test_your_key_here

# Redeploy with environment variables
vercel --prod
```

---

### 3️⃣ Update Backend

After deployment, get your Vercel URL (e.g., `https://emmidev-codebridge.vercel.app`)

**Update Render Backend:**
1. Go to https://dashboard.render.com
2. Select: **emmidev-codebridge** service
3. Go to: **Environment** tab
4. Update: `FRONTEND_URL=https://emmidev-codebridge.vercel.app`
5. Click: **Save Changes**

---

### 4️⃣ Test Your App

Visit your Vercel URL and test:

- ✅ **Login with GitHub** (OAuth flow)
- ✅ **Dashboard loads** (API connectivity)
- ✅ **Create a course** (CRUD operations)
- ✅ **Real-time chat** (Socket.io connection)
- ✅ **Join Zoom class** (Zoom integration)

Open browser console - should see:
```
✅ Socket connected: <socket-id>
```

---

## 📝 Environment Variables

Copy these exactly to Vercel:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://emmidev-codebridge.onrender.com/api` |
| `VITE_SOCKET_URL` | `https://emmidev-codebridge.onrender.com` |
| `VITE_PAYSTACK_PUBLIC_KEY` | `pk_test_your_key_here` |

---

## 🐛 Common Issues

### Issue: 404 on page refresh
**Solution:** Ensure `vercel.json` exists with rewrites (already configured ✅)

### Issue: API calls fail
**Solution:** Check `VITE_API_URL` is set correctly in Vercel environment variables

### Issue: CORS errors
**Solution:** Update `FRONTEND_URL` in Render backend to match your Vercel URL

### Issue: Socket.io not connecting
**Solution:** Ensure `VITE_SOCKET_URL` has no `/api` suffix

---

## ✅ Post-Deployment Checklist

- [ ] App loads at Vercel URL
- [ ] GitHub OAuth login works
- [ ] API calls succeed (check Network tab)
- [ ] Socket.io connects (check Console)
- [ ] `FRONTEND_URL` updated in Render backend
- [ ] All major features tested

---

## 🎯 Your Live URLs

After deployment:

| Service | URL |
|---------|-----|
| **Frontend** | https://emmidev-codebridge.vercel.app |
| **Backend** | https://emmidev-codebridge.onrender.com |
| **API** | https://emmidev-codebridge.onrender.com/api |

---

## 📚 Need More Details?

See complete guide: `VERCEL_DEPLOYMENT_GUIDE.md`

---

## 🎉 Done!

Your app is now live on Vercel! 🚀✨

**Share it with the world:**
```
https://emmidev-codebridge.vercel.app
```
