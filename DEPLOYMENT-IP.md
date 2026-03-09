# 🚀 Deployment dengan IP Address (Tanpa Domain)

## 📌 Informasi VPS Anda

- **IP Address:** `43.106.105.120`
- **Status Domain:** Belum ada (menggunakan IP dulu)
- **Protocol:** HTTP (bukan HTTPS - butuh domain untuk SSL)

---

## ⚡ Quick Deploy - 3 Langkah

### 1️⃣ Di Lokal - Siapkan Kode
```bash
# Pastikan semua file sudah OK
git add .
git commit -m "Setup deployment with IP"
git push origin main
```

### 2️⃣ Di VPS - Setup Awal (Satu Kali)
```bash
# Login ke VPS
ssh root@43.106.105.120

# Clone repository
mkdir -p /var/www/radaislami
cd /var/www/radaislami
git clone https://github.com/USERNAME/RadaIslami.git .

# Setup VPS 
bash deployment-scripts/setup-vps.sh

# Logout dan login lagi
exit
ssh root@43.106.105.120
```

### 3️⃣ Di VPS - Deploy Aplikasi
```bash
cd /var/www/radaislami

# Setup environment
cp .env.production.example .env.production
nano .env.production
# Isi password database yang kuat

# Deploy!
bash deployment-scripts/deploy-ip.sh
```

---

## 🌐 Akses Aplikasi

Setelah deployment selesai, akses aplikasi di:

- **Frontend:** http://43.106.105.120
- **Backend API:** http://43.106.105.120/api/v1

⚠️ **CATATAN:** Menggunakan HTTP (bukan HTTPS) karena belum ada domain.

---

## 🔧 Setup Environment Variables

Edit file `.env.production` di VPS:

```bash
nano .env.production
```

Isi dengan:
```env
# Password database yang KUAT
DB_PASSWORD=GantiDenganPasswordKuatAnda123!@#

# IP VPS (sudah otomatis)
VPS_IP=43.106.105.120

# Backend settings
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://rada_user:GantiDenganPasswordKuatAnda123!@#@db:5432/rada_islami_db?schema=public
```

**Simpan:** `Ctrl + O`, Enter, `Ctrl + X`

---

## 📋 Command Penting

### Monitoring
```bash
# Lihat status containers
docker-compose -f docker-compose.prod.yml ps

# Lihat logs
docker-compose -f docker-compose.prod.yml logs -f

# Lihat logs frontend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Lihat logs backend  
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Update Aplikasi
```bash
cd /var/www/radaislami
git pull origin main
bash deployment-scripts/deploy-ip.sh
```

### Restart Services
```bash
cd /var/www/radaislami
docker-compose -f docker-compose.prod.yml restart

# Atau restart spesifik service
docker-compose -f docker-compose.prod.yml restart frontend
docker-compose -f docker-compose.prod.yml restart backend
```

---

## 🔄 Upgrade ke Domain + HTTPS (Nanti)

Ketika sudah beli domain, ikuti langkah ini:

### Step 1: Setup DNS
Di provider domain (Namecheap, Cloudflare, dll), buat A Record:
```
Type   Name   Value              TTL
A      @      43.106.105.120     Auto
A      www    43.106.105.120     Auto
A      api    43.106.105.120     Auto
```

### Step 2: Update Kode

**File: docker-compose.prod.yml**
```yaml
# Ganti baris 30
- NEXT_PUBLIC_API_URL=http://api.radaislami.com/api/v1
```

**File: deployment-scripts/deploy.sh**
```bash
# Ganti baris 9-10
DOMAIN="radaislami.com"
API_DOMAIN="api.radaislami.com"
```

**File: deployment-scripts/setup-ssl.sh**
```bash
# Ganti baris 7-9
DOMAIN="radaislami.com"
API_DOMAIN="api.radaislami.com"  
EMAIL="your-email@gmail.com"
```

### Step 3: Deploy dengan Domain
```bash
# Push perubahan
git add .
git commit -m "Update to domain"
git push origin main

# Di VPS
cd /var/www/radaislami
git pull origin main
bash deployment-scripts/deploy.sh

# Setup SSL
bash deployment-scripts/setup-ssl.sh
```

### Step 4: Akses dengan HTTPS
- ✅ https://radaislami.com
- ✅ https://api.radaislami.com

---

## 🐛 Troubleshooting

### Problem: Tidak bisa akses http://43.106.105.120

```bash
# Cek firewall
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443

# Cek Nginx
sudo systemctl status nginx
sudo nginx -t
sudo systemctl restart nginx

# Cek containers
docker-compose -f docker-compose.prod.yml ps
```

### Problem: Frontend tidak bisa connect ke Backend

```bash
# Cek backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Pastikan backend running
curl http://localhost:4000/api/v1/health

# Restart backend
docker-compose -f docker-compose.prod.yml restart backend
```

### Problem: Database error

```bash
# Cek database container
docker-compose -f docker-compose.prod.yml logs db

# Masuk ke database
docker-compose -f docker-compose.prod.yml exec db psql -U rada_user -d rada_islami_db

# Reset database (HATI-HATI: menghapus semua data!)
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Monitoring Resources

```bash
# CPU & Memory usage
docker stats

# Disk usage
df -h

# Memory usage
free -h

# Network connections
netstat -tuln | grep LISTEN
```

---

## ✅ Checklist Deployment

- [ ] VPS sudah siap (Ubuntu 20.04+)
- [ ] SSH akses OK
- [ ] Git repository sudah di-push
- [ ] Setup VPS (Docker, Nginx, dll) ✓
- [ ] .env.production sudah diisi
- [ ] Deploy aplikasi ✓
- [ ] Bisa akses http://43.106.105.120 ✓
- [ ] Frontend berfungsi ✓
- [ ] Backend API berfungsi ✓

---

## 🎯 Next Steps

1. **Testing:** Test semua fitur aplikasi via http://43.106.105.120
2. **Beli Domain:** Opsional, tapi recommended untuk production
3. **Setup HTTPS:** Setelah punya domain, ikuti panduan upgrade di atas
4. **Backup:** Setup backup database secara regular
5. **Monitoring:** Setup monitoring dan alerts

---

## 📞 Bantuan

Jika ada masalah:
1. Cek logs: `docker-compose -f docker-compose.prod.yml logs -f`
2. Cek status: `docker-compose -f docker-compose.prod.yml ps`
3. Test connectivity: `curl http://43.106.105.120`

Selamat deployment! 🎉
