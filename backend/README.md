# 🚀 E-Library Backend Installation Guide

Dokumen ini menjelaskan dua cara untuk menjalankan aplikasi backend: menggunakan Docker (direkomendasikan) dan menjalankan secara lokal.

## 1\. 🐳 Run with Docker (Recommended)

Metode ini menggunakan Docker Compose untuk membangun dan menjalankan backend bersama dengan database PostgreSQL dalam lingkungan yang terisolasi.

### 📝 Prerequisites

- **Docker** dan **Docker Compose** terinstal.
- File konfigurasi: **`.env.docker`** (sudah tersedia).

### 🛠️ Steps

1.  **Clone Repository & Navigate:**

    ```bash
    git clone <URL_REPO_ANDA>
    cd <nama_folder_project>
    ```

2.  **Build and Start Services:**
    Gunakan `docker compose` dengan _flag_ `--env-file` untuk memuat konfigurasi Docker yang benar (`DB_HOST=postgres`).

    ```bash
    # Build image dan jalankan kontainer. Ini akan otomatis menjalankan setup database.
    docker compose --env-file .env.docker up --build
    ```

    > 💡 **Penting:** Perintah ini menjalankan `start-dev-setup`, yang secara otomatis akan:

    > 1.  Menunggu PostgreSQL siap.
    > 2.  Menjalankan `npm run setup` (membuat tabel dan seeding data).
    > 3.  Memulai server dengan `nodemon` (`npm run dev`).

3.  **Access:**
    Backend API akan berjalan di **`http://localhost:5000`**.

4.  **Stop:**
    Untuk menghentikan dan menghapus kontainer (tapi mempertahankan data volume):

    ```bash
    docker compose down
    ```

---

## 2\. 💻 Run Locally

Metode ini menjalankan server Node.js langsung di mesin host Anda.

### 📝 Prerequisites

- **Node.js (v18+)** dan **npm** terinstal.
- **PostgreSQL** terinstal dan berjalan secara lokal (default port `5432`).
- File konfigurasi: **`.env`** (sudah tersedia, menggunakan `DB_HOST=localhost`).

### 🛠️ Steps

1.  **Clone Repository & Install Dependencies:**

    ```bash
    git clone <URL_REPO_ANDA>
    cd <nama_folder_project>
    npm install
    ```

2.  **Ensure Local `.env` is Ready:**
    Pastikan file **`.env`** sudah ada dan nilai `DB_USER` dan `DB_PASSWORD` sesuai dengan kredensial PostgreSQL lokal Anda.

3.  **Setup Database (Create Tables & Seed Data):**
    Jalankan skrip _setup_ untuk membuat database, tabel, dan data awal di PostgreSQL lokal Anda.

    ```bash
    npm run setup
    ```

4.  **Start Server (Development Mode):**
    Mulai server backend menggunakan `nodemon` untuk _live-reloading_.

    ```bash
    npm run dev
    ```

5.  **Access:**
    Backend API akan berjalan di **`http://localhost:5000`**.

---

## 📚 Database Configuration

Aplikasi ini menggunakan **dua file `.env`** untuk memisahkan konfigurasi:

| File              | Digunakan Untuk               | `DB_HOST`                        |
| :---------------- | :---------------------------- | :------------------------------- |
| **`.env.docker`** | **Docker Compose**            | `postgres` (Nama layanan Docker) |
| **`.env`**        | **Local Run** (`npm run dev`) | `localhost` (Alamat mesin host)  |
