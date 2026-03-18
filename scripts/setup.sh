#!/bin/bash

# Trade Area Analysis Dashboard - Setup Script

echo "🚀 Starting Trade Area Analysis Dashboard setup..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local file not found. Creating from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please update it with your configuration."
    echo ""
    echo "Required environment variables:"
    echo "  - DATABASE_URL: PostgreSQL connection string"
    echo "  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD: For email service"
    echo "  - JWT_SECRET: For session management"
    echo ""
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Run migrations
echo "🔧 Running database migrations..."
npm run db:migrate
if [ $? -ne 0 ]; then
    echo "❌ Migration failed!"
    exit 1
fi
echo "✅ Migrations completed"
echo ""

# Run seed
echo "🌱 Seeding database with sample data..."
npm run db:seed
if [ $? -ne 0 ]; then
    echo "❌ Seeding failed!"
    exit 1
fi
echo "✅ Database seeded"
echo ""

echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Review your .env.local configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to access the dashboard"
echo ""
echo "Default test users will be created during seeding."
