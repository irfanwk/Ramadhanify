#!/bin/bash

# Setup VPS Script untuk RadaIslami
# Jalankan script ini di VPS Anda setelah login via SSH

set -e

echo "🚀 Starting VPS Setup for RadaIslami..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker installed"
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed"
else
    echo "✅ Docker Compose already installed"
fi

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install nginx -y
echo "✅ Nginx installed"

# Install Certbot untuk SSL
echo "🔒 Installing Certbot..."
sudo apt install certbot python3-certbot-nginx -y
echo "✅ Certbot installed"

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
echo "✅ Firewall configured"

# Create app directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/radaislami
sudo chown -R $USER:$USER /var/www/radaislami
echo "✅ Application directory created"

# Install Git (jika belum ada)
echo "📥 Installing Git..."
sudo apt install git -y
echo "✅ Git installed"

echo ""
echo "✅ VPS Setup Complete!"
echo ""
echo "📝 Next steps:"
echo "1. Clone your repository: cd /var/www/radaislami && git clone <your-repo-url> ."
echo "2. Copy .env files: cp .env.production.example .env.production"
echo "3. Edit .env.production with your actual values"
echo "4. Run deploy script: bash deployment-scripts/deploy.sh"
echo ""
