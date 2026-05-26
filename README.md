# Dokumen Teknis & Panduan SIAKAD Esa Unggul

Selamat datang di **SIAKAD Esa Unggul - Portal Akademik & Prototype Middleware Benchmark**. Project full-stack ini dirancang khusus untuk memenuhi standar akademik mahasiswa Universitas Esa Unggul, menyajikan portal mahasiswa modern yang dilengkapi dengan utilitas penelitian komparatif untuk mengukur kinerja **REST API (JSON)** dan **SOAP Web Services (XML)** yang terintegrasi melalui middleware **WSO2 Enterprise Service Bus (ESB)**.

---

## 1. Arsitektur Sistem & Aliran Integasi ESB

Dashboard SIAKAD dirancang mengikuti arsitektur **Service-Oriented Architecture (SOA)**, di mana seluruh permintaan data mahasiswa disalurkan melalui gateway terpusat yang mensimulasikan **WSO2 Carbon ESB**.

```
                           +----------------------------------------+
                           |       SIAKAD Frontend Portal (React)   |
                           +----------------------------------------+
                                               |
                     +-------------------------+-------------------------+
                     | (Permintaan dilewatkan melalui Gateway)            |
                     v                                                   v
      +-------------------------------------------------------------------------+
      |               WSO2 Carbon API Gateway / Enterprise Service Bus          |
      |-------------------------------------------------------------------------|
      | - Menganalisis Pola URI (/api/* atau /soap)                             |
      | - Memeriksa token otorisasi Bearer                                      |
      | - Mencatat overhead perutean pesan (Simulator Latensi ESB 4-9ms)        |
      | - Menyisipkan Gateway Headers (e.g. X-Gateway-Server: WSO2-Carbon...)   |
      +-------------------------------------------------------------------------+
                                               |
                     +-------------------------+-------------------------+
                     | (Routing ke Layanan Internal)                      |
                     v                                                   v
      +----------------------------+                       +-----------------------------+
      |     REST API Service       |                       |      SOAP XML Service       |
      |----------------------------|                       |-----------------------------|
      | - REST Controller          |                       | - SOAP XML Parser Core      |
      | - Output JSON Ringkas      |                       | - WSDL Contract Control     |
      | - Pencatatan Log Performa  |                       | - Soap-Envelope generator   |
      +----------------------------+                       +-----------------------------+
                     |                                                   |
                     +-------------------------+-------------------------+
                                               |
                                               v
                              +---------------------------------+
                              |   Database Relasional (SQLite)  |
                              |   *Skema DDL MySQL Terlampir    |
                              +---------------------------------+
```

### Penjelasan Komponen Integrasi WSO2 ESB:
- **Client Application**: Frontend React melakukan request pemanggilan data akademik. Di halaman *API Performance*, pengguna bisa mencentang/menonaktifkan proxy **WSO2 ESB**.
- **WSO2 Gateway Intermediary**: Ketika dilewatkan, rute request akan diubah dari `/api/...` menjadi `/wso2/api/...`. Node server mengestimasi overhead transformasi pesan di WSO2 sebesar **4ms - 9ms** dan menyuntikkan header otentik `X-Gateway-Server: WSO2-Carbon-ESB-v5.3.0` ke client client.

---

## 2. Skema Database Relasional (MySQL DDL)

Berikut adalah struktur **11 Tabel Relasional** yang didefinisikan sesuai panduan untuk mengelola data akademik SIAKAD. Skema ini dapat langsung di-import ke server MySQL utama Anda:

```sql
-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `nim` VARCHAR(20) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `passwordHash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `role` ENUM('mahasiswa', 'admin') DEFAULT 'mahasiswa',
  `is_verified` TINYINT(1) DEFAULT 0,
  `two_fa_enabled` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_nim` (`nim`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Student Profiles
CREATE TABLE IF NOT EXISTS `student_profiles` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `faculty` VARCHAR(100) NOT NULL,
  `study_program` VARCHAR(100) NOT NULL,
  `semester` INT DEFAULT 1,
  `address` TEXT,
  `photo` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Courses (Mata Kuliah)
CREATE TABLE IF NOT EXISTS `courses` (
  `id` VARCHAR(50) NOT NULL,
  `course_code` VARCHAR(20) NOT NULL UNIQUE,
  `course_name` VARCHAR(150) NOT NULL,
  `lecturer_name` VARCHAR(150) NOT NULL,
  `credits` INT NOT NULL,
  `semester` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_courses_code` (`course_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Student Courses (Kartu Rencana Studi)
CREATE TABLE IF NOT EXISTS `student_courses` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `course_id` VARCHAR(50) NOT NULL,
  `academic_year` VARCHAR(20) NOT NULL,
  `semester` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel Schedules (Jadwal Kuliah)
CREATE TABLE IF NOT EXISTS `schedules` (
  `id` VARCHAR(50) NOT NULL,
  `course_id` VARCHAR(50) NOT NULL,
  `day` VARCHAR(15) NOT NULL,
  `start_time` VARCHAR(10) NOT NULL,
  `end_time` VARCHAR(10) NOT NULL,
  `room` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabel Attendances (Presensi Kuliah)
CREATE TABLE IF NOT EXISTS `attendances` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `course_id` VARCHAR(50) NOT NULL,
  `meeting_number` INT NOT NULL,
  `status` ENUM('Hadir', 'Izin', 'Sakit', 'Alpha') NOT NULL,
  `date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tabel Grades (Nilai Studi)
CREATE TABLE IF NOT EXISTS `grades` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `course_id` VARCHAR(50) NOT NULL,
  `assignment_score` DECIMAL(5,2) DEFAULT 0.00,
  `quiz_score` DECIMAL(5,2) DEFAULT 0.00,
  `midterm_score` DECIMAL(5,2) DEFAULT 0.00,
  `final_score` DECIMAL(5,2) DEFAULT 0.00,
  `final_grade` DECIMAL(5,2) DEFAULT 0.00,
  `letter_grade` VARCHAR(5) DEFAULT 'E',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Tabel Payments (Administrasi Keuangan)
CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `invoice_code` VARCHAR(50) NOT NULL UNIQUE,
  `payment_type` ENUM('BPP', 'SKS', 'UTS', 'UAS', 'Praktikum', 'Denda') NOT NULL,
  `amount` INT NOT NULL,
  `due_date` DATE NOT NULL,
  `status` ENUM('Lunas', 'Belum Lunas', 'Menunggu Verifikasi') DEFAULT 'Belum Lunas',
  `proof_file` VARCHAR(255) DEFAULT NULL,
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Tabel Notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('akademik', 'pembayaran', 'absensi', 'nilai', 'sistem', 'pengumuman') NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Tabel OTP Codes
CREATE TABLE IF NOT EXISTS `otp_codes` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `otp_code` VARCHAR(10) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `is_used` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Tabel API Performance Logs
CREATE TABLE IF NOT EXISTS `api_performance_logs` (
  `id` VARCHAR(50) NOT NULL,
  `api_type` ENUM('REST', 'SOAP') NOT NULL,
  `endpoint` VARCHAR(255) NOT NULL,
  `method` VARCHAR(50) NOT NULL,
  `response_time_ms` DECIMAL(10,2) NOT NULL,
  `status_code` INT NOT NULL,
  `payload_size_bytes` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 3. Catatan Perbandingan Kinerja REST API vs SOAP API

Hasil studi komparasi yang dikumpulkan oleh prototype ini mendapati kesimpulan fundamental sebagai berikut:

| Parameter Evaluasi | RESTful API | SOAP API (Web Services) |
| :--- | :--- | :--- |
| **Format Serialisasi** | JSON (JavaScript Object Notation) | XML (Extensible Markup Language) |
| **Response Time (ms)** | Sangat Cepat (rata-rata **5ms - 15ms**) | Lebih Lambat (rata-rata **20ms - 50ms**) |
| **Ukuran Payload (Bytes)** | Lebih Kecil (Contoh: **800 s.d. 1.200 B**) | Lebih Besar (Contoh: **2.500 s.d. 4.000 B**) |
| **Overhead Protokol** | Minimal (Tanpa envelop tambahan) | Berat (Memerlukan Envelope, Header, Body XML) |
| **Kontrak Layanan** | Informal (Menggunakan panduan Swagger) | Formal & Ketat (Ditentukan lewat file **WSDL**) |
| **Keamanan Transaksi** | Fleksibel (SSL/TLS, JWT Token) | Standar Ketat (WS-Security bawaan) |
| **Kompatibilitas** | Ideal untuk Web modern & Aplikasi Mobile | Ideal untuk Sistem Perbankan & Enterprise Lama |

---

## 4. Panduan Pengujian API Menggunakan Postman / SoapUI

Seluruh rute backend SIAKAD berjalan di port 3000. Dokumen kontrak **WSDL** SOAP dinamis dapat diunduh di alamat: `http://localhost:3000/soap/wsdl`.

### A. Pengujian REST API (Postman)

#### 1. Login Akun Mahasiswa
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/auth/login`
* **JSON Body**:
```json
{
  "username": "mahasiswa@esaunggul.ac.id",
  "password": "password123"
}
```
* **Response Sukses (Requires OTP)**:
```json
{
  "success": true,
  "requires_otp": true,
  "userId": "usr_kevin",
  "email": "mahasiswa@esaunggul.ac.id",
  "message": "Kode OTP telah dikirim ke email terdaftar Anda."
}
```

#### 2. Dapatkan Rencana Studi Mahasiswa
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/courses`
* **Header**: `Authorization: Bearer token_usr_kevin`
* **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "crs_1",
      "course_code": "INF201",
      "course_name": "Pemrograman Web Enterprise",
      "lecturer_name": "Ir. Hendra Kusuma, M.Kom.",
      "credits": 3,
      "semester": 4
    }
  ]
}
```

---

### B. Pengujian SOAP API (Postman / SoapUI)

Pemanggilan SOAP API mewajibkan pengiriman dokumen XML bermodel SOAP Envelope menggunakan method `POST`:

#### 1. Ambil Profil Mahasiswa (GetStudentProfile)
* **Method**: `POST`
* **URL**: `http://localhost:3000/soap`
* **Headers**: 
  * `Content-Type`: `text/xml`
* **XML SOAP Body**:
```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sia="http://esaunggul.ac.id/siakad">
   <soapenv:Header/>
   <soapenv:Body>
      <sia:GetStudentProfileRequest>
         <sia:nim>20240801273</sia:nim>
      </sia:GetStudentProfileRequest>
   </soapenv:Body>
</soapenv:Envelope>
```

* **Response SOAP XML**:
```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sia="http://esaunggul.ac.id/siakad">
   <soapenv:Body>
      <sia:GetStudentProfileResponse>
         <sia:status>SUCCESS</sia:status>
         <sia:profile>
            <sia:id>usr_kevin</sia:id>
            <sia:nim>20240801273</sia:nim>
            <sia:name>Kevin Yulian Pamungkas</sia:name>
            <sia:email>mahasiswa@esaunggul.ac.id</sia:email>
            <sia:faculty>Fasikom (Fakultas Ilmu Komputer)</sia:faculty>
            <sia:study_program>Teknik Informatika</sia:study_program>
            <sia:semester>4</sia:semester>
         </sia:profile>
      </sia:GetStudentProfileResponse>
   </soapenv:Body>
</soapenv:Envelope>
```

#### 2. Ambil Nilai Transkrip Mahasiswa (GetStudentGrades)
* **Method**: `POST`
* **URL**: `http://localhost:3000/soap`
* **Headers**: 
  * `Content-Type`: `text/xml`
* **XML SOAP Body**:
```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sia="http://esaunggul.ac.id/siakad">
   <soapenv:Body>
      <sia:GetStudentGradesRequest>
         <sia:nim>20240801273</sia:nim>
      </sia:GetStudentGradesRequest>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## 5. Cara Menjalankan Project Secara Lokal

Untuk menjalankan prototype full-stack akademik ini, ikuti perintah konsol berikut:

1. **Instalasi Dependensi** (Sudah disiapkan oleh platform):
   ```bash
   npm install
   ```
2. **Jalankan dalam Mode Development** (Memulai server Express + Vite di port 3000):
   ```bash
   npm run dev
   ```
   Buka peramban pada alamat `http://localhost:3000` untuk berinteraksi langsung dengan UI portal mahasiswa.
3. **Penyusunan Production Build** (Kompilasi React static):
   ```bash
   npm run build
   ```
4. **Menjalankan Server Produksi** (Membuka Express full-stack melayani static `./dist`):
   ```bash
   npm run start
   ```

---
**Dibuat oleh Kevin Yulian Pamungkas untuk Riset Komparatif Middleware Enterprise Service Bus Universitas Esa Unggul - 2026.**
