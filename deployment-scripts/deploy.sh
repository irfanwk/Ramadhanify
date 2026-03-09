#!/bin/bash

# Deploy Script untuk RadaIslami
# Jalankan script ini di VPS setelah setup-vps.sh selesai

set -e

PROJECT_DIR="/var/www/radaislami"
DOMAIN="yourdomain.com"
API_DOMAIN="api.yourdomain.com"

echo "🚀 Starting deployment..."

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
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma db push

# Check if containers are running
echo "🔍 Checking container status..."
docker-compose -f docker-compose.prod.yml ps

# Setup Nginx config
echo "🌐 Setting up Nginx configuration..."
sudo cp nginx/nginx.conf /etc/nginx/sites-available/radaislami

# Update domains in nginx config
sudo sed -i "s/yourdomain.com/$DOMAIN/g" /etc/nginx/sites-available/radaislami
sudo sed -i "s/api.yourdomain.com/$API_DOMAIN/g" /etc/nginx/sites-available/radaislami

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
echo "📝 Next step: Setup SSL certificate"
echo "Run: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN -d $API_DOMAIN"
echo ""
echo "🌐 Your application should now be accessible at:"
echo "   Frontend: http://$DOMAIN"
echo "   API: http://$API_DOMAIN"
echo ""
