# 💻 Panduan Menjalankan Aplikasi Secara Lokal

Panduan ini mengasumsikan Anda memiliki **Node.js, npm, dan PostgreSQL** yang berjalan di mesin host Anda.

## I. Setup Awal (Backend & Frontend)

1.  **Clone Repositori dan Instal Dependencies:**
    Lakukan instalasi dependencies untuk frontend dan backend.

    ```bash

    # Instal Backend
    cd backend
    npm install

    # Instal Frontend
    cd ../frontend
    npm install
    ```

2.  **Siapkan Variabel .env :**
    Pastikan file **`.env`** di folder **`backend`** sudah ada (tinggal menyesuaikan dengan .env.local):

    ```dotenv
    # backend/.env
    # DB_HOST = 'localhost' untuk menjalankan PostgreSQL secara lokal
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=elibrary
    DB_USER=postgres
    DB_PASSWORD=password # Pastikan sesuai dengan password PostgreSQL lokal anda
    # ... variabel lain (template ada pada .env.local)
    ```

3.  **Inisialisasi Database:**
    Jalankan skrip _setup_ backend untuk membuat database, tabel, dan data awal di PostgreSQL lokal Anda.

    ```bash
    cd backend
    npm run setup
    # Output yang diharapkan: Membuat tabel users, books, favorites, dan seeding data awal.
    ```

---

## II. Menjalankan Backend (Server API)

Setelah database terinisialisasi, jalankan server API.

1.  **Lokasi:** Dari folder `backend`.
2.  **Perintah:**
    ```bash
    npm run dev
    ```
3.  **Akses:**
    Server akan berjalan di **`http://localhost:5000`**.

---

## III. Menjalankan Frontend (React/Vite)

Untuk menjalankan frontend, Anda akan menggunakan perintah `vite` dan mengandalkan proxy yang sudah dikonfigurasi di `vite.config.js`.

1.  **Pastikan Konfigurasi Proxy Benar:**
    Periksa file `frontend/vite.config.js` anda:

    ```javascript
    // frontend/vite.config.js
    // ...
    server: {
      proxy: {
        "/api": {
          // HARUS menunjuk ke alamat backend lokal anda
          target: "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
    // ...
    ```

2.  **Lokasi:** Dari folder `frontend`.

3.  **Perintah:**

    ```bash
    npm run dev
    ```

4.  **Akses:**
    Aplikasi frontend akan berjalan di **`http://localhost:5173`**.

Koneksi: Frontend (`localhost:5173`) akan menggunakan _proxy_ untuk meneruskan permintaan `/api` ke Backend (`localhost:5000`).

---

## IV. Dokumentasi API

Dokumentasi API sudah dilampirkan dengan format postman `.json`. Terdapat 2 file yaitu collection API dan environtmentnya. Silahkan import kedua file tersebut ke postman anda.

---

## 📚 Panduan Aplikasi E-Library

Aplikasi ini adalah platform perpustakaan digital modern yang dibangun dengan _frontend_ **React.js** dan _backend_ **Node.js**.

### 🎯 Fitur Utama dan Alur Pengguna (Paling Penting)

Bagian ini mencakup langkah-langkah penting yang diambil pengguna untuk mengakses dan menggunakan fungsi utama perpustakaan.

- **🔐 Autentikasi:** Landasan untuk mengakses fitur yang dipersonalisasi.
  - **Daftar** akun baru atau **Masuk** (_Login_) menggunakan **token JWT** yang aman.
  - _Akun Demo:_ **Admin** (`admin@example.com`) atau **Pengguna** (`user@example.com`) dengan kata sandi `Admin123`.
- **📚 Penjelajahan dan Pencarian Buku:** Tujuan utama dari perpustakaan.
  - **Telusuri Buku:** Akses katalog buku publik.
  - **Cari Buku:** Temukan judul dengan cepat berdasarkan **judul atau deskripsi**.
  - **Lihat Detail Buku:** Tampilkan informasi lengkap untuk setiap judul.
- **❤️ Sistem Favorit:** Fitur personalisasi penting bagi pengguna.
  - **Tambah ke Favorit:** Simpan buku yang menarik ke koleksi pribadi.
  - **Daftar Favorit:** Kelola dan lihat semua buku yang telah Anda simpan dengan mudah.

---

### 👤 Pengelolaan User & Admin

Fitur-fitur ini mencakup aspek pemeliharaan dan personalisasi aplikasi.

- **🛠️ Pengelolaan Buku Admin (Akses Admin):** Fungsi inti untuk pemeliharaan platform.
  - **Unggah Admin:** Tambahkan buku baru beserta gambar (khusus Admin).
  - **Edit & Hapus:** Kelola dan perbarui konten buku (khusus Admin).
- **⚙️ Profil & Pengaturan Pengguna:** Kontrol personalisasi dan akun.
  - **Manajemen Profil:** Perbarui informasi pribadi dan email.
  - **Dashboard Pribadi:** Lihat aktivitas Anda dan kelola preferensi.

---

### 💻 Teknis dan Desain

Penyebutan singkat tentang teknologi dan desain untuk memberikan konteks.

- **🎨 Antarmuka Pengguna (UI):** Memastikan pengalaman yang hebat di perangkat apa pun.
  - **Desain Responsif & Ramah Seluler (_Mobile-Friendly_):** Dioptimalkan untuk semua ukuran layar.
- **🛠️ Teknologi (_Tech Stack_):** Teknologi yang digunakan.
  - **Frontend:** **React.js**, **Vite**, **Tailwind CSS**.
  - **Backend:** **Node.js** dengan **Express.js**, **PostgreSQL** (Database), **JWT** (Autentikasi), dan **bcrypt** (Hasing Kata Sandi).

---
