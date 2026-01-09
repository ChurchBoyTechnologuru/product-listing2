#!/bin/bash

# Supabase Setup Helper Script
# This script helps you set up Supabase authentication for your project

echo "🚀 Supabase Authentication Setup"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Creating .env.local from env.example..."
    cp env.example .env.local
    echo "✅ Created .env.local"
fi

echo "📋 You need to add the following Supabase credentials to your .env.local file:"
echo ""
echo "NEXT_PUBLIC_SUPABASE_URL=\"https://your-project.supabase.co\""
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=\"your-anon-key\""
echo ""
echo "📖 How to get these credentials:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Select your project (or create a new one)"
echo "3. Go to Settings → API"
echo "4. Copy 'Project URL' for NEXT_PUBLIC_SUPABASE_URL"
echo "5. Copy 'anon public' key for NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "⚙️  Supabase Project Configuration:"
echo "After adding credentials, configure your Supabase project:"
echo ""
echo "1. Enable Email Authentication:"
echo "   - Go to Authentication → Providers"
echo "   - Enable 'Email' provider"
echo ""
echo "2. Enable Google OAuth (optional):"
echo "   - Go to Authentication → Providers"
echo "   - Enable 'Google' provider"
echo "   - Add Google OAuth credentials"
echo ""
echo "3. Configure Redirect URLs:"
echo "   - Go to Authentication → URL Configuration"
echo "   - Add: http://localhost:3000/auth/callback (development)"
echo "   - Add: https://yourdomain.com/auth/callback (production)"
echo ""
echo "🧪 Testing:"
echo "After setup, test authentication with:"
echo "  npm run dev"
echo "  # Then visit http://localhost:3000/auth/register"
echo ""
echo "Or run the test script:"
echo "  npx tsx scripts/test-email-auth.ts"
echo ""
