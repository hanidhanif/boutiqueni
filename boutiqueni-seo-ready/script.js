/**
 * BoutiqueNi — Frontend
 * Produk dari Google Sheets via Apps Script API
 * Admin: klik logo 4× → login → CRUD
 */

(function () {
  'use strict';

  const cfg = window.BOUTIQUENI_CONFIG || {};
  const API_URL = cfg.API_URL || '';
  const TIMEOUT = cfg.REQUEST_TIMEOUT || 20000;
  const TOKEN_KEY = 'boutiqueni_admin_token';

  // ---------- DOM refs ----------
  const navbar = document.getElementById('navbar');
  const menu = document.getElementById('menuToggle');
  const back = document.getElementById('backTop');
  const logo = document.getElementById('logoClick');
  const productsGrid = document.getElementById('productsGrid');
  const productsLoading = document.getElementById('productsLoading');
  let boutiqueProducts = [];
  let cart = JSON.parse(localStorage.getItem('boutiqueni_cart') || '[]');

  const loginOverlay = document.getElementById('loginOverlay');
  const loginForm = document.getElementById('loginForm');
  const loginClose = document.getElementById('loginClose');
  const loginError = document.getElementById('loginError');
  const adminPassword = document.getElementById('adminPassword');

  const adminOverlay = document.getElementById('adminOverlay');
  const adminClose = document.getElementById('adminClose');
  const adminTableBody = document.getElementById('adminTableBody');
  const btnAddProduct = document.getElementById('btnAddProduct');
  const btnLogout = document.getElementById('btnLogout');

  const formOverlay = document.getElementById('formOverlay');
  const productForm = document.getElementById('productForm');
  const formClose = document.getElementById('formClose');
  const formCancel = document.getElementById('formCancel');
  const formTitle = document.getElementById('formTitle');
  const formError = document.getElementById('formError');

  // ---------- Helpers ----------
  function formatPrice(n) {
    const num = Number(n) || 0;
    return 'Rp' + num.toLocaleString('id-ID');
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getToken() {
    try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
  }

  function setToken(t) {
    try {
      if (t) sessionStorage.setItem(TOKEN_KEY, t);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch (e) {}
  }

  /**
   * Panggil Apps Script Web App.
   * GET untuk baca publik; POST (text/plain) untuk aksi yang butuh body
   * agar tidak kena preflight CORS yang ketat.
   */
  async function api(action, payload) {
    if (!API_URL || API_URL.indexOf('YOUR_DEPLOYMENT_ID') !== -1) {
      throw new Error('Belum set API_URL di config.js. Deploy Apps Script dulu, lalu tempel Web App URL.');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      let url = API_URL;
      let opts = { signal: controller.signal, redirect: 'follow' };

      if (!payload || action === 'products' || action === 'list' || action === 'ping') {
        url += (url.indexOf('?') >= 0 ? '&' : '?') + 'action=' + encodeURIComponent(action || 'products');
        opts.method = 'GET';
      } else {
        opts.method = 'POST';
        opts.headers = { 'Content-Type': 'text/plain;charset=utf-8' };
        opts.body = JSON.stringify(Object.assign({ action: action }, payload || {}));
      }

      const res = await fetch(url, opts);
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Respons API tidak valid. Pastikan Web App di-deploy sebagai "Anyone".');
      }
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  // ---------- Public products ----------
  function renderProducts(products) {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';
    boutiqueProducts = Array.isArray(products) ? products : [];

    if (!products || !products.length) {
      productsGrid.innerHTML = '<div class="products-empty">Belum ada produk. Silakan tambah lewat panel admin.</div>';
      return;
    }

    products.forEach(function (p) {
      const article = document.createElement('article');
      article.className = 'product reveal';
      const badge = p.badge ? '<span>' + escapeHtml(p.badge) + '</span>' : '';
      const img = escapeHtml(p.imageUrl || 'assets/gamis-ayleen.jpg');
      article.innerHTML =
        '<div class="product-img">' +
          '<img src="' + img + '" alt="' + escapeHtml(p.name) + '" loading="lazy">' +
          badge +
        '</div>' +
        '<h3>' + escapeHtml(p.name) + '</h3>' +
        '<p>' + escapeHtml(p.subtitle || '') + '</p>' +
        '<strong>' + formatPrice(p.price) + '</strong>' +
          '<button class="add-cart-btn" type="button" data-product-index="' + products.indexOf(p) + '">＋ Tambah ke Keranjang</button>';
      productsGrid.appendChild(article);
    });

    // re-observe reveal
    document.querySelectorAll('.product.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  async function loadPublicProducts() {
    if (productsLoading) productsLoading.textContent = 'Memuat koleksi…';
    try {
      const data = await api('products');
      if (data && data.ok) {
        renderProducts(data.products);
      } else {
        throw new Error((data && data.error) || 'Gagal memuat produk');
      }
    } catch (err) {
      console.warn(err);
      if (productsGrid) {
        productsGrid.innerHTML =
          '<div class="products-empty">Tidak bisa memuat koleksi.<br><small>' +
          escapeHtml(err.message) +
          '</small><br><br>Pastikan API_URL di config.js sudah diisi Web App URL Apps Script.</div>';
      }
    }
  }

  // ---------- Navbar / UI dasar ----------
  if (menu) {
    menu.addEventListener('click', function () {
      navbar.classList.toggle('open');
    });
  }
  document.querySelectorAll('nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      navbar.classList.remove('open');
    });
  });
  window.addEventListener('scroll', function () {
    if (back) back.classList.toggle('show', window.scrollY > 450);
  });
  if (back) {
    back.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---------- Auto-scroll idle ----------
  (function autoScroll() {
    const IDLE_DELAY = 2000;
    const SCROLL_STEP = 0.7;
    const SCROLL_INTERVAL = 16;
    const TOP_RESET_DURATION = 450;
    let idleTimer;
    let autoScrollTimer = null;
    let resettingToTop = false;

    function stop() {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    }
    function start() {
      stop();
      if (document.documentElement.scrollHeight <= window.innerHeight) return;
      autoScrollTimer = setInterval(function () {
        if (resettingToTop) return;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= maxScroll - 2) {
          resettingToTop = true;
          stop();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(function () {
            resettingToTop = false;
            start();
          }, TOP_RESET_DURATION);
          return;
        }
        window.scrollBy(0, SCROLL_STEP);
      }, SCROLL_INTERVAL);
    }
    function register() {
      stop();
      resettingToTop = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(start, IDLE_DELAY);
    }
    ['mousemove', 'mousedown', 'wheel', 'touchstart', 'touchmove', 'keydown', 'pointerdown'].forEach(function (ev) {
      window.addEventListener(ev, register, { passive: true });
    });
    window.addEventListener('scroll', function () {
      if (!resettingToTop && autoScrollTimer) return;
      register();
    }, { passive: true });
    register();
  })();

  // ---------- Logo 4× click → admin ----------
  let logoClicks = 0;
  let logoClickTimer = null;

  if (logo) {
    logo.addEventListener('click', function (e) {
      // biarkan navigasi #home tetap jalan, tapi hitung klik
      logoClicks += 1;
      clearTimeout(logoClickTimer);
      logoClickTimer = setTimeout(function () {
        logoClicks = 0;
      }, 1200);

      if (logoClicks >= 4) {
        e.preventDefault();
        logoClicks = 0;
        openAdminEntry();
      }
    });
  }

  function openAdminEntry() {
    const token = getToken();
    if (token) {
      openAdminPanel();
    } else {
      openLogin();
    }
  }

  function openLogin() {
    if (loginError) {
      loginError.hidden = true;
      loginError.textContent = '';
    }
    if (adminPassword) adminPassword.value = '';
    loginOverlay.hidden = false;
    setTimeout(function () {
      if (adminPassword) adminPassword.focus();
    }, 50);
  }

  function closeLogin() {
    loginOverlay.hidden = true;
  }

  if (loginClose) loginClose.addEventListener('click', closeLogin);
  if (loginOverlay) {
    loginOverlay.addEventListener('click', function (e) {
      if (e.target === loginOverlay) closeLogin();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (loginError) {
        loginError.hidden = true;
        loginError.textContent = '';
      }
      const pwd = (adminPassword && adminPassword.value) || '';
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Memeriksa…';
      }
      try {
        const data = await api('login', { password: pwd });
        if (!data.ok) throw new Error(data.error || 'Login gagal');
        setToken(data.token);
        closeLogin();
        openAdminPanel();
      } catch (err) {
        if (loginError) {
          loginError.textContent = err.message || 'Login gagal';
          loginError.hidden = false;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Masuk';
        }
      }
    });
  }

  // ---------- Admin panel ----------
  async function openAdminPanel() {
    adminOverlay.hidden = false;
    await refreshAdminTable();
  }

  function closeAdminPanel() {
    adminOverlay.hidden = true;
  }

  if (adminClose) adminClose.addEventListener('click', closeAdminPanel);
  if (adminOverlay) {
    adminOverlay.addEventListener('click', function (e) {
      if (e.target === adminOverlay) closeAdminPanel();
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', async function () {
      const token = getToken();
      try { await api('logout', { token: token }); } catch (e) {}
      setToken('');
      closeAdminPanel();
    });
  }

  async function refreshAdminTable() {
    adminTableBody.innerHTML = '<tr><td colspan="7" class="admin-empty">Memuat…</td></tr>';
    try {
      const data = await api('listAll', { token: getToken() });
      if (!data.ok) {
        if (data.code === 401) {
          setToken('');
          closeAdminPanel();
          openLogin();
          return;
        }
        throw new Error(data.error || 'Gagal memuat');
      }
      renderAdminRows(data.products || []);
    } catch (err) {
      adminTableBody.innerHTML =
        '<tr><td colspan="7" class="admin-empty">' + escapeHtml(err.message) + '</td></tr>';
    }
  }

  function renderAdminRows(products) {
    if (!products.length) {
      adminTableBody.innerHTML = '<tr><td colspan="7" class="admin-empty">Belum ada produk. Klik "+ Tambah Produk".</td></tr>';
      return;
    }
    adminTableBody.innerHTML = products.map(function (p) {
      const badge = p.badge
        ? '<span class="admin-badge">' + escapeHtml(p.badge) + '</span>'
        : '—';
      const aktif = p.active ? 'Ya' : 'Tidak';
      return (
        '<tr data-id="' + escapeHtml(p.id) + '">' +
          '<td>' + escapeHtml(p.sortOrder) + '</td>' +
          '<td><strong>' + escapeHtml(p.name) + '</strong></td>' +
          '<td>' + escapeHtml(p.subtitle || '') + '</td>' +
          '<td>' + formatPrice(p.price) + '</td>' +
          '<td>' + badge + '</td>' +
          '<td>' + aktif + '</td>' +
          '<td class="admin-actions">' +
            '<button type="button" data-action="edit">Edit</button>' +
            '<button type="button" data-action="delete" class="danger">Hapus</button>' +
          '</td>' +
        '</tr>'
      );
    }).join('');

    adminTableBody.querySelectorAll('button[data-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const tr = btn.closest('tr');
        const id = tr && tr.getAttribute('data-id');
        if (!id) return;
        const product = products.find(function (x) { return String(x.id) === String(id); });
        if (btn.getAttribute('data-action') === 'edit' && product) {
          openProductForm(product);
        } else if (btn.getAttribute('data-action') === 'delete') {
          deleteProduct(id, product && product.name);
        }
      });
    });
  }

  if (btnAddProduct) {
    btnAddProduct.addEventListener('click', function () {
      openProductForm(null);
    });
  }

  // ---------- Product form (create / update) ----------
  function openProductForm(product) {
    formError.hidden = true;
    formError.textContent = '';
    formTitle.textContent = product ? 'Edit Produk' : 'Tambah Produk';
    document.getElementById('productId').value = product ? product.id : '';
    document.getElementById('fName').value = product ? (product.name || '') : '';
    document.getElementById('fSubtitle').value = product ? (product.subtitle || '') : '';
    document.getElementById('fPrice').value = product ? (product.price || '') : '';
    document.getElementById('fBadge').value = product ? (product.badge || '') : '';
    document.getElementById('fCategory').value = product ? (product.category || '') : '';
    document.getElementById('fSort').value = product ? (product.sortOrder || 1) : 1;
    document.getElementById('fImage').value = product ? (product.imageUrl || '') : '';
    document.getElementById('fActive').checked = product ? !!product.active : true;
    formOverlay.hidden = false;
  }

  function closeProductForm() {
    formOverlay.hidden = true;
  }

  if (formClose) formClose.addEventListener('click', closeProductForm);
  if (formCancel) formCancel.addEventListener('click', closeProductForm);
  if (formOverlay) {
    formOverlay.addEventListener('click', function (e) {
      if (e.target === formOverlay) closeProductForm();
    });
  }

  if (productForm) {
    productForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      formError.hidden = true;
      const id = document.getElementById('productId').value;
      const product = {
        name: document.getElementById('fName').value.trim(),
        subtitle: document.getElementById('fSubtitle').value.trim(),
        price: Number(document.getElementById('fPrice').value) || 0,
        badge: document.getElementById('fBadge').value.trim(),
        category: document.getElementById('fCategory').value.trim(),
        sortOrder: Number(document.getElementById('fSort').value) || 0,
        imageUrl: document.getElementById('fImage').value.trim(),
        active: document.getElementById('fActive').checked
      };

      const submitBtn = productForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan…';
      }

      try {
        let data;
        if (id) {
          data = await api('update', { token: getToken(), id: id, product: product });
        } else {
          data = await api('create', { token: getToken(), product: product });
        }
        if (!data.ok) {
          if (data.code === 401) {
            setToken('');
            closeProductForm();
            closeAdminPanel();
            openLogin();
            return;
          }
          throw new Error(data.error || 'Gagal menyimpan');
        }
        closeProductForm();
        await refreshAdminTable();
        await loadPublicProducts();
      } catch (err) {
        formError.textContent = err.message || 'Gagal menyimpan';
        formError.hidden = false;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Simpan';
        }
      }
    });
  }

  async function deleteProduct(id, name) {
    if (!confirm('Hapus produk "' + (name || id) + '"?\nTindakan ini tidak bisa dibatalkan.')) return;
    try {
      const data = await api('delete', { token: getToken(), id: id });
      if (!data.ok) {
        if (data.code === 401) {
          setToken('');
          closeAdminPanel();
          openLogin();
          return;
        }
        throw new Error(data.error || 'Gagal menghapus');
      }
      await refreshAdminTable();
      await loadPublicProducts();
    } catch (err) {
      alert(err.message || 'Gagal menghapus');
    }
  }


  // ---------- Keranjang & checkout ----------
  const CART_KEY = 'boutiqueni_cart';
  const CART_WA_NUMBER = '6285215834532'; // WhatsApp resmi BoutiqueNi
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsEl = document.getElementById('cartItems');
  const cartCountEl = document.getElementById('cartCount');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutForm = document.getElementById('checkoutForm');
  function rupiah(n) { return 'Rp' + (Number(n)||0).toLocaleString('id-ID'); }
  function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCart(); }
  function openCart() { if (cartOverlay) cartOverlay.hidden = false; renderCart(); }
  function closeCart() { if (cartOverlay) cartOverlay.hidden = true; }
  function renderCart() {
    if (cartCountEl) cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
    if (cartItemsEl) {
      cartItemsEl.innerHTML = cart.length ? cart.map((it,i)=>
        '<div class="cart-item"><div><b>'+escapeHtml(it.name)+'</b><small>'+rupiah(it.price)+'</small><div class="qty-control"><button type="button" data-cart-action="minus" data-index="'+i+'">−</button><span>'+it.qty+'</span><button type="button" data-cart-action="plus" data-index="'+i+'">＋</button></div></div><b>'+rupiah(it.price*it.qty)+'</b><button class="remove-cart" type="button" data-cart-action="remove" data-index="'+i+'">×</button></div>'
      ).join('') : '<div class="cart-empty"><span>♡</span><h3>Keranjang masih kosong</h3><p>Yuk, pilih koleksi favoritmu.</p></div>';
    }
    if (cartTotalEl) cartTotalEl.textContent = rupiah(cart.reduce((s,i)=>s+i.price*i.qty,0));
  }
  document.addEventListener('click', function(e) {
    const add=e.target.closest('.add-cart-btn');
    if(add) {
      const p=boutiqueProducts[Number(add.dataset.productIndex)]; if(!p)return;
      const id=String(p.id||p.name), found=cart.find(x=>x.id===id);
      if(found) found.qty++; else cart.push({id,name:String(p.name||'Produk'),price:Number(p.price)||0,qty:1});
      saveCart(); add.textContent='✓ Ditambahkan';
      setTimeout(()=>{if(add.isConnected)add.textContent='＋ Tambah ke Keranjang';},1000); return;
    }
    const act=e.target.closest('[data-cart-action]');
    if(act) {
      const i=Number(act.dataset.index); if(!cart[i])return;
      if(act.dataset.cartAction==='plus')cart[i].qty++;
      else if(act.dataset.cartAction==='minus')cart[i].qty--;
      if(act.dataset.cartAction==='remove'||cart[i].qty<=0)cart.splice(i,1);
      saveCart();
    }
  });
  document.getElementById('openCart')?.addEventListener('click',openCart);
  document.getElementById('closeCart')?.addEventListener('click',closeCart);
  cartOverlay?.addEventListener('click',e=>{if(e.target===cartOverlay)closeCart();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart();});
  checkoutForm?.addEventListener('submit',function(e){
    e.preventDefault(); if(!cart.length){alert('Keranjang masih kosong.');return;}
    const fd=new FormData(checkoutForm);
    const methods={transfer_bca:'Transfer Bank BCA',transfer_mandiri:'Transfer Bank Mandiri',transfer_bni:'Transfer Bank BNI',qris:'QRIS',gopay:'GoPay',ovo:'OVO',dana:'DANA',shopeepay:'ShopeePay',cod:'COD (Bayar di Tempat)'};
    const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
    const items=cart.map(i=>`• ${i.name} × ${i.qty} — ${rupiah(i.price*i.qty)}`).join('\n');
    const msg=`Halo BoutiqueNi, saya ingin memesan:\n\n${items}\n\nTotal produk: ${rupiah(total)}\nNama: ${fd.get('customerName')}\nNo. HP: ${fd.get('customerPhone')}\nAlamat: ${fd.get('customerAddress')}\nMetode pembayaran: ${methods[fd.get('paymentMethod')]}\nCatatan: ${fd.get('customerNote')||'-'}\n\nMohon konfirmasi ongkir, total akhir, dan instruksi pembayaran.`;
    window.open('https://wa.me/'+CART_WA_NUMBER+'?text='+encodeURIComponent(msg),'_blank','noopener');
  });
  renderCart();

  // ---------- Init ----------
  loadPublicProducts();
})();
