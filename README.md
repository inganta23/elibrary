Tentu, saya akan mengubah semua instruksi Anda untuk menjalankan aplikasi secara **lokal (tanpa Docker)**.

Ini akan mencakup panduan yang diperbarui untuk backend (memastikan koneksi ke `localhost`) dan panduan baru untuk frontend (memastikan proxy dan server berjalan di host Anda).

---

# 💻 Panduan Menjalankan Aplikasi Secara Lokal (Tanpa Docker)

Panduan ini mengasumsikan Anda memiliki **Node.js, npm, dan PostgreSQL** yang berjalan di mesin host Anda.

## I. 🌐 Setup Awal (Backend & Frontend)

1.  **Clone Repositori dan Instal Dependencies:**
    Lakukan instalasi dependencies untuk kedua bagian proyek Anda.

    ```bash
    # Asumsi struktur:
    # /project
    #   ├── backend/
    #   └── elibrary-frontend/

    # Instal Backend
    cd backend
    npm install

    # Instal Frontend
    cd ../frontend
    npm install
    ```

2.  **Siapkan Variabel Lingkungan (`.env`):**
    Pastikan file **`.env`** di folder **`backend`** sudah ada dan diatur untuk koneksi lokal:

    ```dotenv
    # backend/.env
    # DB_HOST harus 'localhost' karena Anda menjalankan PostgreSQL secara lokal
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=elibrary
    DB_USER=postgres
    DB_PASSWORD=password # Pastikan sesuai dengan password PostgreSQL lokal Anda
    # ... variabel lain
    ```

3.  **Inisialisasi Database:**
    Jalankan skrip _setup_ backend untuk membuat database, tabel, dan data awal di PostgreSQL lokal Anda.

    ```bash
    cd backend
    npm run setup
    # Output yang diharapkan: Membuat tabel users, books, favorites, dan seeding data awal.
    ```

---

## II. 📦 Menjalankan Backend (Server API)

Setelah database terinisialisasi, jalankan server API di mode pengembangan.

1.  **Lokasi:** Dari folder `backend`.
2.  **Perintah:**
    ```bash
    npm run dev
    ```
3.  **Akses:**
    Server akan berjalan di **`http://localhost:5000`**.

---

## III. 🖥️ Menjalankan Frontend (React/Vite)

Untuk menjalankan frontend, Anda akan menggunakan perintah `vite` dan mengandalkan proxy yang sudah dikonfigurasi di `vite.config.js`.

1.  **Pastikan Konfigurasi Proxy Benar:**
    Periksa file `elibrary-frontend/vite.config.js` Anda:

    ```javascript
    // elibrary-frontend/vite.config.js
    // ...
    server: {
      proxy: {
        "/api": {
          // HARUS menunjuk ke alamat backend lokal Anda
          target: "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
    // ...
    ```

2.  **Lokasi:** Dari folder `elibrary-frontend`.

3.  **Perintah:**

    ```bash
    npm run dev
    ```

4.  **Akses:**
    Aplikasi frontend akan berjalan di **`http://localhost:5173`**.

Koneksi: Frontend (`localhost:5173`) akan menggunakan _proxy_ untuk meneruskan permintaan `/api` ke Backend (`localhost:5000`).

---

Apakah Anda ingin saya membantu memastikan file `.env` untuk frontend Anda, jika ada, sudah diatur dengan benar untuk konsumsi API?
