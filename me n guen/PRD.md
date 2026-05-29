# Product Requirement Document (PRD)
**Nama Proyek:** Digital Memory Scrapbook (Ruang Kenangan)
**Platform:** Web (Mobile & Desktop Responsive)
**Status:** Perencanaan Draft
**Tanggal:** 27 Mei 2026

---

## 1. Visi & Tujuan Proyek
Proyek ini bertujuan untuk menciptakan sebuah ruang digital eksklusif dan privat yang berfungsi sebagai kapsul waktu atau album kenangan. Web ini didedikasikan sepenuhnya untuk menyimpan momen-momen berharga bersama (foto, audio/lagu, dan video) yang dirancang dengan penuh kasih sayang dan estetika visual yang indah.

## 2. Target Pengguna
* **Pengguna Utama:** Hanya 1 orang ("Dia"). Sistem dirancang secara eksklusif dan privat hanya untuk diakses olehnya.

## 3. Tema Desain & UI/UX (Estetika)
* **Warna Dominan:** Pink pastel / *Dusty pink*.
* **Elemen Visual:** * Bunga-bunga indah (bertebaran atau sebagai bingkai).
    * Gaya *Scrapbook* / *Aesthetic Vintage*: Menggunakan tekstur kertas, sobekan kertas koran, *washi tape*, dan polaroid untuk membingkai konten.
* **Vibe:** Romantis, hangat, intim, dan *aesthetic*.
* **Navigasi:** Navigasi vertikal tanpa putus (*seamless scroll down*). Tidak ada perpindahan halaman (Single Page Application).

---

## 4. Alur Pengguna (User Flow)
1. **Landing Page (Security Check):** Pengguna membuka tautan web dan dihadapkan pada layar terkunci yang meminta PIN/Kata Sandi.
2. **Animasi Transisi:** Setelah PIN dimasukkan dengan benar, layar menampilkan kotak hadiah. Kotak tersebut terbuka dan memancarkan animasi ledakan bunga (*flower explosion*).
3. **Main Content (Scrolling):** Animasi memudar (*fade out*) dan membawa pengguna ke halaman utama. Pengguna hanya perlu menggulir ke bawah (*scroll down*) untuk menikmati rentetan kenangan (foto, catatan suara, lagu, dan tautan YouTube/Video) yang disusun secara kronologis atau acak yang indah.

---

## 5. Ruang Lingkup & Persyaratan Fungsional

### Fitur 1: Halaman Login / PIN
* **User Story:** Sebagai pengguna, saya harus memasukkan PIN rahasia agar bisa melihat isi web, sehingga kenangan ini tetap privat.
* **Acceptance Criteria:**
    * Terdapat *input field* untuk memasukkan PIN.
    * Jika PIN salah, muncul pesan kesalahan yang lembut/manis (misal: "Coba ingat-ingat lagi tanggal jadian kita, ya!").
    * Jika PIN benar, memicu fitur animasi pembuka.

### Fitur 2: Animasi "Gift Box & Flower Explosion"
* **User Story:** Sebagai pengguna, setelah login berhasil, saya ingin melihat kotak hadiah yang terbuka dengan ledakan bunga agar merasa diberikan sebuah kejutan.
* **Acceptance Criteria:**
    * Animasi berjalan mulus (direkomendasikan menggunakan CSS animation, LottieFiles, atau GSAP).
    * Animasi berlangsung selama 2-4 detik sebelum transisi otomatis ke halaman utama.

### Fitur 3: Galeri Scroll "Scrapbook" (Halaman Utama)
* **User Story:** Sebagai pengguna, saya bisa menggulir layar ke bawah untuk melihat foto, memutar pesan suara, mendengarkan lagu, dan menonton video kenangan.
* **Acceptance Criteria:**
    * **Media Foto:** Ditampilkan dalam bingkai polaroid atau tertempel di atas tekstur kertas koran.
    * **Media Audio:** Pemutar audio (*audio player*) kustom yang cocok dengan tema untuk memutar lagu atau *voice note*.
    * **Media Video:** Integrasi tautan YouTube (berupa *embed video*) atau pemutar video lokal yang terbingkai rapi.
    * Setiap elemen muncul dengan animasi *fade-in* atau *slide-up* yang halus saat pengguna menggulir ke bawah (*scroll-triggered animation*).

---

## 6. Persyaratan Non-Fungsional (Teknis)
* **Responsivitas (Mobile-First):** Web harus terlihat sempurna saat dibuka melalui *smartphone*, karena kemungkinan besar dia akan membukanya melalui HP.
* **Performa:** Gambar dan media harus dioptimalkan agar web tidak memuat terlalu lambat, meskipun dihiasi banyak elemen bunga dan *scrapbook*.
* **Audio/Video Autoplay:** Kebijakan *browser* modern biasanya memblokir audio yang diputar otomatis (*autoplay*). Pastikan ada tombol *Play* yang jelas atau instruksi manis (misal: "Klik untuk mendengarkan suaraku") agar media dapat berjalan dengan lancar.

## 7. Saran Tumpukan Teknologi (Tech Stack)
* **Frontend:** HTML5, CSS3, JavaScript murni (Vanilla JS) atau React/Vue jika ingin lebih interaktif.
* **Animasi:** Lottie (untuk animasi kotak kado/bunga) atau AOS (*Animate On Scroll*) / GSAP untuk efek saat menggulir halaman.
* **Hosting:** Vercel, Netlify, atau GitHub Pages (Gratis, cepat, dan mudah untuk web statis).