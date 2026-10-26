# 🚀 Panduan SEO Lengkap — BoutiqueNi

**Website:** https://hanidhanif.github.io/boutiqueni/  
**Repo:** https://github.com/hanidhanif/boutiqueni

Paket ini sudah berisi semua file SEO penting. Kamu tinggal **deploy ulang** lalu ikuti langkah-langkah di bawah.

---

## ✅ File SEO yang sudah termasuk

| File | Fungsi |
|------|--------|
| `robots.txt` | Mengizinkan crawler Google/Bing + menunjuk ke sitemap |
| `sitemap.xml` | Daftar URL penting agar Google lebih cepat menemukan halaman |
| `favicon.ico` + `favicon.svg` + `favicon-16x16.png` + `favicon-32x32.png` | Ikon tab browser |
| `apple-touch-icon.png` | Ikon saat ditambahkan ke home screen iPhone |
| `android-chrome-192x192.png` & `android-chrome-512x512.png` | Ikon Android / PWA |
| `site.webmanifest` | Metadata PWA (nama, warna, ikon) |
| `og-share.jpg` (1200×630) | Gambar yang muncul saat di-share ke WhatsApp, Facebook, Instagram, X, dll |
| `index.html` | Sudah dilengkapi: meta description, keywords, robots, Open Graph, Twitter Card, canonical, JSON-LD (ClothingStore + WebSite) |

---

## LANGKAH 1 — Deploy ulang ke GitHub Pages

1. Download ZIP paket ini, lalu ekstrak.
2. Buka repo GitHub: https://github.com/hanidhanif/boutiqueni
3. Upload / ganti file-file berikut ke **root** repo (branch `main`):
   - `index.html`
   - `style.css`
   - `script.js`
   - `config.js`
   - `robots.txt`
   - `sitemap.xml`
   - `site.webmanifest`
   - semua file `favicon*`
   - `apple-touch-icon.png`
   - `android-chrome-*.png`
   - `og-share.jpg`
   - folder `assets/` (jika belum lengkap)
4. Commit message contoh: `SEO: robots, sitemap, favicon, OG, structured data`
5. Push. Tunggu 1–5 menit.
6. Cek hasil:
   - https://hanidhanif.github.io/boutiqueni/
   - https://hanidhanif.github.io/boutiqueni/robots.txt
   - https://hanidhanif.github.io/boutiqueni/sitemap.xml
   - Favicon muncul di tab browser

**Tip:** Bisa juga clone repo lokal, copy file dari ZIP ke folder clone, lalu `git add . && git commit -m "..." && git push`.

---

## LANGKAH 2 — Google Search Console (PALING PENTING)

Tanpa ini, Google jarang/lambat mengindeks situs GitHub Pages.

1. Buka: **https://search.google.com/search-console**
2. Klik **Add property** → pilih **URL prefix**
3. Masukkan tepat:
   ```
   https://hanidhanif.github.io/boutiqueni/
   ```
4. **Verifikasi kepemilikan** (pilih salah satu):

   **A. HTML tag (paling mudah)**  
   - Google akan kasih 1 baris meta tag, contoh:  
     `<meta name="google-site-verification" content="XXXXXXXX" />`  
   - Tempel di dalam `<head>` `index.html` (boleh di bawah meta description).  
   - Commit + push, tunggu deploy, lalu klik **Verify**.

   **B. HTML file**  
   - Download file HTML yang diberikan Google (nama seperti `googledXXXXXXXX.html`).  
   - Upload ke **root** repo (sama level dengan `index.html`).  
   - Pastikan bisa diakses di:  
     `https://hanidhanif.github.io/boutiqueni/googledXXXXXXXX.html`  
   - Klik **Verify**.

5. Setelah verified:
   - Menu kiri → **Sitemaps** → isi:  
     `https://hanidhanif.github.io/boutiqueni/sitemap.xml` → **Submit**
   - Menu **URL Inspection** → ketik homepage → **Request indexing**

Ulangi Request Indexing setelah perubahan besar.

---

## LANGKAH 3 — Bing Webmaster Tools (sangat disarankan)

1. Buka: **https://www.bing.com/webmasters**
2. Add site → `https://hanidhanif.github.io/boutiqueni/`
3. Verifikasi: pilih **Import from Google Search Console** (paling cepat) atau HTML tag/file.
4. Submit sitemap yang sama.

---

## LANGKAH 4 — Refresh cache Open Graph (WhatsApp / Facebook / Instagram)

Agar gambar `og-share.jpg` muncul benar saat dishare:

1. Buka: **https://developers.facebook.com/tools/debug/**
2. Tempel URL: `https://hanidhanif.github.io/boutiqueni/`
3. Klik **Debug** → lalu **Scrape Again** (lakukan 1–2 kali).

Cek juga:
- LinkedIn: https://www.linkedin.com/post-inspector/
- X/Twitter: share saja di X, atau gunakan card validator lama jika masih ada.

---

## LANGKAH 5 — Google Analytics 4 (sangat direkomendasikan)

1. Buat akun/property di: **https://analytics.google.com/**
2. Dapatkan Measurement ID (bentuk `G-XXXXXXXXXX`)
3. Tambahkan kode ini di `index.html` **sebelum** `</head>`:

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

Ganti `G-XXXXXXXXXX` dengan ID milikmu. Commit & push.

---

## LANGKAH 6 — Cek teknis SEO & performa

Jalankan tool berikut (gratis):

| Tool | Link | Apa yang dicek |
|------|------|----------------|
| PageSpeed Insights | https://pagespeed.web.dev/ | Kecepatan + Core Web Vitals |
| Rich Results Test | https://search.google.com/test/rich-results | Apakah JSON-LD ClothingStore valid |
| Mobile-Friendly Test | https://search.google.com/test/mobile-friendly | Tampilan HP |
| Schema Markup Validator | https://validator.schema.org/ | Structured data |

---

## LANGKAH 7 — (Opsional) Google Business Profile

Jika ada toko fisik / area COD / ingin muncul di Google Maps:

- https://business.google.com/
- Buat profil bisnis (bisa “online only” atau dengan alamat).

---

## LANGKAH 8 — Domain custom (nanti, jika punya)

Jika suatu saat beli domain (contoh `boutiqueni.com`):

1. Di GitHub repo → Settings → Pages → Custom domain → isi domain.
2. Update DNS sesuai petunjuk GitHub.
3. Ganti **semua** URL di:
   - `index.html` (canonical, og:url, JSON-LD)
   - `sitemap.xml`
   - `robots.txt`
4. Buat property baru di Search Console untuk domain tersebut.

---

## Checklist setelah deploy

- [ ] `robots.txt` dan `sitemap.xml` bisa dibuka di browser
- [ ] Favicon muncul di tab
- [ ] Share ke WhatsApp → gambar OG bagus (setelah Scrape Again)
- [ ] Google Search Console: property verified
- [ ] Sitemap submitted di Search Console
- [ ] Request Indexing homepage berhasil
- [ ] (Opsional) Google Analytics terpasang
- [ ] (Opsional) Bing Webmaster verified

---

## Catatan penting

- Situs ini **single-page** (hanya 1 URL utama). Sitemap hanya berisi homepage — itu sudah benar.
- Jangan taruh password / API secret di file frontend (`config.js` hanya berisi URL Web App yang memang publik).
- Setelah update produk besar, update `lastmod` di `sitemap.xml` lalu Request Indexing lagi.
- Ranking Google butuh waktu (beberapa hari sampai minggu) + konten + backlink. SEO teknis di paket ini sudah solid.

---

Semoga BoutiqueNi cepat naik di pencarian Google!  
Kalau butuh bantuan lanjutan (schema produk per item, blog, custom domain, optimasi gambar WebP, dll) tinggal tanya.
