# OAuth Authentication Setup Guide

## Overview

EmmiDev CodeBridge supports OAuth authentication via GitHub and LinkedIn, allowing users to sign up or log in using their existing accounts from these platforms.

## Features

✅ **GitHub OAuth** - Users can authenticate using their GitHub account  
✅ **LinkedIn OAuth** - Users can authenticate using their LinkedIn account  
✅ **Automatic Account Creation** - First-time OAuth users get accounts automatically  
✅ **Account Linking** - Existing users can link their OAuth accounts  
✅ **Role-Based Redirects** - Users are redirected to appropriate dashboards  

---

## Backend Setup

### 1. Install Required Packages

```bash
cd backend
npm install passport passport-github2 passport-linkedin-oauth2 express-session
```

### 2. Environment Variables

Add these variables to your `backend/.env` file:

```bash
# Session Secret
SESSION_SECRET=your-random-session-secret-key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=http://localhost:5000/api/auth/linkedin/callback

# Frontend URL (for redirects after OAuth)
FRONTEND_URL=http://localhost:5173
```

---

## OAuth App Registration

### GitHub OAuth Setup

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/developers
   - Click "OAuth Apps" → "New OAuth App"

2. **Configure OAuth App**
   ```
   Application name: EmmiDev CodeBridge (Development)
   Homepage URL: http://localhost:5173
   Authorization callback URL: http://localhost:5000/api/auth/github/callback
   ```

3. **Get Credentials**
   - After creating, copy the `Client ID`
   - Generate a new `Client Secret` and copy it
   - Add both to your `.env` file

4. **Production Setup**
   ```
   Application name: EmmiDev CodeBridge
   Homepage URL: https://yourdomain.com
   Authorization callback URL: https://api.yourdomain.com/api/auth/github/callback
   ```

### LinkedIn OAuth Setup

1. **Create LinkedIn App**
   - Visit: https://www.linkedin.com/developers/apps
   - Click "Create App"

2. **Fill App Details**
   ```
   App name: EmmiDev CodeBridge
   LinkedIn Page: Your company page (or create one)
   App logo: Upload your logo
   Legal agreement: Accept terms
   ```

3. **Configure OAuth 2.0 Settings**
   - Go to "Auth" tab
   - Add Redirect URLs:
     ```
     http://localhost:5000/api/auth/linkedin/callback  (Development)
     https://api.yourdomain.com/api/auth/linkedin/callback  (Production)
     ```

4. **Request API Access**
   - Under "Products" tab, request access to:
     - **Sign In with LinkedIn** (required)
     - This gives you access to `r_liteprofile` and `r_emailaddress`

5. **Get Credentials**
   - Go to "Auth" tab
   - Copy `Client ID` and `Client Secret`
   - Add them to your `.env` file

---

## User Model Updates

The User model has been updated with OAuth fields:

```javascript
{
  githubId: {
    type: String,
    sparse: true,
    unique: true
  },
  linkedinId: {
    type: String,
    sparse: true,
    unique: true
  }
}
```

---

## API Endpoints

### GitHub OAuth Flow

**1. Initiate GitHub Login**
```
GET /api/auth/github
```
Redirects user to GitHub authorization page.

**2. GitHub Callback**
```
GET /api/auth/github/callback
```
Handles GitHub's response, creates/updates user, generates JWT, and redirects to frontend.

### LinkedIn OAuth Flow

**1. Initiate LinkedIn Login**
```
GET /api/auth/linkedin
```
Redirects user to LinkedIn authorization page.

**2. LinkedIn Callback**
```
GET /api/auth/linkedin/callback
```
Handles LinkedIn's response, creates/updates user, generates JWT, and redirects to frontend.

---

## Frontend Implementation

### OAuth Callback Component

The `/auth/callback` route handles the OAuth redirect:

```javascript
// Extracts token and user from URL params
// Stores in localStorage
// Updates Redux state
// Redirects to appropriate dashboard
```

### Login Page Integration

OAuth buttons in `LoginPage.jsx`:

```javascript
const handleGitHubLogin = () => {
  window.location.href = `${API_URL}/api/auth/github`;
};

const handleLinkedInLogin = () => {
  window.location.href = `${API_URL}/api/auth/linkedin`;
};
```

---

## Authentication Flow

### New User Flow

```
1. User clicks "GitHub" or "LinkedIn" button
   ↓
2. Redirected to OAuth provider (GitHub/LinkedIn)
   ↓
3. User authorizes the app
   ↓
4. Provider redirects to /api/auth/{provider}/callback
   ↓
5. Backend creates new user account
   ↓
6. Backend generates JWT token
   ↓
7. Backend redirects to /auth/callback?token=xxx&user=xxx
   ↓
8. Frontend stores token and user
   ↓
9. Frontend redirects to dashboard
```

### Existing User Flow

```
1. User clicks OAuth button
   ↓
2. OAuth provider authenticates
   ↓
3. Backend finds existing user by email
   ↓
4. Backend links OAuth ID to existing account
   ↓
5. Backend generates JWT token
   ↓
6. User logged in and redirected to dashboard
```

---

## Security Considerations

### Session Security
- Sessions use secure cookies in production
- HTTPS required for production OAuth
- CSRF protection via state parameter (LinkedIn)

### Token Security
- JWT tokens expire after 30 days
- Tokens stored in httpOnly cookies (recommended for production)
- All OAuth routes use secure redirects

### Data Privacy
- Only required scopes are requested
- Email verification status from OAuth providers
- User can disconnect OAuth accounts in settings

---

## Testing OAuth Locally

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```

### 3. Test GitHub Login
- Go to http://localhost:5173/login
- Click "GitHub" button
- Authorize the app
- Should redirect to dashboard

### 4. Test LinkedIn Login
- Go to http://localhost:5173/login
- Click "LinkedIn" button
- Authorize the app
- Should redirect to dashboard

---

## Troubleshooting

### "Redirect URI mismatch" Error

**Problem**: OAuth callback URL doesn't match registered URL

**Solution**: 
- Check that callback URLs in OAuth app settings match your `.env` file
- Ensure no trailing slashes
- Development: `http://localhost:5000/api/auth/github/callback`
- Production: `https://api.yourdomain.com/api/auth/github/callback`

### "No email found" Error

**Problem**: OAuth provider didn't return email

**GitHub Solution**:
- Make sure email is public in GitHub settings
- Or grant `user:email` scope

**LinkedIn Solution**:
- Ensure "Sign In with LinkedIn" product is approved
- Check that `r_emailaddress` scope is requested

### Session/Cookie Issues

**Problem**: Session not persisting

**Solution**:
- Check `SESSION_SECRET` is set in `.env`
- Ensure cookies are enabled in browser
- For production, set `cookie.secure: true` and use HTTPS

### CORS Errors

**Problem**: OAuth redirect blocked by CORS

**Solution**:
```javascript
// In server.js, ensure CORS is configured:
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## Production Deployment

### Environment Variables

Update URLs for production:

```bash
# Backend .env
GITHUB_CALLBACK_URL=https://api.yourdomain.com/api/auth/github/callback
LINKEDIN_CALLBACK_URL=https://api.yourdomain.com/api/auth/linkedin/callback
FRONTEND_URL=https://yourdomain.com
SESSION_SECRET=use-a-strong-random-secret
```

### OAuth App Settings

1. **GitHub**: Add production callback URL to OAuth app
2. **LinkedIn**: Add production redirect URL to app settings
3. Update app logos and branding for production apps

### Security Checklist

- [ ] Use strong `SESSION_SECRET`
- [ ] Enable `secure` cookies (HTTPS only)
- [ ] Set `sameSite: 'strict'` for cookies
- [ ] Implement rate limiting on OAuth routes
- [ ] Monitor OAuth login attempts
- [ ] Keep OAuth credentials in secrets manager (AWS Secrets Manager, etc.)

---

## Additional Features

### Account Unlinking (Future Enhancement)

Allow users to disconnect OAuth accounts:

```javascript
// Route: DELETE /api/auth/unlink/:provider
router.delete('/unlink/:provider', protect, unlinkOAuthAccount);
```

### Multi-Provider Linking

Users can link multiple OAuth providers to one account:
- Email + Password + GitHub + LinkedIn = All linked to same account

### OAuth Scope Expansion

Request additional permissions when needed:
- GitHub: `repo` for accessing repositories
- LinkedIn: `w_member_social` for posting on behalf of user

---

## Support

For issues with OAuth integration:
1. Check this documentation
2. Review error logs in backend console
3. Verify OAuth app settings on provider platforms
4. Ensure environment variables are correct

---

**Last Updated**: November 17, 2025  
**Version**: 1.0.0
