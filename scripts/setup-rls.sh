#!/bin/bash

# Setup Row Level Security for Supabase Database
# This script applies RLS policies to the users table

echo "🔒 Setting up Row Level Security policies..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. You can:"
    echo "   1. Install it: npm install -g supabase"
    echo "   2. Or run the SQL manually in Supabase Dashboard → SQL Editor"
    echo ""
    echo "📝 SQL file location: scripts/setup-rls.sql"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""
echo "📋 To apply RLS policies, you have two options:"
echo ""
echo "Option 1: Run in Supabase Dashboard (Recommended)"
echo "  1. Go to https://supabase.com/dashboard"
echo "  2. Select your project"
echo "  3. Go to SQL Editor"
echo "  4. Copy and paste the contents of scripts/setup-rls.sql"
echo "  5. Click 'Run'"
echo ""
echo "Option 2: Use Supabase CLI"
echo "  supabase db push --db-url YOUR_DATABASE_URL"
echo ""
echo "📄 SQL file ready at: scripts/setup-rls.sql"
