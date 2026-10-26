# BoutiqueNi — Backend Google Sheets + Apps Script

## Apa yang sudah ada di frontend (GitHub Pages)

| Fitur | Keterangan |
|-------|------------|
| Hero + koleksi + about + quote + contact | Halaman publik lengkap |
| Produk dinamis | Diambil dari API Apps Script (`action=products`) |
| Auto-scroll idle | Scroll otomatis saat user diam |
| Admin entry | **Klik logo "BoutiqueNi" 4× berturut-turut** |
| Login admin | Modal password |
| Panel CRUD | List / Tambah / Edit / Hapus produk |
| Token sesi | Disimpan di `sessionStorage` (bukan di file) |
| Config | Hanya `API_URL` di `config.js` — **tidak ada password** |

Password admin & token **hanya** ada di **Script Properties** Apps Script.

---

## Langkah setup backend (sekali saja)

### 1. Buat project Apps Script
1. Buka [script.google.com](https://script.google.com)
2. **New project**
3. Hapus kode default, paste **seluruh isi** `Code.gs`
4. Simpan (Ctrl+S), beri nama project misalnya `BoutiqueNi API`

### 2. Jalankan setup (otomatis buat spreadsheet + header + seed)
1. Di editor, pilih fungsi **`setupBoutiqueNi`** (dropdown di atas)
2. Klik **Run**
3. Otorisasi akun Google kamu (Review permissions → Allow)
4. Buka **View → Logs** (atau Executions) — kamu akan lihat URL spreadsheet yang baru dibuat
5. Password admin otomatis diset: **`Bismillaah`**

Spreadsheet yang dibuat berisi sheet **Products** dengan header:

```
id | name | subtitle | price | badge | category | sortOrder | imageUrl | active | createdAt | updatedAt
```

Plus 5 produk contoh (gambar lokal `assets/...`).

### 3. Deploy sebagai Web App
1. **Deploy → New deployment**
2. Type: **Web app**
3. Description: `BoutiqueNi v1`
4. Execute as: **Me**
5. Who has access: **Anyone**
6. Deploy → salin **Web App URL**  
   Contoh: `https://script.google.com/macros/s/AKfycb.../exec`

### 4. Hubungkan ke frontend (GitHub Pages)
Edit `config.js`:

```js
window.BOUTIQUENI_CONFIG = {
  API_URL: 'https://script.google.com/macros/s/URL_YANG_KAMU_COPY/exec',
  REQUEST_TIMEOUT: 20000
};
```

Commit & push. Selesai.

---

## Cara pakai admin
1. Buka website
2. **Klik logo "BoutiqueNi" empat kali** cepat
3. Masukkan password: **`Bismillaah`**
4. Kelola produk (CRUD)
5. Logout menutup sesi

---

## Ganti password nanti
Di editor Apps Script, jalankan fungsi:

```js
setAdminPassword('PasswordBaruKamu')
```

Semua sesi login lama otomatis invalid.

---

## Endpoint yang didukung

| Action | Method | Auth | Keterangan |
|--------|--------|------|------------|
| `products` / `list` | GET | — | Produk aktif (publik) |
| `ping` | GET | — | Cek API hidup |
| `login` | POST | — | `{ password }` → token |
| `logout` | POST | token | Hapus token |
| `listAll` | POST | token | Semua produk (admin) |
| `create` | POST | token | `{ product }` |
| `update` | POST | token | `{ id, product }` |
| `delete` | POST | token | `{ id }` |

Body POST dikirim sebagai `text/plain` (JSON string) agar tidak kena preflight CORS ketat.

---

## Catatan keamanan
- Password **tidak** pernah ada di file GitHub / frontend.
- Token disimpan di Script Properties + sessionStorage browser (hilang saat tab ditutup).
- Token kadaluarsa setelah 8 jam.
- Siapa pun yang tahu URL Web App bisa **membaca** produk publik (itu memang diinginkan). Hanya yang punya password yang bisa CRUD.
