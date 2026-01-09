# Supabase Authentication Setup Guide

This guide will help you complete the Supabase authentication setup after migrating from Firebase.

## Quick Start

Run the setup helper script to see configuration instructions:

```bash
./scripts/setup-supabase.sh
```

## Step 1: Get Supabase Credentials

### Create a Supabase Project (if you don't have one)

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - **Name**: Your project name (e.g., "International Marketplace")
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click "Create new project" and wait for setup to complete

### Get Your API Credentials

1. In your Supabase project dashboard
2. Go to **Settings** → **API**
3. You'll see two important values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 2: Add Credentials to .env.local

Add these lines to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key-here"
```

Replace the placeholder values with your actual credentials from Step 1.

## Step 3: Configure Supabase Authentication

### Enable Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Email** in the list
3. Toggle it to **Enabled**
4. Configure settings:
   - ✅ Enable email confirmations (recommended)
   - ✅ Enable email change confirmations (recommended)
   - Set confirmation email template if needed
5. Click **Save**

### Enable Google OAuth (Optional)

If you want "Sign in with Google" functionality:

1. **Get Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**

2. **Configure in Supabase**:
   - Go to **Authentication** → **Providers**
   - Find **Google** and toggle to **Enabled**
   - Paste your **Client ID** and **Client Secret**
   - Click **Save**

### Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://yourdomain.com/auth/callback` (for production)
3. Under **Site URL**, set:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
4. Click **Save**

## Step 4: Test Authentication

### Start Development Server

```bash
npm run dev
```

### Test Registration

1. Navigate to [http://localhost:3000/auth/register](http://localhost:3000/auth/register)
2. Fill in the registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123!
3. Click "Create Account"
4. You should be redirected to the dashboard

### Test Login

1. Navigate to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Enter your credentials
3. Click "Sign In"
4. You should be redirected to the dashboard

### Test Google OAuth (if configured)

1. Navigate to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. You should be redirected to the dashboard

### Run Automated Test

```bash
npx tsx scripts/test-email-auth.ts
```

Expected output:
```
Supabase Config: { url: 'Present', anonKey: 'Present' }

1. Testing Registration...
✓ Registration successful!
  User ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Email: testXXXXXXXXXX@example.com

2. Testing Login...
✓ Login successful!
  User ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Email: testXXXXXXXXXX@example.com
```

## Step 5: Verify Database Sync

Check that users are being synced to your PostgreSQL database:

1. After registering/logging in, check your database:
   ```bash
   npm run db:studio
   ```
2. Look in the `User` table
3. You should see the new user with:
   - Email from Supabase
   - Name from user metadata
   - Password set to `supabase-managed`
   - Role set to `BUYER`

## Troubleshooting

### "Missing Supabase environment variables" Error

**Problem**: Application crashes with environment variable error

**Solution**: 
- Ensure `.env.local` has both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the dev server after adding variables

### Email Confirmation Not Received

**Problem**: User registers but doesn't receive confirmation email

**Solution**:
- Check Supabase dashboard → Authentication → Email Templates
- For development, you can disable email confirmation:
  - Go to Authentication → Providers → Email
  - Uncheck "Enable email confirmations"
  - Click Save

### Google OAuth Redirect Error

**Problem**: OAuth fails with redirect URI mismatch

**Solution**:
- Verify redirect URL in Google Cloud Console matches exactly:
  - `https://your-project-ref.supabase.co/auth/v1/callback`
- Ensure Google provider is enabled in Supabase
- Check that credentials are correctly entered

### User Not Syncing to Database

**Problem**: User authenticates in Supabase but doesn't appear in database

**Solution**:
- Check browser console for sync errors
- Verify backend API is running
- Check that `JWT_SECRET` is set in `.env.local`
- Verify database connection string is correct

### Session Not Persisting

**Problem**: User gets logged out on page refresh

**Solution**:
- Check browser localStorage for Supabase session
- Verify `persistSession: true` in `lib/supabase.ts`
- Clear browser cache and try again

## Additional Configuration

### Email Templates

Customize email templates in Supabase:
1. Go to **Authentication** → **Email Templates**
2. Customize:
   - Confirmation email
   - Magic link email
   - Password reset email
   - Email change confirmation

### Row Level Security (RLS)

If you're using Supabase database for storing data:
1. Go to **Authentication** → **Policies**
2. Set up RLS policies for your tables
3. Example policy for user-specific data:
   ```sql
   CREATE POLICY "Users can view own data"
   ON your_table
   FOR SELECT
   USING (auth.uid() = user_id);
   ```

## Production Deployment

Before deploying to production:

1. **Update Environment Variables**:
   - Add Supabase credentials to your hosting platform
   - Update redirect URLs to production domain

2. **Update Supabase Configuration**:
   - Add production URL to redirect URLs
   - Update site URL to production domain

3. **Test in Production**:
   - Test registration flow
   - Test login flow
   - Test OAuth flow (if configured)
   - Verify database sync

## Migration from Firebase

### Existing Users

⚠️ **Important**: Existing Firebase users will need to re-register or reset their password.

If you need to migrate existing users:
1. Export users from Firebase Authentication
2. Use Supabase Management API to import users
3. Send password reset emails to all users

### Data Migration

User data in your PostgreSQL database is not affected by this migration. Only the authentication provider has changed.

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Summary

✅ Supabase client configured  
✅ Authentication methods migrated  
✅ OAuth callback handler updated  
✅ Backend sync maintained  
✅ Build verified  

Your authentication system is now powered by Supabase! 🎉
