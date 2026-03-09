# 📝 RINGKASAN - Deployment ke VPS 43.106.105.120

## 🎯 Situasi Anda Sekarang

- ✅ **VPS IP:** 43.106.105.120
- ❌ **Domain:** Belum ada
- 📌 **Deployment:** Pakai IP dulu (HTTP)
- 🔒 **HTTPS:** Nanti setelah punya domain

---

## 🚀 LANGKAH DEPLOYMENT (Copy-Paste)

### 📍 STEP 1: Di Komputer Lokal

```bash
# Pastikan sudah di folder project
cd /home/miwk/Documents/otodidak/RadaIslami

# Buat scripts executable
chmod +x deployment-scripts/*.sh

# Push ke Git
git add .
git commit -m "Setup deployment for IP 43.106.105.120"
git push origin main
```

---

### 📍 STEP 2: Login ke VPS

```bash
# Login via SSH (ganti 'root' dengan username Anda jika berbeda)
ssh root@43.106.105.120

# Jika diminta password, masukkan password VPS Anda
```

---

### 📍 STEP 3: Clone Repository di VPS

```bash
# Buat folder aplikasi
mkdir -p /var/www/radaislami
cd /var/www/radaislami

# Clone repository (ganti URL dengan repository Anda)
git clone https://github.com/USERNAME/RadaIslami.git .

# Jika private repo, akan diminta username & password/token GitHub
```

---

### 📍 STEP 4: Install Dependencies di VPS

```bash
# Jalankan setup script (install Docker, Nginx, dll)
bash deployment-scripts/setup-vps.sh

# PENTING: Logout dan login lagi setelah setup
exit
ssh root@43.106.105.120
```

---

### 📍 STEP 5: Setup Environment Variables

```bash
cd /var/www/radaislami

# Copy file example
cp .env.production.example .env.production

# Edit file
nano .env.production
```

**Isi seperti ini:**
```env
DB_PASSWORD=PasswordKuatAnda123!@#
VPS_IP=43.106.105.120
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://rada_user:PasswordKuatAnda123!@#@db:5432/rada_islami_db?schema=public
```

**Simpan:** Tekan `Ctrl+O`, Enter, lalu `Ctrl+X`

---

### 📍 STEP 6: Deploy Aplikasi

```bash
cd /var/www/radaislami

# Jalankan deployment
bash deployment-scripts/deploy-ip.sh
```

Tunggu 2-5 menit sampai selesai.

---

### 📍 STEP 7: Test Akses

```bash
# Test dari VPS
curl http://43.106.105.120

# Jika berhasil, akan muncul HTML response
```

**Buka di browser:**
- Frontend: http://43.106.105.120
- Backend API: http://43.106.105.120/api/v1

---

## ✅ Checklist

- [ ] **Step 1:** Push code ke Git ✓
- [ ] **Step 2:** SSH login ke VPS ✓
- [ ] **Step 3:** Clone repository ✓
- [ ] **Step 4:** Setup VPS (Docker, Nginx) ✓
- [ ] **Step 5:** Edit .env.production ✓
- [ ] **Step 6:** Deploy aplikasi ✓
- [ ] **Step 7:** Test akses http://43.106.105.120 ✓

---

## 🔍 Troubleshooting

### Tidak bisa SSH ke VPS?
```bash
# Pastikan firewall membuka port SSH
# Atau gunakan console dari provider VPS (Alibaba Cloud, AWS, dll)
```

### Repository private dan tidak bisa clone?
```bash
# Gunakan Personal Access Token untuk HTTPS
# Atau setup SSH key di GitHub
```

### Deploy gagal?
```bash
# Lihat logs
docker-compose -f docker-compose.prod.yml logs -f

# Cek apakah semua container running
docker-compose -f docker-compose.prod.yml ps
```

### Tidak bisa akses http://43.106.105.120?
```bash
# Cek firewall
sudo ufw allow 80
sudo ufw allow 443

# Cek nginx
sudo systemctl status nginx
sudo nginx -t
```

---

## 📖 Dokumentasi Lengkap

- 📘 **[DEPLOYMENT-IP.md](./DEPLOYMENT-IP.md)** → Panduan lengkap untuk deployment dengan IP
- 📗 **[DEPLOYMENT.md](./DEPLOYMENT.md)** → Panduan lengkap untuk deployment dengan domain + HTTPS

---

## 🔄 Nanti Kalau Sudah Punya Domain

1. **Beli domain** (contoh: radaislami.com)
2. **Setup DNS:** Arahkan A Record ke `43.106.105.120`
3. **Update kode:** Ganti IP dengan domain di beberapa file
4. **Deploy ulang** dengan domain
5. **Setup SSL:** Jalankan `setup-ssl.sh` untuk HTTPS

Lihat panduan lengkap di [DEPLOYMENT-IP.md](./DEPLOYMENT-IP.md) bagian "Upgrade ke Domain + HTTPS"

---

## 📞 Butuh Bantuan?

Jika ada error atau pertanyaan, cek:
1. Logs container: `docker-compose -f docker-compose.prod.yml logs -f`
2. Status container: `docker-compose -f docker-compose.prod.yml ps`
3. Nginx logs: `sudo tail -f /var/log/nginx/error.log`

Selamat deployment! 🚀
