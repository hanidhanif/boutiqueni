/**
 * BoutiqueNi — Google Apps Script Backend
 * ========================================
 * Database: Google Spreadsheet (auto-generated)
 * Secret: ADMIN_PASSWORD & tokens di Script Properties (BUKAN di GitHub)
 *
 * SETUP CEPAT:
 * 1. Buat project baru di script.google.com
 * 2. Paste seluruh kode ini ke Code.gs
 * 3. Jalankan fungsi setupBoutiqueNi() sekali (dari editor: pilih setupBoutiqueNi → Run)
 *    → Akan minta otorisasi, lalu otomatis:
 *      - Buat spreadsheet baru "BoutiqueNi Products"
 *      - Buat sheet "Products" + header
 *      - Set password admin = "Bismillaah"
 *      - Seed 5 produk contoh
 * 4. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy Web App URL → tempel ke config.js (API_URL) di GitHub Pages
 *
 * Setelah setup, password bisa diganti lewat fungsi setAdminPassword("password_baru")
 */

// ========== KONSTANTA ==========
var SPREADSHEET_NAME = 'BoutiqueNi Products';
var SHEET_NAME = 'Products';
var PROP_SS_ID = 'SPREADSHEET_ID';
var PROP_PASSWORD = 'ADMIN_PASSWORD';
var PROP_TOKEN_PREFIX = 'TOKEN_';
var TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 jam

// Header kolom (urutan penting — dipakai create/update)
var HEADERS = [
  'id',           // A — UUID
  'name',         // B
  'subtitle',     // C
  'price',        // D — number
  'badge',        // E — NEW / SALE / kosong
  'category',     // F
  'sortOrder',    // G — number
  'imageUrl',     // H
  'active',       // I — TRUE/FALSE
  'createdAt',    // J
  'updatedAt'     // K
];

// ========== ENTRY POINT ==========
function doGet(e) {
  return handleRequest_(e, null);
}

function doPost(e) {
  var body = null;
  try {
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
  } catch (err) {
    return json_({ ok: false, error: 'Body JSON tidak valid' });
  }
  return handleRequest_(e, body);
}

/**
 * Routing aksi.
 * GET  ?action=products|list|ping
 * POST { action, ... }  → login | logout | listAll | create | update | delete | setup
 */
function handleRequest_(e, body) {
  try {
    var action = '';
    if (body && body.action) {
      action = String(body.action);
    } else if (e && e.parameter && e.parameter.action) {
      action = String(e.parameter.action);
    } else {
      action = 'products';
    }

    switch (action) {
      case 'ping':
        return json_({ ok: true, message: 'BoutiqueNi API aktif', time: new Date().toISOString() });

      case 'products':
      case 'list':
        return json_(listPublicProducts_());

      case 'login':
        return json_(login_(body && body.password));

      case 'logout':
        return json_(logout_(body && body.token));

      case 'listAll':
        return json_(listAllProducts_(body && body.token));

      case 'create':
        return json_(createProduct_(body && body.token, body && body.product));

      case 'update':
        return json_(updateProduct_(body && body.token, body && body.id, body && body.product));

      case 'delete':
        return json_(deleteProduct_(body && body.token, body && body.id));

      case 'setup':
        // Hanya boleh dipanggil dari editor (bukan dari web), tapi tetap amankan
        return json_({ ok: false, error: 'Setup hanya dijalankan dari editor Apps Script (fungsi setupBoutiqueNi)' });

      default:
        return json_({ ok: false, error: 'Aksi tidak dikenal: ' + action });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

// ========== SETUP (jalankan sekali dari editor) ==========
/**
 * Jalankan fungsi ini SEKALI dari editor Apps Script.
 * - Membuat spreadsheet baru (atau memakai yang sudah ada di Script Properties)
 * - Membuat sheet + header
 * - Set password admin = Bismillaah
 * - Seed 5 produk contoh
 */
function setupBoutiqueNi() {
  var props = PropertiesService.getScriptProperties();

  // 1. Password admin
  props.setProperty(PROP_PASSWORD, 'Bismillaah');

  // 2. Spreadsheet
  var ss = getOrCreateSpreadsheet_();
  var sheet = getOrCreateProductsSheet_(ss);

  // 3. Seed jika masih kosong (hanya header)
  if (sheet.getLastRow() <= 1) {
    seedSampleProducts_(sheet);
  }

  // Log hasil
  var url = ss.getUrl();
  Logger.log('✅ Setup selesai!');
  Logger.log('Spreadsheet: ' + url);
  Logger.log('Password admin: Bismillaah (tersimpan di Script Properties)');
  Logger.log('Sekarang Deploy → New deployment → Web app (Anyone)');
  return {
    ok: true,
    spreadsheetUrl: url,
    spreadsheetId: ss.getId(),
    message: 'Setup berhasil. Password = Bismillaah. Deploy Web App sekarang.'
  };
}

/**
 * Ganti password admin kapan saja (jalankan dari editor).
 * Contoh: setAdminPassword('PasswordBaru123')
 */
function setAdminPassword(newPassword) {
  if (!newPassword || String(newPassword).length < 4) {
    throw new Error('Password minimal 4 karakter');
  }
  PropertiesService.getScriptProperties().setProperty(PROP_PASSWORD, String(newPassword));
  // Invalidate semua token lama
  clearAllTokens_();
  Logger.log('Password admin diganti. Semua sesi lama di-logout.');
  return { ok: true };
}

// ========== SPREADSHEET HELPERS ==========
function getOrCreateSpreadsheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(PROP_SS_ID);

  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (e) {
      // ID rusak / dihapus → buat baru
    }
  }

  var ss = SpreadsheetApp.create(SPREADSHEET_NAME);
  props.setProperty(PROP_SS_ID, ss.getId());
  return ss;
}

function getSpreadsheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(PROP_SS_ID);
  if (!id) {
    throw new Error('Spreadsheet belum di-setup. Jalankan setupBoutiqueNi() dulu dari editor.');
  }
  return SpreadsheetApp.openById(id);
}

function getOrCreateProductsSheet_(ss) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Pastikan header baris 1 sesuai HEADERS
  var lastCol = sheet.getLastColumn();
  var needHeader = true;
  if (lastCol >= HEADERS.length) {
    var existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    needHeader = false;
    for (var i = 0; i < HEADERS.length; i++) {
      if (String(existing[i]).toLowerCase() !== HEADERS[i].toLowerCase()) {
        needHeader = true;
        break;
      }
    }
  }

  if (needHeader) {
    sheet.clear();
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#641522')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    // Lebar kolom kasar
    sheet.setColumnWidth(1, 280); // id
    sheet.setColumnWidth(2, 180); // name
    sheet.setColumnWidth(3, 160);
    sheet.setColumnWidth(4, 90);
    sheet.setColumnWidth(8, 260); // imageUrl
  }

  // Hapus sheet default "Sheet1" kalau ada dan kosong
  var sheets = ss.getSheets();
  for (var s = 0; s < sheets.length; s++) {
    if (sheets[s].getName() !== SHEET_NAME && sheets[s].getLastRow() === 0) {
      try { ss.deleteSheet(sheets[s]); } catch (e) {}
    }
  }

  return sheet;
}

function getProductsSheet_() {
  var ss = getSpreadsheet_();
  return getOrCreateProductsSheet_(ss);
}

function seedSampleProducts_(sheet) {
  var now = new Date().toISOString();
  var samples = [
    {
      id: Utilities.getUuid(),
      name: 'Gamis Ayleen',
      subtitle: 'Elegant · Maroon',
      price: 289000,
      badge: 'NEW',
      category: 'Gamis',
      sortOrder: 1,
      imageUrl: 'assets/gamis-ayleen.jpg',
      active: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: Utilities.getUuid(),
      name: 'Gamis Hana',
      subtitle: 'Classic · Cokelat',
      price: 275000,
      badge: '',
      category: 'Gamis',
      sortOrder: 2,
      imageUrl: 'assets/gamis-hana.jpg',
      active: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: Utilities.getUuid(),
      name: 'Set Khadijah',
      subtitle: 'Soft · Beige',
      price: 320000,
      badge: 'BEST',
      category: 'Set',
      sortOrder: 3,
      imageUrl: 'assets/set-khadijah.jpg',
      active: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: Utilities.getUuid(),
      name: 'Set Naura',
      subtitle: 'Modest · Taupe',
      price: 310000,
      badge: '',
      category: 'Set',
      sortOrder: 4,
      imageUrl: 'assets/set-naura.jpg',
      active: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: Utilities.getUuid(),
      name: 'Tunik Azzahra',
      subtitle: 'Soft · Dusty Pink',
      price: 245000,
      badge: 'SALE',
      category: 'Tunik',
      sortOrder: 5,
      imageUrl: 'assets/tunik-azzahra.jpg',
      active: true,
      createdAt: now,
      updatedAt: now
    }
  ];

  var rows = samples.map(function (p) {
    return [
      p.id, p.name, p.subtitle, p.price, p.badge, p.category,
      p.sortOrder, p.imageUrl, p.active, p.createdAt, p.updatedAt
    ];
  });
  sheet.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
}

// ========== AUTH ==========
function login_(password) {
  var props = PropertiesService.getScriptProperties();
  var stored = props.getProperty(PROP_PASSWORD);
  if (!stored) {
    // Auto-set default jika belum ada (fallback)
    stored = 'Bismillaah';
    props.setProperty(PROP_PASSWORD, stored);
  }
  if (String(password || '') !== stored) {
    return { ok: false, error: 'Password salah' };
  }

  var token = Utilities.getUuid() + '-' + Utilities.getUuid();
  var expires = Date.now() + TOKEN_TTL_MS;
  props.setProperty(PROP_TOKEN_PREFIX + token, String(expires));

  return { ok: true, token: token, expiresIn: TOKEN_TTL_MS };
}

function logout_(token) {
  if (token) {
    PropertiesService.getScriptProperties().deleteProperty(PROP_TOKEN_PREFIX + token);
  }
  return { ok: true };
}

function requireAuth_(token) {
  if (!token) {
    return { ok: false, code: 401, error: 'Unauthorized' };
  }
  var props = PropertiesService.getScriptProperties();
  var exp = props.getProperty(PROP_TOKEN_PREFIX + token);
  if (!exp) {
    return { ok: false, code: 401, error: 'Sesi tidak valid. Silakan login lagi.' };
  }
  if (Date.now() > Number(exp)) {
    props.deleteProperty(PROP_TOKEN_PREFIX + token);
    return { ok: false, code: 401, error: 'Sesi kadaluarsa. Silakan login lagi.' };
  }
  return { ok: true };
}

function clearAllTokens_() {
  var props = PropertiesService.getScriptProperties();
  var all = props.getProperties();
  var keys = Object.keys(all);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].indexOf(PROP_TOKEN_PREFIX) === 0) {
      props.deleteProperty(keys[i]);
    }
  }
}

// ========== CRUD ==========
function rowToProduct_(row) {
  // row = array 11 elemen sesuai HEADERS
  return {
    id: String(row[0] || ''),
    name: String(row[1] || ''),
    subtitle: String(row[2] || ''),
    price: Number(row[3]) || 0,
    badge: String(row[4] || ''),
    category: String(row[5] || ''),
    sortOrder: Number(row[6]) || 0,
    imageUrl: String(row[7] || ''),
    active: row[8] === true || String(row[8]).toUpperCase() === 'TRUE' || row[8] === '1' || row[8] === 1,
    createdAt: String(row[9] || ''),
    updatedAt: String(row[10] || '')
  };
}

function listPublicProducts_() {
  var sheet = getProductsSheet_();
  var last = sheet.getLastRow();
  if (last < 2) {
    return { ok: true, products: [] };
  }
  var data = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
  var products = [];
  for (var i = 0; i < data.length; i++) {
    var p = rowToProduct_(data[i]);
    if (p.active && p.name) {
      products.push(p);
    }
  }
  // Sort by sortOrder asc
  products.sort(function (a, b) {
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });
  return { ok: true, products: products };
}

function listAllProducts_(token) {
  var auth = requireAuth_(token);
  if (!auth.ok) return auth;

  var sheet = getProductsSheet_();
  var last = sheet.getLastRow();
  if (last < 2) {
    return { ok: true, products: [] };
  }
  var data = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
  var products = data.map(rowToProduct_).filter(function (p) { return !!p.id; });
  products.sort(function (a, b) {
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });
  return { ok: true, products: products };
}

function createProduct_(token, product) {
  var auth = requireAuth_(token);
  if (!auth.ok) return auth;
  if (!product || !product.name) {
    return { ok: false, error: 'Nama produk wajib diisi' };
  }

  var sheet = getProductsSheet_();
  var now = new Date().toISOString();
  var id = Utilities.getUuid();
  var row = [
    id,
    String(product.name || '').trim(),
    String(product.subtitle || '').trim(),
    Number(product.price) || 0,
    String(product.badge || '').trim(),
    String(product.category || '').trim(),
    Number(product.sortOrder) || 0,
    String(product.imageUrl || '').trim(),
    product.active !== false && product.active !== 'false',
    now,
    now
  ];
  sheet.appendRow(row);
  return { ok: true, product: rowToProduct_(row) };
}

function updateProduct_(token, id, product) {
  var auth = requireAuth_(token);
  if (!auth.ok) return auth;
  if (!id) return { ok: false, error: 'ID produk wajib' };
  if (!product || !product.name) {
    return { ok: false, error: 'Nama produk wajib diisi' };
  }

  var sheet = getProductsSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return { ok: false, error: 'Produk tidak ditemukan' };

  var ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  var rowIndex = -1;
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      rowIndex = i + 2; // 1-based, skip header
      break;
    }
  }
  if (rowIndex < 0) return { ok: false, error: 'Produk tidak ditemukan' };

  // Ambil createdAt lama
  var oldCreated = sheet.getRange(rowIndex, 10).getValue();
  var now = new Date().toISOString();
  var row = [
    String(id),
    String(product.name || '').trim(),
    String(product.subtitle || '').trim(),
    Number(product.price) || 0,
    String(product.badge || '').trim(),
    String(product.category || '').trim(),
    Number(product.sortOrder) || 0,
    String(product.imageUrl || '').trim(),
    product.active !== false && product.active !== 'false',
    oldCreated || now,
    now
  ];
  sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([row]);
  return { ok: true, product: rowToProduct_(row) };
}

function deleteProduct_(token, id) {
  var auth = requireAuth_(token);
  if (!auth.ok) return auth;
  if (!id) return { ok: false, error: 'ID produk wajib' };

  var sheet = getProductsSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return { ok: false, error: 'Produk tidak ditemukan' };

  var ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      sheet.deleteRow(i + 2);
      return { ok: true };
    }
  }
  return { ok: false, error: 'Produk tidak ditemukan' };
}

// ========== UTIL ==========
function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
