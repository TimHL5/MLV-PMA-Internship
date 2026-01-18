#!/bin/bash

# MLV Internal Platform - Quick Setup Script
# Run this after setting up Supabase

echo "🚀 MLV Internal Platform Setup"
echo "==============================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << 'EOF'
# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✅ Created .env.local - Please fill in your Supabase credentials!"
    echo ""
else
    echo "✅ .env.local already exists"
fi

# Install Supabase packages
echo ""
echo "📦 Installing Supabase packages..."
npm install @supabase/supabase-js @supabase/ssr

echo ""
echo "==============================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Fill in your Supabase credentials in .env.local"
echo "2. Run the SQL files in Supabase SQL Editor:"
echo "   - supabase-setup/02-schema.sql"
echo "   - supabase-setup/03-seed-data.sql"
echo "3. Configure Google OAuth in Supabase dashboard"
echo "4. Run: npm run dev"
echo ""
