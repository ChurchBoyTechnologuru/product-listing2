# Firebase Google Authentication Setup Guide

## Overview

This guide will help you set up Firebase Google Authentication for your application. The implementation uses Firebase for Google OAuth and syncs user data to your Supabase database.

## Prerequisites

- A Google account
- Access to [Firebase Console](https://console.firebase.google.com/)
- Your application running locally or deployed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Marketplace App")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "Marketplace Web")
3. **Do NOT** check "Also set up Firebase Hosting" (unless you plan to use it)
4. Click **"Register app"**
5. You'll see your Firebase configuration - **keep this page open**, you'll need these values

## Step 3: Enable Google Sign-In

1. In the Firebase Console, go to **Authentication** (left sidebar)
2. Click **"Get started"** if this is your first time
3. Go to the **"Sign-in method"** tab
4. Click on **"Google"** in the providers list
5. Toggle the **"Enable"** switch
6. Enter a **"Project support email"** (your email)
7. Click **"Save"**

## Step 4: Configure Authorized Domains

1. Still in **Authentication → Sign-in method**
2. Scroll down to **"Authorized domains"**
3. Add your domains:
   - `localhost` (already added by default)
   - Your production domain (e.g., `yourapp.com`)
   - Your staging domain if applicable
4. Click **"Add domain"** for each

## Step 5: Get Your Firebase Configuration

From the Firebase Console:

1. Go to **Project Settings** (gear icon in left sidebar)
2. Scroll down to **"Your apps"** section
3. Find your web app and look for the **"Firebase SDK snippet"**
4. Select **"Config"** (not CDN)
5. Copy the configuration values

You should see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 6: Add Environment Variables

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add the following variables with your Firebase config values:

```bash
# Firebase Configuration (for Google OAuth)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef1234567890"
```

3. **Important:** Restart your development server after adding these variables:

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

## Step 7: Test Google Sign-In

1. Navigate to your login page: `http://localhost:3000/auth/login`
2. Click the **"Continue with Google"** button
3. A Google sign-in popup should appear
4. Select your Google account
5. You should be redirected to the dashboard

## Troubleshooting

### "Missing Firebase configuration" Error

- **Cause:** Environment variables not set or dev server not restarted
- **Solution:** 
  1. Verify all `NEXT_PUBLIC_FIREBASE_*` variables are in `.env.local`
  2. Restart your dev server

### "Popup blocked by browser" Error

- **Cause:** Browser is blocking popups
- **Solution:** 
  1. Allow popups for `localhost` or your domain
  2. Look for the popup blocker icon in your browser's address bar

### "This domain is not authorized" Error

- **Cause:** Your domain is not in Firebase's authorized domains list
- **Solution:**
  1. Go to Firebase Console → Authentication → Sign-in method
  2. Add your domain to "Authorized domains"

### User Not Created in Database

- **Cause:** Supabase connection issue or RLS policies
- **Solution:**
  1. Check browser console for errors
  2. Verify Supabase credentials in `.env.local`
  3. Check Supabase RLS policies allow inserts

### "Sign-in cancelled" Error

- **Cause:** User closed the Google sign-in popup
- **Solution:** This is normal - user can try again

## Security Notes

1. **Never commit `.env.local`** to version control
2. The `NEXT_PUBLIC_*` variables are exposed to the browser - this is normal for Firebase
3. Firebase API keys are safe to expose (they're restricted by domain)
4. For production, ensure your domain is in Firebase's authorized domains

## Next Steps

- Test with multiple Google accounts
- Verify user data appears correctly in Supabase
- Test session persistence (refresh page, close/reopen browser)
- Deploy to production and add production domain to Firebase

## Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Supabase Documentation](https://supabase.com/docs)
