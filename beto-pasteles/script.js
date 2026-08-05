/* ============================================================
   BETO PASTELES — interacción
   Catálogo, filtros, carrito con persistencia, personalizador
   y micro-interacciones. Sin dependencias.
   ============================================================ */
(function () {
  'use strict';

  var WHATSAPP = '528112345678';           // número de la tienda
  var FREE_SHIPPING = 700;                 // MXN
  var STORE_KEY = 'beto-cart-v1';

  /* ---------------------------------------------------------
     Ilustraciones de producto (SVG en línea)
     --------------------------------------------------------- */
  var BONE = 'M26 4c7 0 12 5 12 11h24c0-6 5-11 12-11s12 5 12 11c0 2-1 4-2 6 1 2 2 4 2 6 0 6-5 11-12 11s-12-5-12-11H38c0 6-5 11-12 11s-12-5-12-11c0-2 1-4 2-6-1-2-2-4-2-6 0-6 5-11 12-11Z';

  /* Dálmata sentado, el personaje de la marca. Ocupa ~80×110 a escala 1. */
  function dog(x, y, k) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')" fill="none" ' +
      'stroke="#14110F" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M97 106c9-1 13-9 11-17"/>' +
      '<path d="M66 54c-15 5-26 17-30 32-3 11-3 21-1 28h60c2-7 3-17 0-28-4-15-14-27-29-32Z" fill="#FBF9F5"/>' +
      '<path d="M53 88c5 7 7 16 7 26M78 88c-4 7-6 16-6 26"/>' +
      '<path d="M50 26c-9-3-16 4-16 13s6 16 13 15" fill="#FBF9F5"/>' +
      '<path d="M83 26c9-3 16 4 16 13s-6 16-13 15" fill="#FBF9F5"/>' +
      '<circle cx="66" cy="34" r="20" fill="#FBF9F5"/>' +
      '<ellipse cx="66" cy="45" rx="10" ry="7" fill="#FBF9F5"/>' +
      '<ellipse cx="66" cy="41" rx="3.6" ry="2.6" fill="#14110F" stroke="none"/>' +
      '<path d="M66 44v4M66 48c-3 3-7 3-9 1M66 48c3 3 7 3 9 1" stroke-width="2"/>' +
      '<circle cx="57" cy="30" r="2.2" fill="#14110F" stroke="none"/>' +
      '<circle cx="75" cy="30" r="2.2" fill="#14110F" stroke="none"/>' +
      '<ellipse cx="52" cy="70" rx="6" ry="4.6" fill="#14110F" stroke="none" transform="rotate(-16 52 70)"/>' +
      '<ellipse cx="76" cy="82" rx="5" ry="3.8" fill="#14110F" stroke="none" transform="rotate(14 76 82)"/>' +
      '<ellipse cx="45" cy="94" rx="4" ry="3" fill="#14110F" stroke="none"/>' +
      '<ellipse cx="83" cy="34" rx="4.4" ry="3.4" fill="#14110F" stroke="none" transform="rotate(20 83 34)"/>' +
      '</g>';
  }

  function wrap(inner) {
    return '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="400" height="400" fill="#FBF9F5"/>' + inner + '</svg>';
  }

  function spot(x, y, rx, ry, rot, op) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry +
      '" transform="rotate(' + rot + ' ' + x + ' ' + y + ')" fill="#14110F"' +
      (op ? ' opacity="' + op + '"' : '') + '/>';
  }

  /* Pastel redondo parametrizable */
  function cake(o) {
    o = o || {};
    var top = o.top || '#F4EBDA';
    var body = o.body || '#FBF9F5';
    var s = '<ellipse cx="200" cy="326" rx="130" ry="20" fill="#14110F" opacity=".07"/>';
    // cuerpo
    s += '<path d="M92 208v88c0 17 48 29 108 29s108-12 108-29v-88Z" fill="' + body +
      '" stroke="#14110F" stroke-width="2.4"/>';
    if (o.sideSpots) {
      s += '<g>' +
        spot(126, 244, 11, 8, -16) + spot(178, 280, 8, 6, 18) + spot(232, 246, 12, 9, -6) +
        spot(282, 284, 7, 5, 22) + spot(296, 236, 9, 7, -24) + spot(150, 302, 6, 5, 8) +
        spot(246, 306, 7, 5, -14) + '</g>';
    }
    // cubierta
    s += '<ellipse cx="200" cy="208" rx="108" ry="30" fill="' + top + '" stroke="#14110F" stroke-width="2.4"/>';
    s += '<ellipse cx="200" cy="208" rx="95" ry="25" fill="none" stroke="#14110F" stroke-width="1.1" opacity=".28"/>';
    // borde de merengue
    var pipe = [[104, 211], [132, 227], [166, 237], [200, 240], [234, 237], [268, 227], [296, 211]];
    s += '<g fill="#F6EFE2" stroke="#14110F" stroke-width="1.5">';
    pipe.forEach(function (p) {
      s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="12" ry="9"/>';
    });
    s += '</g>';
    // topping
    if (o.topping === 'bone') {
      s += '<g transform="translate(150 186)" fill="#DFC49A" stroke="#14110F" stroke-width="2"><path d="' + BONE + '"/></g>';
    } else if (o.topping === 'carrot') {
      s += '<g transform="translate(172 168)" stroke="#14110F" stroke-width="2">' +
        '<path d="M14 18 34 62 54 18Z" fill="#E9AE73"/>' +
        '<path d="M34 18c-6-10-2-16 4-18 2 6 6 8 10 8-2 6-8 10-14 10Z" fill="#B9CBA9"/>' +
        '<path d="M34 18c-6-8-14-10-20-6 4 6 10 8 14 8" fill="#B9CBA9"/></g>';
    } else if (o.topping === 'paw') {
      s += '<g transform="translate(176 168)" fill="#DFC49A" stroke="#14110F" stroke-width="2">' +
        '<ellipse cx="10" cy="14" rx="6" ry="8" transform="rotate(-18 10 14)"/>' +
        '<ellipse cx="28" cy="8" rx="6" ry="8"/>' +
        '<ellipse cx="46" cy="14" rx="6" ry="8" transform="rotate(18 46 14)"/>' +
        '<path d="M28 26c9 0 16 6 16 12s-7 10-16 10-16-4-16-10 7-12 16-12Z"/></g>';
    }
    if (o.name) {
      s += '<text x="200" y="282" text-anchor="middle" font-family="Caveat,cursive" font-size="42" fill="#14110F">' +
        o.name + '</text>';
    }
    return wrap(s);
  }

  /* Galletas de hueso con manchas */
  function boneCookies() {
    var s = '';
    var pos = [[56, 88, -14], [222, 70, 12], [104, 186, 8], [246, 180, -10], [50, 284, 16], [212, 282, -6]];
    pos.forEach(function (p, i) {
      s += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ') scale(1.45)">' +
        '<path d="' + BONE + '" fill="#FDFBF7" stroke="#14110F" stroke-width="2.2"/>' +
        spot(26 + (i % 3) * 3, 15, 4, 3, 12) +
        spot(50, 21 + (i % 2) * 3, 3.4, 2.6, -18) +
        spot(74, 26, 2.8, 2.2, 8) +
        '</g>';
    });
    return wrap(s);
  }

  /* Galletas redondas con patita */
  function roundCookies() {
    var s = '';
    var pos = [[120, 118], [262, 104], [90, 250], [232, 236], [180, 176]];
    pos.forEach(function (p, i) {
      s += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + (i * 17 - 20) + ')">' +
        '<circle r="46" fill="#F0E2CB" stroke="#14110F" stroke-width="2.2"/>' +
        '<circle r="38" fill="none" stroke="#14110F" stroke-width="1" opacity=".25"/>' +
        '<g fill="#14110F" opacity=".8">' +
        '<ellipse cx="-13" cy="-9" rx="5" ry="6.4" transform="rotate(-18 -13 -9)"/>' +
        '<ellipse cx="0" cy="-14" rx="5" ry="6.4"/>' +
        '<ellipse cx="13" cy="-9" rx="5" ry="6.4" transform="rotate(18 13 -9)"/>' +
        '<path d="M0 0c8 0 14 5 14 11s-6 9-14 9-14-3-14-9 6-11 14-11Z"/>' +
        '</g></g>';
    });
    return wrap(s);
  }

  /* Kit: caja + bolsita */
  function kit() {
    var s = '<ellipse cx="200" cy="336" rx="150" ry="20" fill="#14110F" opacity=".07"/>';
    // caja
    s += '<path d="M44 172h176v154H44z" fill="#FFFDF9" stroke="#14110F" stroke-width="2.4"/>';
    s += '<g>' + spot(74, 206, 9, 7, -18) + spot(140, 232, 7, 5, 22) + spot(196, 196, 8, 6, -8) +
      spot(96, 268, 6, 4.6, 12) + spot(168, 288, 9, 6.6, -22) + spot(58, 300, 5, 4, 6) + '</g>';
    s += '<path d="M36 148h192v26H36z" fill="#FFFDF9" stroke="#14110F" stroke-width="2.4"/>';
    s += '<text x="132" y="252" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="27" letter-spacing="2" fill="#14110F">BETO</text>';
    // bolsita de tela con cordón
    s += '<g fill="none" stroke="#14110F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M246 208c0-14 12-24 28-24h58c16 0 28 10 28 24l-8 96c-1 12-10 20-22 20h-54c-12 0-21-8-22-20Z" fill="#F4EFE4"/>' +
      '<path d="M262 186c0-8 3-14 8-19M288 184c-1-7 0-13 3-18M318 184c1-7 0-13-3-18M344 186c0-8-3-14-8-19" stroke-width="2"/>' +
      '<path d="M246 204c18 9 38 12 60 12s42-3 54-12" stroke-width="2"/>' +
      dog(252, 208, 0.86) +
      '</g>';
    return wrap(s);
  }

  /* Mini pasteles */
  function minis() {
    var s = '<ellipse cx="200" cy="322" rx="140" ry="20" fill="#14110F" opacity=".07"/>';
    [[118, '#CFE0D4'], [280, '#E9C7A3']].forEach(function (c, i) {
      var x = c[0];
      s += '<path d="M' + (x - 54) + ' 210 ' + (x - 44) + ' 300c1 8 20 12 44 12s43-4 44-12l10-90Z" fill="#F0E2CB" stroke="#14110F" stroke-width="2.4"/>';
      for (var k = -40; k <= 40; k += 16) {
        s += '<path d="M' + (x + k) + ' 214 ' + (x + k * 0.82) + ' 306" stroke="#14110F" stroke-width="1" opacity=".28" fill="none"/>';
      }
      s += '<path d="M' + (x - 60) + ' 210c0-30 26-52 60-52s60 22 60 52Z" fill="' + c[1] + '" stroke="#14110F" stroke-width="2.4"/>';
      s += '<g transform="translate(' + (x - 47) + ' 146) scale(.95)" fill="#DFC49A" stroke="#14110F" stroke-width="2"><path d="' + BONE + '"/></g>';
      if (i === 1) s += spot(x - 20, 250, 8, 6, -14) + spot(x + 18, 274, 6, 4.6, 18);
    });
    return wrap(s);
  }

  /* Caja sorpresa con moño */
  function surpriseBox() {
    var s = '<ellipse cx="200" cy="330" rx="140" ry="20" fill="#14110F" opacity=".07"/>';
    s += '<path d="M64 168h272v154H64z" fill="#FFFDF9" stroke="#14110F" stroke-width="2.4"/>';
    s += spot(102, 208, 11, 8, -18) + spot(180, 246, 8, 6, 20) + spot(268, 202, 12, 9, -6) +
      spot(300, 274, 7, 5, 14) + spot(126, 292, 9, 6.6, -22) + spot(214, 300, 6, 4.6, 8) +
      spot(232, 190, 5, 4, 26);
    s += '<path d="M56 140h288v30H56z" fill="#FFFDF9" stroke="#14110F" stroke-width="2.4"/>';
    s += '<path d="M190 140h20v182h-20z" fill="#F4EFE4" stroke="#14110F" stroke-width="2"/>';
    s += '<path d="M200 140c-10-22-30-30-44-22-12 7-8 24 10 28 12 3 24 0 34-6Zm0 0c10-22 30-30 44-22 12 7 8 24-10 28-12 3-24 0-34-6Z" fill="#F4EFE4" stroke="#14110F" stroke-width="2.2"/>';
    s += '<circle cx="200" cy="140" r="9" fill="#DFC49A" stroke="#14110F" stroke-width="2.2"/>';
    return wrap(s);
  }

  /* ---------------------------------------------------------
     Catálogo
     --------------------------------------------------------- */
  var PRODUCTS = [
    { id: 'pastel-clasico', name: 'Pastel Clásico', desc: 'Avena, plátano y yogur natural', price: 490, cat: 'pastel', tag: 'Más vendido', art: cake({ name: 'Luna', topping: 'bone' }) },
    { id: 'galletas-yogur', name: 'Galletas de Yogur', desc: 'Crujientes, con cobertura de yogur', price: 220, cat: 'galleta', art: boneCookies() },
    { id: 'kit-cumple', name: 'Kit Cumpleaños', desc: 'Mini pastel, galletas y bolsita', price: 620, cat: 'kit', tag: 'Regalo', art: kit() },
    { id: 'pastel-personalizado', name: 'Pastel Personalizado', desc: 'Con el nombre de tu peludo', price: 590, cat: 'pastel', art: cake({ top: '#CFE0D4', sideSpots: true, topping: 'bone' }) },
    { id: 'galletas-cacahuate', name: 'Galletas de Cacahuate', desc: 'Sin xilitol, con manzana', price: 180, cat: 'galleta', art: roundCookies() },
    { id: 'mini-pasteles', name: 'Mini Pasteles (2 pzas)', desc: 'Porción individual, ideal para dos', price: 340, cat: 'pastel', art: minis() },
    { id: 'caja-dalmata', name: 'Caja Sorpresa Dálmata', desc: 'Selección del mes + juguete', price: 450, cat: 'kit', tag: 'Nuevo', art: surpriseBox() },
    { id: 'pastel-zanahoria', name: 'Pastel de Zanahoria', desc: 'Zanahoria, avena y canela', price: 520, cat: 'pastel', art: cake({ top: '#E9C7A3', topping: 'carrot' }) }
  ];

  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  /* ---------------------------------------------------------
     Utilidades
     --------------------------------------------------------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var mxn = function (n) { return '$' + n.toLocaleString('es-MX') + ' MXN'; };

  var toastEl = $('#toast');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  }

  /* ---------------------------------------------------------
     Rejilla de productos + filtros
     --------------------------------------------------------- */
  var grid = $('#grid');
  var gridEmpty = $('#gridEmpty');
  var showAllBtn = $('#showAll');
  var state = { filter: 'todos', showAll: false };

  function visibleProducts() {
    var list = state.filter === 'todos'
      ? PRODUCTS
      : PRODUCTS.filter(function (p) { return p.cat === state.filter; });
    return (state.filter === 'todos' && !state.showAll) ? list.slice(0, 4) : list;
  }

  function renderGrid() {
    if (!grid) return;
    var list = visibleProducts();
    grid.innerHTML = list.map(function (p, i) {
      return '<article class="card" style="animation-delay:' + (i * 55) + 'ms">' +
        '<div class="card__media">' + p.art +
        (p.tag ? '<span class="card__tag">' + p.tag + '</span>' : '') +
        '<button class="card__add" data-add="' + p.id + '">Agregar al carrito</button>' +
        '</div>' +
        '<div class="card__body">' +
        '<h3 class="card__name">' + p.name + '</h3>' +
        '<p class="card__desc">' + p.desc + '</p>' +
        '<p class="card__price">' + mxn(p.price) + '</p>' +
        '</div></article>';
    }).join('');

    if (gridEmpty) gridEmpty.hidden = list.length > 0;
    if (showAllBtn) {
      var hidden = state.filter === 'todos' && !state.showAll;
      showAllBtn.parentElement.hidden = !hidden && state.filter !== 'todos';
      showAllBtn.innerHTML = (hidden ? 'Ver todos los productos' : 'Ver menos') +
        ' <svg class="ico ico--sm"><use href="#i-paw"/></svg>';
    }
  }

  function setFilter(f) {
    state.filter = f;
    $$('.chip').forEach(function (c) {
      var on = c.dataset.filter === f;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    renderGrid();
  }

  $$('.chip').forEach(function (c) {
    c.addEventListener('click', function () { setFilter(c.dataset.filter); });
  });

  // Los botones "Ver más" de categorías también filtran
  $$('.cat [data-filter]').forEach(function (a) {
    a.addEventListener('click', function () { setFilter(a.dataset.filter); });
  });

  if (showAllBtn) {
    showAllBtn.addEventListener('click', function () {
      state.showAll = !state.showAll;
      renderGrid();
    });
  }

  renderGrid();

  /* ---------------------------------------------------------
     Carrito
     --------------------------------------------------------- */
  var cart = [];
  try {
    var saved = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    if (Array.isArray(saved)) {
      cart = saved.filter(function (l) { return byId[l.id] && l.qty > 0; })
        .map(function (l) { return { id: l.id, qty: Math.min(99, Math.floor(l.qty)) }; });
    }
  } catch (e) { cart = []; }

  var cartEl = $('#cart');
  var overlay = $('#overlay');
  var cartBody = $('#cartBody');
  var cartCount = $('#cartCount');
  var cartTotal = $('#cartTotal');
  var checkoutBtn = $('#checkout');

  function persist() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) { /* modo privado */ }
  }

  function total() {
    return cart.reduce(function (sum, l) { return sum + byId[l.id].price * l.qty; }, 0);
  }

  function renderCart() {
    var count = cart.reduce(function (n, l) { return n + l.qty; }, 0);
    if (cartCount) {
      cartCount.textContent = count;
      cartCount.hidden = count === 0;
    }
    if (cartTotal) cartTotal.textContent = mxn(total());
    if (checkoutBtn) checkoutBtn.disabled = count === 0;

    if (!cartBody) return;
    if (!cart.length) {
      cartBody.innerHTML = '<p class="cart__empty">Todavía no hay nada aquí.<br><span>Tu peludo está esperando.</span></p>';
      return;
    }
    cartBody.innerHTML = cart.map(function (l) {
      var p = byId[l.id];
      return '<div class="citem">' +
        '<div class="citem__media">' + p.art + '</div>' +
        '<div>' +
        '<p class="citem__name">' + p.name + '</p>' +
        '<p class="citem__price">' + mxn(p.price) + '</p>' +
        '<div class="citem__qty">' +
        '<button data-dec="' + p.id + '" aria-label="Quitar uno de ' + p.name + '">−</button>' +
        '<span>' + l.qty + '</span>' +
        '<button data-inc="' + p.id + '" aria-label="Agregar uno de ' + p.name + '">+</button>' +
        '</div></div>' +
        '<button class="citem__rm" data-rm="' + p.id + '">Quitar</button>' +
        '</div>';
    }).join('');
  }

  function add(id, silent) {
    var line = cart.filter(function (l) { return l.id === id; })[0];
    if (line) line.qty = Math.min(99, line.qty + 1);
    else cart.push({ id: id, qty: 1 });
    persist();
    renderCart();
    if (!silent) toast(byId[id].name + ' agregado al carrito');
  }

  function change(id, delta) {
    var line = cart.filter(function (l) { return l.id === id; })[0];
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) cart = cart.filter(function (l) { return l.id !== id; });
    persist();
    renderCart();
  }

  function remove(id) {
    cart = cart.filter(function (l) { return l.id !== id; });
    persist();
    renderCart();
  }

  function openCart() {
    if (!cartEl) return;
    cartEl.classList.add('is-open');
    cartEl.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    var close = $('#cartClose');
    if (close) close.focus();
  }

  function closeCart() {
    if (!cartEl) return;
    cartEl.classList.remove('is-open');
    cartEl.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.hidden = true;
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add],[data-inc],[data-dec],[data-rm]');
    if (!t) return;
    if (t.dataset.add) { add(t.dataset.add); openCart(); }
    else if (t.dataset.inc) change(t.dataset.inc, 1);
    else if (t.dataset.dec) change(t.dataset.dec, -1);
    else if (t.dataset.rm) remove(t.dataset.rm);
  });

  var cartBtn = $('#cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', openCart);
  var cartClose = $('#cartClose');
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      if (!cart.length) return;
      var lines = cart.map(function (l) {
        return '• ' + l.qty + '× ' + byId[l.id].name + ' — ' + mxn(byId[l.id].price * l.qty);
      }).join('\n');
      var t = total();
      var envio = t >= FREE_SHIPPING ? 'Envío gratis 🎉' : 'Envío por cotizar';
      var msg = '¡Hola Beto Pasteles! Quiero hacer este pedido:\n\n' + lines +
        '\n\nTotal: ' + mxn(t) + '\n' + envio;
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  var accountBtn = $('#account');
  if (accountBtn) {
    accountBtn.addEventListener('click', function () {
      toast('Las cuentas llegan pronto — por ahora pedimos por WhatsApp');
    });
  }

  renderCart();

  /* ---------------------------------------------------------
     Personalizador
     --------------------------------------------------------- */
  var form = $('#customForm');
  if (form) {
    var nameInput = $('#petName');
    var cakeName = $('#cakeName');
    var cakeTop = $('#cakeTop');
    var bodySpots = $('#cakeBodySpots');
    var spotted = $('#spotted');
    var priceOut = $('#customPrice');
    var dateInput = $('#petDate');
    var tops = { bone: $('#topBone'), paw: $('#topPaw'), heart: $('#topHeart') };

    // Mínimo 48 h para pedidos personalizados
    if (dateInput) {
      var min = new Date(Date.now() + 48 * 3600 * 1000);
      dateInput.min = min.toISOString().slice(0, 10);
    }

    function syncPreview() {
      if (cakeName) {
        var v = (nameInput.value || '').trim();
        cakeName.textContent = v || 'Luna';
        cakeName.setAttribute('font-size', v.length > 8 ? 32 : v.length > 6 ? 38 : 46);
      }
      var f = form.querySelector('input[name=frosting]:checked');
      if (f && cakeTop) cakeTop.setAttribute('fill', f.dataset.color);

      var t = form.querySelector('input[name=topping]:checked');
      Object.keys(tops).forEach(function (k) {
        if (tops[k]) tops[k].classList.toggle('is-hidden', !t || t.dataset.top !== k);
      });

      if (bodySpots && spotted) bodySpots.classList.toggle('is-hidden', !spotted.checked);

      var size = form.querySelector('input[name=size]:checked');
      var p = size ? parseInt(size.dataset.price, 10) : 390;
      if (spotted && spotted.checked) p += 60;
      if (priceOut) priceOut.textContent = mxn(p);
      form.dataset.price = p;
    }

    form.addEventListener('input', syncPreview);
    form.addEventListener('change', syncPreview);
    syncPreview();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var petName = (d.get('petName') || '').toString().trim() || 'mi peludo';
      var fecha = d.get('date') ? d.get('date') : 'por definir';
      var msg = '¡Hola Beto Pasteles! Quiero un pastel personalizado:\n\n' +
        '• Nombre en el pastel: ' + petName + '\n' +
        '• Tamaño: ' + d.get('size') + '\n' +
        '• Cubierta: ' + d.get('frosting') + '\n' +
        '• Decoración: ' + d.get('topping') + '\n' +
        '• Costados con manchas: ' + (d.get('spotted') ? 'Sí' : 'No') + '\n' +
        '• Fecha: ' + fecha + '\n\n' +
        'Total estimado: ' + mxn(parseInt(form.dataset.price, 10) || 390);
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      toast('Abrimos WhatsApp con tu diseño ✨');
    });
  }

  /* ---------------------------------------------------------
     Newsletter
     --------------------------------------------------------- */
  var newsForm = $('#newsForm');
  if (newsForm) {
    var email = $('#email');
    var newsMsg = $('#newsMsg');
    newsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.value.trim());
      email.classList.toggle('is-error', !ok);
      newsMsg.classList.toggle('is-error', !ok);
      newsMsg.textContent = ok
        ? '¡Listo! Te avisamos de cada horneada nueva. 🐾'
        : 'Revisa tu correo, parece que le falta algo.';
      if (ok) newsForm.reset();
    });
    email.addEventListener('input', function () {
      email.classList.remove('is-error');
      newsMsg.textContent = '';
    });
  }

  /* ---------------------------------------------------------
     Navegación móvil
     --------------------------------------------------------- */
  var burger = $('#burger');
  var nav = $('#nav');
  var header = $('#header');
  if (burger && nav) {
    var toggleNav = function (open) {
      nav.classList.toggle('is-open', open);
      header.classList.toggle('is-navopen', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      burger.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () {
      toggleNav(!nav.classList.contains('is-open'));
    });
    $$('#nav a').forEach(function (a) {
      a.addEventListener('click', function () { toggleNav(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (nav.classList.contains('is-open')) toggleNav(false);
      if (cartEl && cartEl.classList.contains('is-open')) closeCart();
    });
  }

  /* ---------------------------------------------------------
     Header pegajoso + enlace activo
     --------------------------------------------------------- */
  var sections = $$('main section[id]');
  var navLinks = $$('#nav a');
  var onScroll = function () {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
    var y = window.scrollY + 140;
    var current = '';
    sections.forEach(function (s) {
      if (s.offsetTop <= y) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     Reveal al hacer scroll
     --------------------------------------------------------- */
  /* Basado en scroll (y no en IntersectionObserver) para que nada quede
     invisible si el usuario baja de golpe o salta con un ancla. */
  var reveals = $$('.reveal');
  function checkReveals() {
    if (!reveals.length) return;
    var limit = window.innerHeight * 0.94;
    reveals = reveals.filter(function (el) {
      if (el.getBoundingClientRect().top > limit) return true;
      el.classList.add('is-in');
      return false;
    });
  }
  window.addEventListener('scroll', checkReveals, { passive: true });
  window.addEventListener('resize', checkReveals);
  checkReveals();
  // Red de seguridad: nada se queda oculto pase lo que pase.
  setTimeout(function () { $$('.reveal').forEach(function (el) { el.classList.add('is-in'); }); }, 6000);

  /* ---------------------------------------------------------
     Año en el pie
     --------------------------------------------------------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
