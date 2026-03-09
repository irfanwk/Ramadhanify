# 📚 Panduan Deployment RadaIslami ke VPS dengan HTTPS

## 🎯 Ringkasan Pembagian Tugas

### 💻 DI KODE LOKAL (Repository Anda)
- ✅ File konfigurasi sudah dibuat (docker-compose.prod.yml, nginx config, dll)
- ⚙️ Update environment variables untuk production
- 📤 Push ke Git repository

### 🖥️ DI VPS (Via SSH)
- 🔧 Install Docker, Nginx, Certbot
- 📥 Clone repository
- 🚀 Deploy aplikasi dengan Docker
- 🔒 Setup SSL certificate

---

## 📝 BAGIAN 1: PERUBAHAN DI KODE LOKAL

### 1.1 Update File Frontend

**File:** `frontend/next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Penting untuk production
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
```

### 1.2 Update File docker-compose.prod.yml

Saya sudah membuat file ini. **YANG PERLU DIUBAH:**

```yaml
environment:
  - NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

Ganti `yourdomain.com` dengan domain Anda yang sebenarnya.

### 1.3 Setup Environment Variables

**Buat file:** `.env.production` (di root project)

```bash
# Salin dari .env.production.example
cp .env.production.example .env.production

# Edit dengan values yang sebenarnya
nano .env.production
```

Isi dengan:
```env
DB_PASSWORD=password_database_yang_kuat_123!@#
DOMAIN=radaislami.com
API_DOMAIN=api.radaislami.com
```

**Buat file:** `backend/.env.production`

```bash
# Salin dari backend/.env.production.example
cp backend/.env.production.example backend/.env.production

# Edit dengan values yang sebenarnya
nano backend/.env.production
```

### 1.4 Update Nginx Configuration

**File:** `nginx/nginx.conf`

Ganti semua `yourdomain.com` dengan domain Anda:
- Line 14, 15: `server_name radaislami.com www.radaislami.com;`
- Line 55: `server_name api.radaislami.com;`
- Line 74: `add_header Access-Control-Allow-Origin "https://radaislami.com" always;`

### 1.5 Update Deployment Scripts

**File:** `deployment-scripts/deploy.sh`

```bash
DOMAIN="radaislami.com"
API_DOMAIN="api.radaislami.com"
```

**File:** `deployment-scripts/setup-ssl.sh`

```bash
DOMAIN="radaislami.com"
API_DOMAIN="api.radaislami.com"
EMAIL="your-email@gmail.com"
```

### 1.6 Make Scripts Executable

```bash
chmod +x deployment-scripts/*.sh
```

### 1.7 Push ke Git Repository

```bash
git add .
git commit -m "Add production deployment configuration"
git push origin main
```

**⚠️ PENTING:** Jangan commit file `.env.production`! Tambahkan ke `.gitignore`:

```bash
echo ".env.production" >> .gitignore
echo "backend/.env.production" >> .gitignore
```

---

## 🖥️ BAGIAN 2: KONFIGURASI DI VPS (Via SSH)

### 2.1 Persiapan Domain

**DI DNS PROVIDER (Cloudflare, Namecheap, dll):**

Buat A Records berikut yang mengarah ke IP VPS Anda:

```
Type   Name   Value (IP)         TTL
A      @      123.456.789.123    Auto
A      www    123.456.789.123    Auto
A      api    123.456.789.123    Auto
```

**Cara cek apakah domain sudah mengarah:**
```bash
# Di komputer lokal
ping radaislami.com
ping api.radaislami.com
```

### 2.2 Login ke VPS

```bash
# Di terminal lokal
ssh root@123.456.789.123

# Atau jika menggunakan user biasa
ssh username@123.456.789.123

# Jika menggunakan SSH key
ssh -i /path/to/key.pem username@123.456.789.123
```

### 2.3 Buat User Baru (Opsional tapi Recommended)

```bash
# Jika login sebagai root, buat user baru untuk keamanan
adduser radaislami
usermod -aG sudo radaislami

# Login sebagai user baru
su - radaislami
```

### 2.4 Download dan Jalankan Setup Script

**Opsi A: Clone repository dulu (Recommended)**

```bash
# Clone repository ke /var/www/radaislami
sudo mkdir -p /var/www/radaislami
sudo chown -R $USER:$USER /var/www/radaislami
cd /var/www/radaislami

# Clone repository Anda
git clone https://github.com/username/RadaIslami.git .

# Jalankan setup VPS
bash deployment-scripts/setup-vps.sh
```

**Opsi B: Manual install (jika repo belum siap)**

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt update
sudo apt install nginx -y

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Logout dan login lagi agar Docker group aktif
exit
ssh username@your-vps-ip
```

### 2.5 Setup Environment Variables di VPS

```bash
cd /var/www/radaislami

# Copy example file
cp .env.production.example .env.production
cp backend/.env.production.example backend/.env.production

# Edit dengan nano atau vim
nano .env.production
```

Isi dengan nilai yang sebenarnya:
```env
DB_PASSWORD=your_strong_password_here_123!@#
DOMAIN=radaislami.com
API_DOMAIN=api.radaislami.com
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://rada_user:your_strong_password_here_123!@#@db:5432/rada_islami_db?schema=public
```

**Edit backend/.env.production juga:**
```bash
nano backend/.env.production
```

### 2.6 Deploy Aplikasi

```bash
cd /var/www/radaislami

# Edit domain di deploy script jika belum
nano deployment-scripts/deploy.sh
# Ubah DOMAIN dan API_DOMAIN

# Jalankan deployment
bash deployment-scripts/deploy.sh
```

Script ini akan:
- Pull kode terbaru
- Build Docker containers
- Start semua services (frontend, backend, database)
- Setup Nginx
- Reload Nginx

### 2.7 Cek Status Aplikasi

```bash
# Cek container Docker
docker-compose -f docker-compose.prod.yml ps

# Cek logs jika ada error
docker-compose -f docker-compose.prod.yml logs -f

# Cek frontend logs
docker-compose -f docker-compose.prod.yml logs -f frontend

# Cek backend logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Test akses HTTP (sebelum SSL)
curl http://radaislami.com
curl http://api.radaislami.com/health
```

### 2.8 Setup SSL Certificate (HTTPS)

```bash
cd /var/www/radaislami

# Edit domain dan email di setup-ssl.sh
nano deployment-scripts/setup-ssl.sh
# Ubah DOMAIN, API_DOMAIN, dan EMAIL

# Jalankan SSL setup
bash deployment-scripts/setup-ssl.sh
```

**Atau manual:**

```bash
sudo certbot --nginx \
  -d radaislami.com \
  -d www.radaislami.com \
  -d api.radaislami.com
```

Ikuti prompt:
1. Masukkan email Anda
2. Agree to Terms of Service (Y)
3. Pilih Redirect HTTP ke HTTPS (pilih 2)

### 2.9 Verifikasi HTTPS

```bash
# Test SSL
curl -I https://radaislami.com
curl -I https://api.radaislami.com

# Test auto-renewal
sudo certbot renew --dry-run
```

Buka di browser:
- https://radaislami.com ✅
- https://api.radaislami.com ✅

---

## 🔄 Update Aplikasi (Future Deployments)

Ketika ada perubahan kode:

**Di Lokal:**
```bash
git add .
git commit -m "Update features"
git push origin main
```

**Di VPS:**
```bash
cd /var/www/radaislami

# Pull changes
git pull origin main

# Rebuild dan restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Atau gunakan script
bash deployment-scripts/deploy.sh
```

---

## 🐛 Troubleshooting

### Problem: Container tidak start

```bash
# Cek logs
docker-compose -f docker-compose.prod.yml logs

# Restart specific service
docker-compose -f docker-compose.prod.yml restart frontend
docker-compose -f docker-compose.prod.yml restart backend
```

### Problem: Nginx error

```bash
# Test config
sudo nginx -t

# Cek error log
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Problem: Database connection error

```bash
# Cek database container
docker-compose -f docker-compose.prod.yml exec db psql -U rada_user -d rada_islami_db

# Reset database (HATI-HATI: menghapus data)
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

### Problem: SSL certificate gagal

```bash
# Pastikan domain mengarah ke VPS
ping radaislami.com

# Pastikan port 80 dan 443 terbuka
sudo ufw status

# Stop Nginx sementara
sudo systemctl stop nginx

# Coba certbot standalone
sudo certbot certonly --standalone -d radaislami.com -d www.radaislami.com -d api.radaislami.com

# Start Nginx lagi
sudo systemctl start nginx
```

---

## 📊 Monitoring

```bash
# Monitor resource usage
docker stats

# Monitor logs real-time
docker-compose -f docker-compose.prod.yml logs -f --tail=100

# Check disk usage
df -h

# Check memory
free -h
```

---

## 🔐 Security Checklist

- [x] Firewall aktif (UFW)
- [x] SSH key authentication (recommended)
- [x] Disable root login
- [x] Strong database password
- [x] HTTPS dengan SSL
- [x] Security headers di Nginx
- [x] Rate limiting
- [ ] Regular backups
- [ ] Monitoring alerts

---

## 📞 Bantuan

Jika ada masalah:
1. Cek logs: `docker-compose -f docker-compose.prod.yml logs`
2. Cek status: `docker-compose -f docker-compose.prod.yml ps`
3. Restart services: `docker-compose -f docker-compose.prod.yml restart`

Semoga sukses deployment! 🚀
