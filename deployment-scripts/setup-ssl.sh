#!/bin/bash

# SSL Setup Script menggunakan Let's Encrypt
# Jalankan script ini setelah deploy.sh selesai

set -e

# Ganti dengan domain Anda
DOMAIN="yourdomain.com"
API_DOMAIN="api.yourdomain.com"
EMAIL="your-email@example.com"

echo "🔒 Setting up SSL Certificate with Let's Encrypt..."

# Pastikan Nginx sudah running
sudo systemctl status nginx || sudo systemctl start nginx

# Dapatkan SSL certificate
echo "📜 Obtaining SSL certificate..."
sudo certbot --nginx \
    -d $DOMAIN \
    -d www.$DOMAIN \
    -d $API_DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect

# Test auto-renewal
echo "🔄 Testing auto-renewal..."
sudo certbot renew --dry-run

# Setup auto-renewal cron job (backup)
echo "⏰ Setting up auto-renewal cron job..."
(crontab -l 2>/dev/null; echo "0 0 * * * certbot renew --quiet") | crontab -

echo ""
echo "✅ SSL Certificate installed successfully!"
echo ""
echo "🌐 Your website is now accessible via HTTPS:"
echo "   Frontend: https://$DOMAIN"
echo "   API: https://$API_DOMAIN"
echo ""
echo "🔄 Auto-renewal is configured. Certificates will renew automatically."
echo ""
