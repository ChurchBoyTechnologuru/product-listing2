-- Enable Row Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;

-- Policy: Users can read their own data
-- Uses auth.email() to match the authenticated user's email
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.email() = email);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.email() = email);

-- Policy: Allow insert for new users during registration
-- This allows users to create their own profile when they sign up
CREATE POLICY "Allow user creation"
ON users FOR INSERT
WITH CHECK (auth.email() = email);

-- Optional: Allow service role to bypass RLS for admin operations
-- This is useful for backend operations that need full access
ALTER TABLE users FORCE ROW LEVEL SECURITY;
