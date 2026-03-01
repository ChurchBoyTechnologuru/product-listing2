# Supabase Setup Checklist

Use this checklist to complete your Supabase configuration.

---

## Phase 1: Database Setup (Critical) ⚠️

### Required: Run SQL Migrations

- [ ] **1. Open Supabase SQL Editor**
  - Go to: https://supabase.com/dashboard
  - Select your project
  - Click **SQL Editor** in the sidebar

- [ ] **2. Execute `001_create_profiles.sql`**
  - Click **New Query**
  - Copy content from `scripts/001_create_profiles.sql`
  - Paste into editor
  - Click **Run** or press `Ctrl+Enter`
  - Verify no errors (check status at top right)

- [ ] **3. Execute `002_setup_storage.sql`**
  - Click **New Query**
  - Copy content from `scripts/002_setup_storage.sql`
  - Paste into editor
  - Click **Run**
  - Verify no errors

- [ ] **4. Verify Tables Created**
  - Go to **Table Editor**
  - Confirm `profiles` table exists
  - Go to **Storage**
  - Confirm `avatars` and `products` buckets exist

---

## Phase 2: Email Configuration (Recommended) 📧

### Setup Email Sending

- [ ] **1. Configure Email Provider**
  - Go to **Authentication** → **Email Templates**
  - Scroll down to **SMTP Provider**
  - Choose provider (default is Supabase SMTP)
  - Configure SMTP settings if using custom provider

- [ ] **2. Verify Email Templates**
  - Check **Confirmation Email** template
  - Check **Password Reset** template
  - Customize templates if needed (add your logo, branding)
  - Click **Save** for each template

- [ ] **3. Test Email Sending**
  - Navigate to your app: `http://localhost:3000/auth/sign-up`
  - Fill in the form with test data
  - Submit
  - Check email inbox for confirmation email
  - Confirm email is received within 1 minute

---

## Phase 3: Authentication Setup (Required) 🔐

### Enable Email Authentication

- [ ] **1. Enable Email Provider**
  - Go to **Authentication** → **Providers**
  - Find **Email** in the list
  - Toggle switch to **Enabled**
  - Configure:
    - ✅ Enable email confirmations
    - ✅ Enable email change confirmations
    - ✅ Enable secure email password changes
  - Click **Save**

- [ ] **2. Configure Redirect URLs**
  - Go to **Authentication** → **URL Configuration**
  - Under **Redirect URLs**, add:
    ```
    http://localhost:3000/auth/callback
    http://localhost:3000/auth/reset-password
    ```
  - Under **Site URL**, set:
    ```
    http://localhost:3000
    ```
  - Click **Save**

### (Optional) Enable Social Authentication

- [ ] **Google OAuth** (if you want "Sign in with Google")
  - Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
  - Go to **Authentication** → **Providers** → **Google**
  - Toggle to **Enabled**
  - Paste Client ID and Client Secret
  - Add redirect URI to Google Cloud Console:
    ```
    https://<your-supabase-url>/auth/v1/callback
    ```
  - Click **Save**

---

## Phase 4: Test Authentication (Critical) ✅

### Test Sign Up Flow

- [ ] **1. Start Dev Server**
  ```bash
  npm run dev
  ```

- [ ] **2. Test Sign Up**
  - Navigate to: `http://localhost:3000/auth/sign-up`
  - Fill in form:
    - Name: Test User
    - Email: test@example.com (use real email or MailHog)
    - Password: TestPassword123!
  - Click "Create Account"
  - Check email for confirmation link
  - Click link to confirm

- [ ] **3. Test Login**
  - Navigate to: `http://localhost:3000/auth/login`
  - Enter email: test@example.com
  - Enter password: TestPassword123!
  - Click "Sign In"
  - Verify redirect to dashboard

- [ ] **4. Test Session Persistence**
  - After login, refresh the page (F5)
  - Verify you're still logged in
  - Check that user info displays

- [ ] **5. Test Logout**
  - Find logout button
  - Click it
  - Verify redirect to login page
  - Verify session is cleared

### Test Password Reset

- [ ] **1. Test Reset Request**
  - Go to login page
  - Click "Forgot Password"
  - Enter your email
  - Check email for reset link

- [ ] **2. Test Reset Completion**
  - Click reset link in email
  - Enter new password
  - Submit form
  - Login with new password

---

## Phase 5: Test File Storage (Required) 📁

### Test Avatar Upload

- [ ] **1. Create a Test Image**
  - Create or find a test image file
  - Keep it under 5MB

- [ ] **2. Login to Your Account**
  - Sign up/login at `http://localhost:3000/auth/sign-up`

- [ ] **3. Upload Avatar**
  - Navigate to profile page
  - Click "Upload Avatar"
  - Select your test image
  - Click upload
  - Verify image displays

- [ ] **4. Verify in Storage**
  - Go to Supabase dashboard
  - Click **Storage** → **avatars**
  - Verify your uploaded file exists

### Test Product Image Upload

- [ ] **1. Create a Product**
  - Navigate to product creation page
  - Fill in product details

- [ ] **2. Upload Product Image**
  - Click "Upload Image"
  - Select your test image
  - Click upload
  - Verify image displays

- [ ] **3. Verify in Storage**
  - Go to Supabase dashboard
  - Click **Storage** → **products**
  - Verify your uploaded file exists

---

## Phase 6: Production Preparation (Before Deploy) 🚀

### Update Configuration for Production

- [ ] **1. Add Production Redirect URLs**
  - Go to **Authentication** → **URL Configuration**
  - Add your production domain:
    ```
    https://yourdomain.com/auth/callback
    https://yourdomain.com/auth/reset-password
    ```
  - Set Site URL:
    ```
    https://yourdomain.com
    ```
  - Click **Save**

- [ ] **2. Update Environment Variables**
  - Go to Vercel Dashboard
  - Go to **Settings** → **Environment Variables**
  - Verify Supabase variables are set:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
  - These should already be set from integration

- [ ] **3. Update Social Auth Redirect URIs** (if applicable)
  - Go to Google Cloud Console
  - Update authorized redirect URIs for production domain
  - Same for other OAuth providers

- [ ] **4. Test in Production**
  - Deploy to Vercel
  - Test sign up on production domain
  - Test login on production domain
  - Test email confirmation
  - Test password reset
  - Test file uploads

---

## Phase 7: Monitoring & Maintenance (Ongoing) 📊

### Setup Monitoring

- [ ] **1. Check Supabase Logs**
  - Go to **Logs** in Supabase dashboard
  - Monitor for auth errors
  - Monitor for storage errors

- [ ] **2. Monitor Email Sending**
  - Go to **Email Logs** (if available)
  - Verify emails are being sent
  - Check for delivery failures

- [ ] **3. Monitor API Usage**
  - Go to **Usage** in Supabase dashboard
  - Monitor monthly usage
  - Stay within free tier limits or upgrade if needed

### Maintenance Tasks

- [ ] **Weekly**
  - Check logs for any errors
  - Monitor email delivery rates
  - Check API usage

- [ ] **Monthly**
  - Review security settings
  - Update email templates if needed
  - Check for Supabase updates

- [ ] **As Needed**
  - Respond to user issues
  - Update OAuth provider credentials when expired
  - Rotate SMTP credentials if using custom provider

---

## Troubleshooting

### Issue: "Email confirmation not received"

**Checklist:**
- [ ] Email provider is configured in Supabase
- [ ] Email template is enabled
- [ ] Check spam/junk folder
- [ ] Check that email entered is correct
- [ ] Wait 2-3 minutes (emails can be slow)
- [ ] Try with a different email address

**Fix:**
- Go to **Authentication** → **Email Templates**
- Verify Confirmation Email is enabled
- Test by requesting another email

### Issue: "Session lost on page refresh"

**Checklist:**
- [ ] Middleware.ts is in the root directory
- [ ] Browser cookies are enabled
- [ ] Not in private/incognito mode
- [ ] Browser cache isn't being cleared

**Fix:**
- Clear browser cache and cookies
- Disable any cookie-blocking extensions
- Try in regular (non-private) window

### Issue: "File upload fails"

**Checklist:**
- [ ] Storage buckets exist (avatars, products)
- [ ] User is authenticated
- [ ] File size is reasonable (< 50MB)
- [ ] File type is allowed (images for now)

**Fix:**
- Go to **Storage** in Supabase
- Verify buckets exist
- Check RLS policies are correct
- Try with a smaller file

### Issue: "Email not sending"

**Checklist:**
- [ ] Email provider is configured
- [ ] SMTP credentials are correct
- [ ] Email address is valid
- [ ] Not over rate limit

**Fix:**
- Check **Email Templates** settings
- Verify SMTP credentials
- Wait a few minutes and try again
- Check spam folder

---

## Final Verification

- [ ] Database tables created successfully
- [ ] Email configuration working
- [ ] Sign up flow completed
- [ ] Login works with confirmation
- [ ] Password reset works
- [ ] File uploads working
- [ ] Session persists on refresh
- [ ] Logout clears session
- [ ] Production redirects configured
- [ ] Environment variables set

---

## You're All Set! 🎉

If all checkboxes are complete, your Supabase authentication and storage are fully configured and tested.

### Next Steps:
1. Update your auth pages to match your design
2. Add additional fields to profiles table if needed
3. Implement additional Supabase features (real-time, etc.)
4. Deploy to production

### Support:
- Check `SUPABASE_SETUP.md` for detailed guide
- Check `lib/supabase/README.md` for code examples
- Visit https://supabase.com/docs for official docs

Good luck! 🚀
