#!/bin/bash

# Quick test to verify Supabase configuration

echo "🔍 Checking Supabase Configuration..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local and add your Supabase credentials"
    exit 1
fi

# Check for Supabase variables
if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
    echo "✅ Supabase environment variables found"
else
    echo "❌ Missing Supabase environment variables"
    echo "Please add to .env.local:"
    echo "  NEXT_PUBLIC_SUPABASE_URL=your-url"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key"
    exit 1
fi

echo ""
echo "✅ Configuration looks good!"
echo ""
echo "📝 IMPORTANT: To enable email/password sign-in:"
echo "1. Go to Supabase Dashboard"
echo "2. Authentication → Providers → Email"
echo "3. UNCHECK 'Confirm email'"
echo "4. Click Save"
echo ""
echo "Then test with:"
echo "  npm run dev"
echo ""
