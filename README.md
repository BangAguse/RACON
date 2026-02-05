<div align="center">
  <img src="icons/raccoon.svg" alt="RACON Logo" width="360">
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Version-0.1.0-brightgreen" />
  <img src="https://img.shields.io/badge/Language-JavaScript-yellow" />
  <img src="https://img.shields.io/badge/Type-Chrome%20Extension-blue" />
  <img src="https://img.shields.io/badge/Focus-Web%20Recon-green" />
  <img src="https://img.shields.io/badge/Approach-Defensive--First-success" />
  <img src="https://img.shields.io/badge/Open%20Source-Yes-brightgreen" />
  <img src="https://img.shields.io/badge/Maintained-Yes-2ea44f" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
  <a href="https://github.com/BangAguse">
    <img src="https://img.shields.io/badge/Author-Muh.%20Agus%20Tri%20Ananda-blue" />
  </a>
  <img src="https://img.shields.io/badge/⚠️%20WARNING-Defensive%20Use%20Only-red" />
</p>

# RACON

_The Stealthy Bandit Recon_  
Lightweight Chrome Extension for Web Reconnaissance & Security Awareness

---

## ❓ Apa itu RACON?

_RACON (The Stealthy Bandit Recon)_ adalah **Chrome Extension** yang dirancang untuk melakukan  
**web reconnaissance ringan dan deteksi awal potensi risiko keamanan** langsung dari sisi client (browser).

RACON mengusung pendekatan **defensive-first**, yaitu:
- Tidak melakukan eksploitasi aktif
- Tidak mengirim payload berbahaya
- Tidak memodifikasi sistem target
- Tidak melakukan brute force atau serangan otomatis

Semua proses dilakukan melalui:
- data publik,
- response browser,
- konfigurasi client-side,
- dan artefak yang memang terekspos ke pengguna biasa.

RACON **benar-benar bekerja**, bukan simulasi, dan tidak memalsukan hasil analisis.

---

## ⚠️ Disclaimer

RACON dibuat untuk **edukasi, audit mandiri, dan peningkatan kesadaran keamanan web**.  
Penggunaan tanpa izin eksplisit dari pemilik sistem atau untuk aktivitas ilegal sepenuhnya berada di luar tanggung jawab pengembang.

Gunakan hanya pada sistem yang:
- kamu miliki,
- kamu kelola,
- atau kamu punya izin tertulis untuk mengaudit.

---

## 🔍 Latar Belakang dan Tujuan

Banyak insiden keamanan web terjadi bukan karena eksploitasi canggih,  
melainkan karena **konfigurasi buruk, informasi terbuka, dan kelalaian dasar**.

RACON dibuat untuk menjawab kebutuhan tersebut:
memberikan **visibilitas cepat** terhadap permukaan serangan (*attack surface*) tanpa harus:
- menggunakan tool berat,
- meninggalkan browser,
- atau langsung masuk ke fase eksploitasi.

Tujuan utama RACON:
- Membantu fase recon awal secara aman
- Meningkatkan awareness developer & security team
- Mempermudah audit ringan sebelum testing lanjutan
- Menyediakan tool edukatif yang transparan dan mudah dipahami

RACON **bukan exploit framework**.  
Ia adalah alat observasi — bukan senjata.

---

## 🧠 Filosofi Proyek

Nama **RACON** terinspirasi dari **raccoon (rakun)**:

- **Scavenger** → mengumpulkan detail kecil yang sering terlewat
- **Stealthy** → bekerja senyap tanpa menarik perhatian sistem
- **Bandit** → “mengambil” informasi, bukan merusak sistem

RACON fokus pada:
**visibilitas, transparansi, dan pencegahan**, bukan perusakan.

---

## 🛠️ Fitur & Tools

RACON menyediakan **12 modul utama**:

1. **Tech Stack Detection**  
   Identifikasi framework, library, dan teknologi website.

2. **CMS Detection**  
   Deteksi Content Management System (misalnya WordPress).

3. **Subdomain Enumeration**  
   Pengumpulan subdomain dari sumber publik.

4. **Endpoint Discovery**  
   Identifikasi endpoint API dan URL internal.

5. **External Assets Listing**  
   Daftar domain dan layanan pihak ketiga.

6. **Email Extraction**  
   Pengambilan alamat email publik yang terekspos.

7. **SQL Injection Indicator**  
   Deteksi indikasi awal pola SQL Injection (tanpa eksploitasi).

8. **XSS Indicator**  
   Identifikasi potensi XSS sink dan refleksi input.

9. **Sensitive Files Check**  
   Pengecekan keberadaan file sensitif (`.env`, `.git`, `.bak`, dll).

10. **API Key Detection**  
    Deteksi kemungkinan kebocoran API key di sisi client.

11. **Security Headers Audit**  
    Audit header keamanan (CSP, HSTS, X-Frame-Options, dll).

12. **Cookie Security Audit**  
    Analisis atribut cookie (`HttpOnly`, `Secure`, `SameSite`).

Semua modul bersifat **read-only** dan non-intrusif.

---

## 📦 Instalasi

1. Clone atau download repository ini
2. Buka Chrome dan akses:
```
chrome://extensions/
```
3. Aktifkan **Developer Mode**
4. Klik **Load unpacked**
5. Pilih folder **RACON**
6. Ekstensi siap digunakan

---

## 🚀 Cara Penggunaan

1. Buka website target
2. Klik ikon **RACON** di toolbar Chrome
3. Jalankan modul yang diinginkan
4. Analisis hasil yang ditampilkan
5. Gunakan informasi untuk audit, dokumentasi, atau pembelajaran

---

## ☕ Support Me

Jika proyek ini bermanfaat dan membantu pekerjaanmu, kamu bisa mendukung pengembangannya
melalui donasi sebagai bentuk apresiasi terhadap karya open-source ini.

<p align="center">
  <img src="https://i.ibb.co.com/21mcgrL6/Untitled-design-20251229-042141-0000.png" alt="DANA Logo" width="140"><br>
  <b>DANA:</b> 085756444803
</p>

Dukunganmu membantu proyek ini tetap hidup, terawat, dan terus dikembangkan 🚀

---

## 📜 Lisensi

Proyek ini dirilis di bawah **MIT License**.

---

<p align="center">
🦝 <b>Recon smart. Stay stealthy.</b><br>
Built by <a href="https://github.com/BangAguse"><b>Muh. Agus Tri Ananda</b></a>
</p>