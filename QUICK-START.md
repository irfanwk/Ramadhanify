# ⚡ Quick Start Deployment

## 🎯 Ringkasan Singkat

### Perubahan di Kode Lokal ✅
File-file deployment sudah dibuat. Yang perlu **DIUBAH**:

1. **`docker-compose.prod.yml`** → Ganti `yourdomain.com` dengan domain Anda
2. **`nginx/nginx.conf`** → Ganti semua `yourdomain.com` dengan domain Anda
3. **`deployment-scripts/deploy.sh`** → Ganti `DOMAIN` dan `API_DOMAIN`
4. **`deployment-scripts/setup-ssl.sh`** → Ganti `DOMAIN`, `API_DOMAIN`, `EMAIL`

### Eksekusi di VPS 🖥️

```bash
# 1. Setup VPS (satu kali)
bash deployment-scripts/setup-vps.sh

# 2. Setup environment
cp .env.production.example .env.production
nano .env.production  # Isi password & domain

# 3. Deploy aplikasi
bash deployment-scripts/deploy.sh

# 4. Setup HTTPS
bash deployment-scripts/setup-ssl.sh
```

---

## 📋 Checklist Cepat

### Sebelum Deploy
- [ ] Domain sudah dibeli
- [ ] DNS A Record sudah di-set (@ dan api)
- [ ] VPS sudah siap (Ubuntu 20.04+)
- [ ] SSH access ke VPS sudah OK

### Di Kode Lokal
- [ ] Update domain di `docker-compose.prod.yml`
- [ ] Update domain di `nginx/nginx.conf`
- [ ] Update domain di `deployment-scripts/*.sh`
- [ ] `chmod +x deployment-scripts/*.sh`
- [ ] Push ke Git

### Di VPS via SSH
- [ ] Clone repository
- [ ] Jalankan `setup-vps.sh`
- [ ] Copy dan edit `.env.production`
- [ ] Jalankan `deploy.sh`
- [ ] Jalankan `setup-ssl.sh`
- [ ] Test: `curl https://yourdomain.com`

---

## 🚀 Command Singkat

### Development (Lokal)
```bash
docker-compose up
```

### Production (VPS)
```bash
# Initial deployment
bash deployment-scripts/setup-vps.sh
bash deployment-scripts/deploy.sh
bash deployment-scripts/setup-ssl.sh

# Update deployment
git pull && bash deployment-scripts/deploy.sh
```

### Monitoring
```bash
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml ps
docker stats
```

---

Untuk panduan lengkap, lihat [DEPLOYMENT.md](./DEPLOYMENT.md)
