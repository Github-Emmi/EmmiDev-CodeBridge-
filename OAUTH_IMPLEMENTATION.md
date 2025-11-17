# OAuth Authentication - Quick Start

## ✅ What Was Implemented

GitHub and LinkedIn OAuth authentication has been fully integrated into the EmmiDev CodeBridge platform!

### Files Created/Modified

**Backend:**
- ✅ `backend/config/passport.js` - Passport OAuth strategies configuration
- ✅ `backend/routes/authRoutes.js` - OAuth routes added
- ✅ `backend/models/User.js` - Added `githubId` and `linkedinId` fields
- ✅ `backend/server.js` - Passport middleware initialization
- ✅ `backend/package.json` - Added OAuth dependencies
- ✅ `backend/.env.example` - OAuth environment variables

**Frontend:**
- ✅ `frontend/src/pages/auth/LoginPage.jsx` - OAuth buttons with handlers
- ✅ `frontend/src/pages/auth/OAuthCallback.jsx` - OAuth redirect handler
- ✅ `frontend/src/App.jsx` - OAuth callback route

**Documentation:**
- ✅ `OAUTH_SETUP.md` - Complete OAuth setup guide

---

## 🚀 Quick Setup (Development)

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `passport` - Authentication middleware
- `passport-github2` - GitHub OAuth strategy
- `passport-linkedin-oauth2` - LinkedIn OAuth strategy
- `express-session` - Session management

### 2. Register OAuth Apps

#### GitHub (5 minutes)
1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - **Name**: EmmiDev CodeBridge (Dev)
   - **Homepage**: `http://localhost:5173`
   - **Callback**: `http://localhost:5000/api/auth/github/callback`
4. Copy Client ID and Client Secret

#### LinkedIn (10 minutes)
1. Go to https://www.linkedin.com/developers/apps
2. Click "Create App"
3. Fill in app details (requires LinkedIn company page)
4. Go to "Products" → Request "Sign In with LinkedIn"
5. Add redirect URL: `http://localhost:5000/api/auth/linkedin/callback`
6. Copy Client ID and Client Secret from "Auth" tab

### 3. Update Environment Variables

Add to `backend/.env`:

```bash
# Session
SESSION_SECRET=my-super-secret-session-key-12345

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
LINKEDIN_CALLBACK_URL=http://localhost:5000/api/auth/linkedin/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Start Servers

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 5. Test OAuth Login

1. Go to http://localhost:5173/login
2. Click "GitHub" or "LinkedIn" button
3. Authorize the application
4. You'll be redirected back and logged in!

---

## 🔍 How It Works

### User Flow

```
┌─────────────┐
│   User      │
│  clicks     │──────┐
│  "GitHub"   │      │
└─────────────┘      │
                     ▼
              ┌──────────────┐
              │   Frontend   │
              │  Redirects   │
              │      to      │
              │ /api/auth/   │
              │   github     │
              └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │   Backend    │
              │  Redirects   │
              │      to      │
              │   GitHub     │
              │   (OAuth)    │
              └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │   GitHub     │
              │  User Auth   │
              │  & Approval  │
              └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │   Backend    │
              │  Callback    │
              │  Creates/    │
              │  Finds User  │
              │  Gen JWT     │
              └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │  Redirect to │
              │  /auth/      │
              │  callback    │
              │  ?token=xxx  │
              └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │  Frontend    │
              │  Stores JWT  │
              │  Updates     │
              │  Redux       │
              │  Redirects   │
              │  Dashboard   │
              └──────────────┘
```

### New User Creation

When a user logs in with OAuth for the first time:

```javascript
{
  name: "John Doe",              // From OAuth profile
  email: "john@example.com",     // From OAuth profile  
  githubId: "12345678",          // GitHub user ID
  role: "student",               // Default role
  emailVerified: true,           // OAuth emails are verified
  isActive: true,
  avatarUrl: "https://...",      // Profile picture from OAuth
  passwordHash: "random_hash"    // Random password (OAuth users don't need it)
}
```

### Existing User Linking

If email already exists in database:
- User is found by email
- OAuth ID (`githubId` or `linkedinId`) is added to account
- User can now login with email/password OR OAuth

---

## 🎨 UI Features

### Login Page
- Clean OAuth buttons with provider icons
- "Or continue with" separator
- Hover effects and transitions
- Error handling for failed OAuth

### OAuth Callback
- Loading spinner during redirect
- "Completing Sign In..." message
- Auto-redirect to dashboard
- Error handling and fallback to login

---

## 🔒 Security Features

- ✅ JWT tokens with 30-day expiration
- ✅ Secure session management
- ✅ CSRF protection (state parameter)
- ✅ Email verification from OAuth providers
- ✅ Proper redirect URL validation
- ✅ Secure cookie settings for production

---

## 📝 API Endpoints

### GitHub OAuth
```
GET  /api/auth/github           - Initiate GitHub login
GET  /api/auth/github/callback  - Handle GitHub response
```

### LinkedIn OAuth
```
GET  /api/auth/linkedin          - Initiate LinkedIn login
GET  /api/auth/linkedin/callback - Handle LinkedIn response
```

---

## ⚠️ Important Notes

### For GitHub OAuth:
- User must have a public email or grant `user:email` scope
- Profile pictures are automatically imported
- GitHub username is used if display name not available

### For LinkedIn OAuth:
- Requires "Sign In with LinkedIn" product approval
- May take 1-2 hours for LinkedIn to approve
- Only basic profile and email are accessed

### Session Management:
- Sessions expire after 24 hours
- Secure cookies in production only
- httpOnly and sameSite settings for security

---

## 🐛 Common Issues

### "No email found" Error
**Solution**: Make sure email is public in GitHub settings or use LinkedIn email permissions

### "Redirect URI mismatch"
**Solution**: Ensure callback URLs match exactly in OAuth app settings and `.env` file

### "Session not found"
**Solution**: Check `SESSION_SECRET` is set in `.env` file

---

## 📚 Full Documentation

See `OAUTH_SETUP.md` for:
- Detailed setup instructions
- Production deployment guide
- Advanced configuration
- Troubleshooting guide
- Security best practices

---

## 🎯 Next Steps

### Optional Enhancements:

1. **Add Google OAuth**
   ```bash
   npm install passport-google-oauth20
   ```

2. **Account Settings Page**
   - View linked OAuth accounts
   - Unlink OAuth providers
   - Set primary login method

3. **OAuth Scopes**
   - Request additional permissions
   - Access user's repositories (GitHub)
   - Post on behalf of user (LinkedIn)

4. **Analytics**
   - Track OAuth signup rates
   - Monitor which providers are most popular
   - User acquisition metrics

---

**Status**: ✅ **READY FOR TESTING**

Everything is implemented and ready to use! Just complete the OAuth app registration and add credentials to `.env`.

**Need Help?** Check `OAUTH_SETUP.md` for detailed troubleshooting and setup guides.
