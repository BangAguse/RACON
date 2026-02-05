# Contributing

Terima kasih telah berminat berkontribusi pada **RACON** — kontribusi Anda sangat membantu!
Panduan ini dibuat singkat, aman, dan terarah agar kolaborasi berjalan lancar.

---

## 📘 Ringkasan Singkat
- Fork repo → buat branch baru → buat perubahan kecil → buka Pull Request ke `main`.
- Ikuti panduan gaya, tambahkan tes bila perlu, dan sertakan deskripsi lengkap pada PR.

## 📥 Cara Memulai
1. Fork repo dan clone ke lokal: `git clone https://github.com/<username>/RACON.git`
2. Buat branch fitur/fix: `git checkout -b feat/namamu-deskripsi` atau `fix/namamu-deskripsi`.
3. Sesuaikan kode, tambahkan tes, jalankan linter dan tes (jika tersedia):
   - Contoh: `npm install` lalu `npm test` atau `npm run lint` (jika tersedia).
4. Push branch dan buka Pull Request ke `main` dengan deskripsi perubahan.

## 🧭 Penamaan Branch & Commit
- Branch: `feat/...`, `fix/...`, `docs/...`, `refactor/...`, `chore/...`.
- Commit messages singkat & konsisten. Disarankan mengikuti Conventional Commits: `feat:`, `fix:`, `docs:`.

## 🐛 Melaporkan Bug
Sertakan informasi berikut di issue:
- Judul singkat
- Deskripsi & langkah reproduksi
- Versi extension / browser / OS
- Hasil yang diharapkan vs aktual
- Screenshot / log jika ada

## 💡 Mengusulkan Fitur
Jelaskan masalah yang ingin diselesaikan, contoh penggunaan, dan desain solusi (opsional: PR kecil/POC).

## 🔐 Pelaporan Keamanan (IMPORTANT)
- Untuk kerentanan sensitif: gunakan **GitHub Security Advisory** atau kirim laporan langsung via issue berlabel `security` dan beri tanda `[SECURITY]` di judul; maintainer akan berkomunikasi secara privat.
- Jangan mempublikasikan detail eksploit sampai ada perbaikan yang disetujui.
- Jika memungkinkan, sertakan bukti konsep minimal dan langkah reproduksi, tetapi hindari eksploitasi yang merugikan pihak lain.

## ✅ Checklist untuk Pull Request
Sebelum membuka PR, pastikan:
- [ ] Branch untuk satu perubahan tunggal
- [ ] Tes ditambahkan atau diperbarui (jika relevan)
- [ ] Lint & format kode sudah dijalankan
- [ ] Deskripsi PR jelas + link ke issue (jika ada)
- [ ] Screenshots / contoh output bila ada perubahan UI

## 🧪 Testing & CI
- Jika repo memiliki suite tes / pipeline, pastikan semua tes lulus sebelum PR.
- Jika tidak ada tes, sertakan deskripsi manual testing yang Anda lakukan.

## 🧾 Review & Merge
- Maintainer akan melakukan review dan mungkin meminta perbaikan.
- Setelah disetujui dan CI lulus, PR akan di-merge (squash or merge sesuai kebijakan maintainers).

## 👩‍⚖️ Kode Etik (Code of Conduct)
- Hormat, profesional, dan inklusif.
- Tidak ada pelecehan, diskriminasi, atau bahasa yang menyerang.
- Laporkan pelanggaran kepada maintainer.

## 📬 Kontak
- Maintainer: [BangAguse](https://github.com/BangAguse)
- Untuk pertanyaan umum, buka issue baru atau mention maintainer di PR.

## 📜 Lisensi
Semua kontribusi akan dilisensikan di bawah **MIT License** proyek ini.

---

Terima kasih telah membantu membuat RACON lebih baik — kontribusi Anda dihargai! 🎉
