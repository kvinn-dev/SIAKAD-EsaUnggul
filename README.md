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

## 2. Catatan Perbandingan Kinerja REST API vs SOAP API

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

## 3. Panduan Pengujian API Menggunakan Postman / SoapUI

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
  "userId": "usr_mhs",
  "email": "mahasiswa@esaunggul.ac.id",
  "message": "Kode OTP telah dikirim ke email terdaftar Anda."
}
```

#### 2. Dapatkan Rencana Studi Mahasiswa
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/courses`
* **Header**: `Authorization: Bearer token_usr_mhs`
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
         <sia:nim>20240801XXX</sia:nim>
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
            <sia:id>usr_mhs</sia:id>
            <sia:nim>20240801XXX</sia:nim>
            <sia:name>Nama Mahasiswa</sia:name>
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
         <sia:nim>20240801XXX</sia:nim>
      </sia:GetStudentGradesRequest>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## 4. Cara Menjalankan Project Secara Lokal

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
