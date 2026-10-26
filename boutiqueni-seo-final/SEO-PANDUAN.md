# 🚀 Panduan SEO Lengkap — BoutiqueNi

Website: https://hanidhanif.github.io/boutiqueni/

## File SEO yang sudah termasuk di ZIP ini

- `robots.txt` — mengizinkan crawler + menunjuk ke sitemap
- `sitemap.xml` — daftar halaman utama
- `favicon.ico`, `favicon.svg`, `favicon-16x16.png`, `favicon-32x32.png`
- `apple-touch-icon.png` (180×180)
- `android-chrome-192x192.png` & `android-chrome-512x512.png`
- `site.webmanifest` — untuk PWA / home screen
- `og-share.jpg` — Open Graph image (1200×630)
- `googled7adaee314ca48c3.html` — file verifikasi Google Search Console (contoh)
- `index.html` sudah dilengkapi:
  - Meta robots, keywords, author, theme-color
  - Favicon links lengkap
  - Open Graph + Twitter Card
  - Canonical URL
  - JSON-LD Structured Data (ClothingStore + WebSite)

---

## LANGKAH 1: Deploy ulang ke GitHub Pages

1. Download ZIP ini dan ekstrak.
2. Ganti / upload semua file ke repo GitHub kamu (`hanidhanif/boutiqueni`) di branch `main`.
3. Commit & push.
4. Tunggu 1–5 menit, lalu cek:
   - https://hanidhanif.github.io/boutiqueni/
   - https://hanidhanif.github.io/boutiqueni/robots.txt
   - https://hanidhanif.github.io/boutiqueni/sitemap.xml
   - Favicon muncul di tab browser.

---

## LANGKAH 2: Google Search Console (PALING PENTING)

1. Buka: https://search.google.com/search-console
2. Klik **Add property** → pilih **URL prefix** → masukkan:
   ```
   https://hanidhanif.github.io/boutiqueni/
   ```
3. Verifikasi kepemilikan:
   - **Cara termudah**: pilih **HTML tag**. Google akan kasih meta tag, copy dan tempel di dalam `<head>` index.html, commit & push, lalu klik Verify.
   - Atau pakai **HTML file** (file `googled7adaee314ca48c3.html` sudah ada di ZIP — upload ke root repo lalu Verify).
4. Setelah verified:
   - Masuk ke menu **Sitemaps** → submit:
     ```
     https://hanidhanif.github.io/boutiqueni/sitemap.xml
     ```
   - Gunakan **URL Inspection** → masukkan homepage → **Request Indexing**.

---

## LANGKAH 3: Bing Webmaster Tools (opsional tapi bagus)

1. https://www.bing.com/webmasters
2. Add site → `https://hanidhanif.github.io/boutiqueni/`
3. Verifikasi (bisa **Import from Google Search Console**).
4. Submit sitemap yang sama.

---

## LANGKAH 4: Cek Open Graph & Share Preview

Setelah deploy, jalankan tool berikut agar cache update:

- Facebook / WhatsApp / Instagram:  
  https://developers.facebook.com/tools/debug/  
  → masukkan URL website → **Scrape Again**

- Twitter / X:  
  https://cards-dev.twitter.com/validator

- LinkedIn:  
  https://www.linkedin.com/post-inspector/

---

## LANGKAH 5: Google Analytics 4 (sangat direkomendasikan)

1. Buat property di: https://analytics.google.com/
2. Dapatkan Measurement ID (`G-XXXXXXXX`)
3. Tambahkan di `index.html` sebelum `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>
```

---

## LANGKAH 6: Tools Cek Kualitas

| Tool | Link |
|------|------|
| PageSpeed Insights | https://pagespeed.web.dev/ |
| Rich Results Test | https://search.google.com/test/rich-results |
| Mobile-Friendly Test | https://search.google.com/test/mobile-friendly |
| Schema Markup Validator | https://validator.schema.org/ |

---

## LANGKAH 7: Google Business Profile (jika ada COD / area tertentu)

- https://business.google.com/

---

## Checklist cepat setelah deploy

- [ ] robots.txt bisa diakses
- [ ] sitemap.xml bisa diakses
- [ ] Favicon muncul di tab
- [ ] Share ke WhatsApp → gambar OG muncul bagus
- [ ] Google Search Console → property verified + sitemap submitted + Request Indexing
- [ ] (Opsional) Google Analytics terpasang
- [ ] (Opsional) Bing Webmaster sudah ditambahkan

---

## Catatan penting

- Kalau nanti pakai **domain custom** (contoh: boutiqueni.com), update semua URL di:
  - `index.html` (canonical, og:url, JSON-LD)
  - `sitemap.xml`
  - `robots.txt`
  - `site.webmanifest`
- Lalu set custom domain di GitHub Pages Settings dan buat property baru di Search Console.

Semoga website BoutiqueNi segera naik di pencarian Google!
