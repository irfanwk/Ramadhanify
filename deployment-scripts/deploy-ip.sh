#!/bin/bash

# Deploy Script untuk VPS dengan IP Address (Tanpa Domain)
# File: deployment-scripts/deploy-ip.sh

set -e

PROJECT_DIR="/var/www/radaislami"
VPS_IP="43.106.105.120"

echo "🚀 Starting deployment with IP address: $VPS_IP"

# Ensure we're in the project directory
cd $PROJECT_DIR

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Load environment variables
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production not found!"
    echo "Please copy .env.production.example to .env.production and fill in the values"
    exit 1
fi

# Copy backend env
cp .env.production backend/.env.production

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Build and start containers
echo "🏗️  Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma db push

# Check if containers are running
echo "🔍 Checking container status..."
docker-compose -f docker-compose.prod.yml ps

# Setup Nginx config (IP only, no SSL)
echo "🌐 Setting up Nginx configuration (IP only)..."
sudo cp nginx/nginx-ip-only.conf /etc/nginx/sites-available/radaislami

# Update IP in nginx config
sudo sed -i "s/43.106.105.120/$VPS_IP/g" /etc/nginx/sites-available/radaislami

# Enable site
sudo ln -sf /etc/nginx/sites-available/radaislami /etc/nginx/sites-enabled/

# Remove default nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx config
echo "✅ Testing Nginx configuration..."
sudo nginx -t

# Reload nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application is now accessible at:"
echo "   http://$VPS_IP (Frontend + Backend)"
echo ""
echo "📝 To access:"
echo "   - Frontend: http://$VPS_IP"
echo "   - Backend API: http://$VPS_IP/api/v1"
echo ""
echo "⚠️  NOTE: Aplikasi menggunakan HTTP (bukan HTTPS)"
echo "   Untuk mengaktifkan HTTPS, Anda perlu domain terlebih dahulu."
echo ""
echo "📖 Untuk upgrade ke domain + HTTPS:"
echo "   1. Beli domain dan arahkan A Record ke IP: $VPS_IP"
echo "   2. Update docker-compose.prod.yml dengan domain Anda"
echo "   3. Jalankan: bash deployment-scripts/deploy.sh"
echo "   4. Setup SSL: bash deployment-scripts/setup-ssl.sh"
echo ""
