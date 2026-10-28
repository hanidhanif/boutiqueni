# 🚀 Panduan SEO Lengkap Step-by-Step — BoutiqueNi

**Website:** https://hanidhanif.github.io/boutiqueni/  
**Repo:** https://github.com/hanidhanif/boutiqueni

ZIP ini sudah berisi semua file SEO yang diperlukan + website siap deploy.

---

## FILE YANG SUDAH DISERTAKAN DI ZIP INI

| File | Fungsi |
|------|--------|
| `index.html` | Halaman utama + meta SEO lengkap + Open Graph + Twitter Card + JSON-LD Schema |
| `robots.txt` | Mengizinkan semua crawler + menunjuk ke sitemap |
| `sitemap.xml` | Sitemap (homepage) |
| `favicon.ico`, `favicon.svg`, `favicon-16x16.png`, `favicon-32x32.png` | Favicon multi-ukuran |
| `apple-touch-icon.png` | Icon iOS (180×180) |
| `android-chrome-192x192.png` & `android-chrome-512x512.png` | Icon Android / PWA |
| `site.webmanifest` | Manifest untuk "Add to Home Screen" |
| `og-share.jpg` | Gambar Open Graph (1200×630) untuk share di WhatsApp, Facebook, Instagram, X, LinkedIn |
| `style.css`, `script.js`, `config.js` | Frontend website |
| `assets/` | Gambar hero, about, dan produk |

---

## LANGKAH 1: Deploy Ulang ke GitHub Pages (WAJIB)

1. Download ZIP ini → ekstrak semuanya.
2. Buka repo GitHub: https://github.com/hanidhanif/boutiqueni
3. Hapus / ganti file-file lama dengan file dari ZIP ini (paling penting: `index.html`, `robots.txt`, `sitemap.xml`, semua favicon, `og-share.jpg`, `site.webmanifest`, folder `assets/`).
4. Commit & Push ke branch `main`.
5. Tunggu 1–5 menit, lalu cek:
   - https://hanidhanif.github.io/boutiqueni/
   - https://hanidhanif.github.io/boutiqueni/robots.txt
   - https://hanidhanif.github.io/boutiqueni/sitemap.xml
   - Favicon muncul di tab browser.

**Cara cepat via GitHub web:**
- Klik **Add file** → **Upload files**
- Drag semua file dari ZIP
- Commit changes

---

## LANGKAH 2: Google Search Console (PALING PENTING)

1. Buka: **https://search.google.com/search-console**
2. Klik **Add property** → pilih **URL prefix**
3. Masukkan: `https://hanidhanif.github.io/boutiqueni/`
4. Verifikasi kepemilikan (pilih salah satu):
   - **HTML tag** (paling mudah): Google kasih meta tag → copy → tempel di `<head>` `index.html` (setelah meta description) → push lagi → klik Verify.
   - Atau **HTML file** upload (sudah ada beberapa file verifikasi di repo lama, bisa dipakai).
5. Setelah **Verified**:
   - Menu kiri → **Sitemaps**
   - Submit: `https://hanidhanif.github.io/boutiqueni/sitemap.xml`
   - Lalu buka **URL Inspection** → masukkan homepage → **Request Indexing**

**Tips:** Request indexing bisa dilakukan berulang setiap ada perubahan besar.

---

## LANGKAH 3: Bing Webmaster Tools (Sangat Direkomendasikan)

1. Buka: **https://www.bing.com/webmasters**
2. Sign in dengan akun Microsoft
3. **Add a site** → masukkan `https://hanidhanif.github.io/boutiqueni/`
4. Verifikasi (bisa **Import from Google Search Console** — paling cepat)
5. Submit sitemap yang sama.

---

## LANGKAH 4: Cek Preview Share (Open Graph)

Setelah deploy, wajib "scrape ulang" agar gambar share terbaru muncul:

| Platform | Link Tool | Aksi |
|----------|-----------|------|
| Facebook / WhatsApp / Instagram | https://developers.facebook.com/tools/debug/ | Masukkan URL → **Scrape Again** |
| LinkedIn | https://www.linkedin.com/post-inspector/ | Inspect → cek gambar |
| X / Twitter | https://cards-dev.twitter.com/validator | atau cukup share langsung |
| Telegram | Cukup share link di chat | biasanya langsung ambil OG |

**Gambar OG yang dipakai:** `og-share.jpg` (sudah 1200×630, bagus).

---

## LANGKAH 5: Google Analytics 4 (Sangat Direkomendasikan)

1. Buka: **https://analytics.google.com/**
2. Buat **Property** baru (GA4) untuk BoutiqueNi
3. Dapatkan **Measurement ID** (bentuknya `G-XXXXXXXXXX`)
4. Edit `index.html`, tambahkan kode ini **sebelum** `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

5. Ganti `G-XXXXXXXXXX` dengan ID kamu → push lagi.

---

## LANGKAH 6: Tools Pengecekan SEO (Lakukan Setelah Deploy)

1. **PageSpeed Insights**  
   https://pagespeed.web.dev/  
   → masukkan URL website → cek skor Mobile & Desktop

2. **Rich Results Test (Schema)**  
   https://search.google.com/test/rich-results  
   → cek apakah ClothingStore & WebSite terdeteksi

3. **Mobile-Friendly Test**  
   https://search.google.com/test/mobile-friendly

4. **Meta Tags Checker**  
   https://metatags.io/  
   → preview Open Graph

5. **robots.txt Tester** (di Search Console)  
   Settings → robots.txt Tester

---

## LANGKAH 7: Optimasi Lanjutan (Opsional tapi Powerful)

### A. Custom Domain (sangat disarankan)
Kalau nanti beli domain (contoh: `boutiqueni.com`):
1. Di GitHub repo → Settings → Pages → Custom domain
2. Update semua URL di:
   - `index.html` (canonical, og:url, JSON-LD)
   - `robots.txt`
   - `sitemap.xml`
3. Buat property baru di Search Console dengan domain baru

### B. Google Business Profile
Jika ada toko fisik / COD area tertentu:
https://business.google.com/

### C. Social Media Links di Schema
Edit bagian JSON-LD di `index.html`, isi `"sameAs"` dengan link Instagram & TikTok asli:

```json
"sameAs": [
  "https://instagram.com/username_kamu",
  "https://tiktok.com/@username_kamu"
]
```

### D. Product Schema (jika ingin rich result produk)
Karena produk dinamis dari Google Sheets, ini lebih advanced. Bisa ditambahkan nanti lewat JavaScript jika diperlukan.

---

## CHECKLIST SETELAH DEPLOY

- [ ] Website hidup: https://hanidhanif.github.io/boutiqueni/
- [ ] robots.txt bisa dibuka
- [ ] sitemap.xml bisa dibuka
- [ ] Favicon muncul di tab browser
- [ ] Share ke WhatsApp → gambar + judul + deskripsi bagus
- [ ] Google Search Console → Property Verified
- [ ] Sitemap submitted di Search Console
- [ ] Request Indexing sudah dilakukan
- [ ] (Opsional) Google Analytics terpasang
- [ ] (Opsional) Bing Webmaster Tools sudah submit sitemap

---

## Catatan Penting

- Website ini Single Page Application (SPA). Sitemap hanya berisi homepage — sudah cukup.
- Produk di-load dari Google Sheets via Apps Script. SEO on-page sudah bagus di level homepage.
- Jangan taruh password / API key rahasia di file frontend (config.js hanya boleh berisi URL Web App yang publik).
- Update `lastmod` di `sitemap.xml` setiap kali ada perubahan besar, lalu Request Indexing lagi.

---

Semoga BoutiqueNi segera muncul di pencarian Google untuk kata kunci seperti "busana muslimah elegan", "gamis wanita", dll!

Kalau butuh bantuan lanjutan (custom domain, blog, product schema per item, optimasi kecepatan, dsb) tinggal tanya lagi.

Sukses selalu untuk BoutiqueNi! ✨
