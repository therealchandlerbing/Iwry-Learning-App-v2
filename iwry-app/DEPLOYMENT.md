# Iwry MVP - Deployment Guide

This guide will help you deploy your Iwry Portuguese Learning App to Vercel.

## Prerequisites

Before deploying, make sure you have:

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Gemini API Key** - Get one from [Google AI Studio](https://ai.google.dev/)
3. **GitHub Account** - For connecting your repository to Vercel

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key" and create a new key
4. Copy the API key (you'll need it in Step 4)

## Step 2: Push Your Code to GitHub

If you haven't already:

```bash
# Navigate to the iwry-app directory
cd iwry-app

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Iwry MVP"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/iwry-app.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Website

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (or select `iwry-app` if deploying from parent repo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to link your project
```

## Step 4: Configure Environment Variables

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

### Required Variables:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=https://your-app.vercel.app
```

### Generate NEXTAUTH_SECRET:

```bash
# On Linux/Mac:
openssl rand -base64 32

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### After Adding Variables:
- Make sure to add them for **Production**, **Preview**, and **Development** environments
- Click "Save"

## Step 5: Set Up Vercel Postgres Database

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click **Create Database** → **Postgres**
3. Choose a name for your database (e.g., "iwry-db")
4. Select a region close to your users
5. Click **Create**

**Important:** Vercel will automatically add these environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## Step 6: Initialize Database Tables

After deployment is complete:

1. Visit your deployed app URL
2. Open your browser's Developer Tools (F12)
3. Go to the **Console** tab
4. Run this command:

```javascript
fetch('/api/setup/database', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log(d))
```

Or use curl:

```bash
curl -X POST https://your-app.vercel.app/api/setup/database
```

You should see:
```json
{
  "success": true,
  "message": "Database initialized successfully"
}
```

**Note:** Only run this ONCE! Running it multiple times is safe (tables won't be recreated), but unnecessary.

## Step 7: Test Your App

1. Visit your app URL: `https://your-app.vercel.app`
2. Click "Get Started" to create an account
3. Register with an email and password
4. Start your first conversation!

## Post-Deployment Checklist

- [ ] App loads correctly
- [ ] Can create an account
- [ ] Can log in
- [ ] Dashboard shows stats (initially 0)
- [ ] Can start a practice session
- [ ] Can change difficulty/accent settings
- [ ] Chat interface works
- [ ] AI responds to messages
- [ ] Tap-to-translate works
- [ ] Corrections are tracked
- [ ] Can view corrections page
- [ ] Can update profile settings

## Custom Domain (Optional)

To add a custom domain:

1. Go to your project settings in Vercel
2. Navigate to **Domains**
3. Add your domain
4. Update your DNS records as instructed
5. Update `NEXTAUTH_URL` environment variable to your custom domain

## Troubleshooting

### Database Connection Errors

If you see database errors:
1. Check that Vercel Postgres is properly connected
2. Verify environment variables are set
3. Try redeploying: `vercel --prod`

### Authentication Errors

If login/register doesn't work:
1. Verify `NEXTAUTH_SECRET` is set
2. Verify `NEXTAUTH_URL` matches your deployed URL
3. Check browser console for errors

### Gemini API Errors

If chat doesn't work:
1. Verify `GOOGLE_GENERATIVE_AI_API_KEY` is correct
2. Check your Gemini API quota at [Google AI Studio](https://ai.google.dev/)
3. Look at Function Logs in Vercel for error details

### How to View Logs

1. Go to your Vercel project dashboard
2. Click on **Deployments**
3. Click on your latest deployment
4. Click **Functions** tab to see real-time logs

## Development Mode

To run locally:

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your keys

# Run development server
npm run dev

# Open http://localhost:3000
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Gemini API key | `AIza...` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | `abc123...` |
| `NEXTAUTH_URL` | Your app URL | `https://iwry.vercel.app` |
| `POSTGRES_URL` | Auto-set by Vercel | (auto) |
| `POSTGRES_PRISMA_URL` | Auto-set by Vercel | (auto) |
| Other Postgres vars | Auto-set by Vercel | (auto) |

## Updating Your App

To deploy updates:

```bash
# Make changes to your code
git add .
git commit -m "Description of changes"
git push

# Vercel will automatically redeploy
```

## Costs

**Free Tier Includes:**
- Vercel Hosting: Unlimited bandwidth (fair use)
- Vercel Postgres: 256MB storage, 60 hours compute time/month
- Gemini API: Generous free tier (check current limits)

**Estimated Cost for MVP:**
- $0-5/month for typical usage (< 100 users)

Monitor usage in:
- Vercel Dashboard → Usage
- Google AI Studio → API Usage

## Support

If you encounter issues:

1. Check Vercel Function Logs
2. Check browser Developer Console
3. Review this deployment guide
4. Check the main [MVP Plan](/MVP_PLAN.md)

## Next Steps

After successful deployment:

1. **Test thoroughly** on iPhone (your primary target)
2. **Add to Home Screen** on iPhone to test PWA functionality
3. **Invite beta testers** to try the app
4. **Monitor usage** and errors in Vercel dashboard
5. **Iterate** based on feedback

## iPhone Testing

To test the PWA on iPhone:

1. Open your app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Name it "Iwry" and tap "Add"
5. The app icon will appear on your home screen
6. Open it like a native app!

---

**Congratulations! 🎉** Your Iwry MVP is now live!

*Vamos aprender português juntos!* 🇧🇷
