/**
 * infinityAIR — Wishlist, Offcanvas Cart & Order/Contact Modal
 * ---------------------------------------------------------------
 * Usage:
 *   1. Include this script in any page:
 *        <script src="wishlist-modal.js"></script>
 *   2. Add the mount point anywhere in <body>:
 *        <div id="iair-wishlist-root"></div>
 *   3. Trigger modal programmatically (e.g. CTA buttons):
 *        window.iAIR.openModal('order')   // pre-filled order form
 *        window.iAIR.openModal('contact') // contact form
 *        window.iAIR.addToWishlist({id, name, price, img, category})
 *        window.iAIR.openWishlist()
 */

(function () {
  'use strict';

  /* ─── State ──────────────────────────────────────────────────── */
  const STORAGE_KEY = 'iair_wishlist_v1';

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }
  function saveCart(items) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }

  let cart = loadCart();
  let offcanvasOpen = false;
  let modalOpen = false;
  let modalMode = 'order'; // 'order' | 'contact'

  /* ─── HTML Injection ─────────────────────────────────────────── */
  function inject() {
    const root = document.getElementById('iair-wishlist-root');
    if (!root) return;

    root.innerHTML = `
      <!-- Float Button -->
      <button id="iair-float-btn" aria-label="Lista de desejos" title="Lista de desejos">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span id="iair-badge" class="iair-badge iair-hidden">0</span>
      </button>

      <!-- Offcanvas Wishlist -->
      <div id="iair-overlay" class="iair-overlay"></div>
      <aside id="iair-offcanvas" class="iair-offcanvas" role="dialog" aria-modal="true" aria-label="Lista de desejos">
        <div class="iair-oc-header">
          <div class="iair-oc-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Lista de Desejos
          </div>
          <button id="iair-oc-close" class="iair-oc-close" aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div id="iair-oc-body" class="iair-oc-body"></div>
        <div id="iair-oc-footer" class="iair-oc-footer iair-hidden">
          <div class="iair-oc-total">
            Total estimado: <strong id="iair-total-price">€0,00</strong>
          </div>
          <button id="iair-finalizar-btn" class="iair-btn-primary">
            Finalizar Encomenda
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </aside>

      <!-- Modal -->
      <div id="iair-modal-overlay" class="iair-modal-overlay" role="dialog" aria-modal="true">
        <div id="iair-modal" class="iair-modal">
          <button id="iair-modal-close" class="iair-modal-close" aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div id="iair-modal-inner"></div>
        </div>
      </div>
    `;

    injectStyles();
    bindEvents();
    renderCart();
  }

  /* ─── Styles ─────────────────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('iair-styles')) return;
    const s = document.createElement('style');
    s.id = 'iair-styles';
    s.textContent = `
      :root {
        --iair-accent: var(--base);
        --iair-dark: #0d0d0d;
        --iair-dark2: #161616;
        --iair-border: rgba(255,255,255,0.08);
        --iair-text: #e8e8e8;
        --iair-muted: #888;
        --iair-radius: 14px;
        --iair-oc-w: 420px;
      }
      .iair-hidden { display: none !important; }

      /* Float Button */
      #iair-float-btn {
        position: fixed;
        bottom: 32px;
        right: 32px;
        z-index: 9990;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--base);
        color: var(--iair-dark);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 32px rgba(255, 235, 103, 0.35);
        transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s;
      }
      #iair-float-btn:hover { transform: scale(1.12); box-shadow: 0 12px 40px rgba(201,243,29,.5); }
      #iair-float-btn:active { transform: scale(.96); }
      .iair-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #ff4444;
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #0d0d0d;
        pointer-events: none;
      }

      /* Overlay */
      .iair-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.6);
        backdrop-filter: blur(4px);
        z-index: 9991;
        opacity: 0;
        pointer-events: none;
        transition: opacity .35s;
      }
      .iair-overlay.iair-active { opacity: 1; pointer-events: all; }

      /* Offcanvas */
      .iair-offcanvas {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: min(var(--iair-oc-w), 100vw);
        z-index: 9992;
        background: var(--iair-dark2);
        border-left: 1px solid var(--iair-border);
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform .4s cubic-bezier(.4,0,.2,1);
      }
      .iair-offcanvas.iair-active { transform: translateX(0); }

      .iair-oc-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 24px 20px;
        border-bottom: 1px solid var(--iair-border);
        flex-shrink: 0;
      }
      .iair-oc-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 17px;
        font-weight: 600;
        color: var(--iair-text);
        letter-spacing: -.01em;
      }
      .iair-oc-title svg { color: var(--iair-accent); }
      .iair-oc-close {
        background: transparent;
        border: 1px solid var(--iair-border);
        color: var(--iair-muted);
        border-radius: 8px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all .2s;
      }
      .iair-oc-close:hover { border-color: var(--iair-accent); color: var(--iair-accent); }

      .iair-oc-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px 24px;
        scrollbar-width: thin;
        scrollbar-color: var(--iair-border) transparent;
      }
      .iair-oc-body::-webkit-scrollbar { width: 4px; }
      .iair-oc-body::-webkit-scrollbar-thumb { background: var(--iair-border); border-radius: 2px; }

      .iair-oc-footer {
        padding: 20px 24px 28px;
        border-top: 1px solid var(--iair-border);
        flex-shrink: 0;
      }
      .iair-oc-total {
        color: var(--iair-muted);
        font-size: 14px;
        margin-bottom: 14px;
      }
      .iair-oc-total strong { color: var(--iair-text); font-size: 18px; }

      .iair-btn-primary {
        width: 100%;
        background: var(--iair-accent);
        color: var(--iair-dark);
        border: none;
        border-radius: 10px;
        padding: 14px 20px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all .2s;
        letter-spacing: -.01em;
      }
      .iair-btn-primary:hover { background: #d8ff3a; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(201,243,29,.3); }
      .iair-btn-primary:active { transform: translateY(0); }

      /* Cart Empty State */
      .iair-empty {
        text-align: center;
        padding: 48px 16px;
      }
      .iair-empty svg { color: var(--iair-border); margin-bottom: 16px; }
      .iair-empty p { color: var(--iair-muted); font-size: 15px; }

      /* Cart Item */
      .iair-cart-item {
        display: flex;
        gap: 14px;
        align-items: flex-start;
        padding: 16px 0;
        border-bottom: 1px solid var(--iair-border);
        animation: iairFadeIn .3s ease;
      }
      .iair-cart-item:last-child { border-bottom: none; }
      .iair-cart-img {
        width: 72px;
        height: 72px;
        border-radius: 10px;
        object-fit: cover;
        background: #111;
        flex-shrink: 0;
        border: 1px solid var(--iair-border);
      }
      .iair-cart-info { flex: 1; min-width: 0; }
      .iair-cart-cat {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: .08em;
        color: var(--iair-accent);
        margin-bottom: 4px;
      }
      .iair-cart-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--iair-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 8px;
      }
      .iair-cart-price {
        font-size: 15px;
        font-weight: 700;
        color: var(--iair-accent);
      }
      .iair-cart-controls {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        flex-shrink: 0;
      }
      .iair-qty-wrap {
        display: flex;
        align-items: center;
        gap: 0;
        border: 1px solid var(--iair-border);
        border-radius: 8px;
        overflow: hidden;
      }
      .iair-qty-btn {
        background: transparent;
        border: none;
        color: var(--iair-muted);
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all .15s;
      }
      .iair-qty-btn:hover { background: rgba(255,255,255,.05); color: var(--iair-text); }
      .iair-qty-input {
        background: transparent;
        border: none;
        border-left: 1px solid var(--iair-border);
        border-right: 1px solid var(--iair-border);
        color: var(--iair-text);
        width: 38px;
        height: 30px;
        text-align: center;
        font-size: 13px;
        outline: none;
      }
      .iair-remove-btn {
        background: transparent;
        border: none;
        color: var(--iair-muted);
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        transition: color .15s;
      }
      .iair-remove-btn:hover { color: #ff4444; }

      /* Modal Overlay */
      .iair-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(59, 56, 56, 0.75);
        backdrop-filter: blur(8px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        opacity: 0;
        pointer-events: none;
        transition: opacity .3s;
      }
      .iair-modal-overlay.iair-active { opacity: 1; pointer-events: all; }

      .iair-modal {
        background: #080705;
        border: 1px solid var(--iair-border);
        border-radius: 20px;
        width: 100%;
        max-width: 620px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        transform: translateY(24px) scale(.97);
        transition: transform .35s cubic-bezier(.34,1.56,.64,1);
        scrollbar-width: thin;
        scrollbar-color: var(--iair-border) transparent;
      }
      .iair-modal-overlay.iair-active .iair-modal { transform: translateY(0) scale(1); }

      .iair-modal-close {
        position: sticky;
        top: 16px;
        float: right;
        margin: 16px 16px 0 0;
        background: rgba(255,255,255,.05);
        border: 1px solid var(--iair-border);
        color: var(--iair-muted);
        border-radius: 8px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all .2s;
        z-index: 2;
      }
      .iair-modal-close:hover { border-color: var(--iair-accent); color: var(--iair-accent); }

      /* Modal Inner */
      #iair-modal-inner { padding: 8px 32px 32px; clear: both; }

      .iair-modal-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 6px;
      }
      .iair-modal-logo-dot {
        width: 10px; height: 10px;
        border-radius: 50%;
        background: var(--iair-accent);
      }
      .iair-modal-badge {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: .1em;
        color: var(--iair-accent);
        font-weight: 600;
      }
      .iair-modal-title {
        font-size: 26px;
        font-weight: 700;
        color: var(--iair-text);
        margin-bottom: 6px;
        letter-spacing: -.02em;
        line-height: 1.2;
      }
      .iair-modal-sub {
        color: var(--iair-muted);
        font-size: 14px;
        margin-bottom: 28px;
        line-height: 1.6;
      }

      /* Order Table */
      .iair-order-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 24px;
        font-size: 13px;
      }
      .iair-order-table th {
        text-align: left;
        color: var(--iair-muted);
        font-weight: 500;
        padding: 0 10px 10px 0;
        border-bottom: 1px solid var(--iair-border);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: .06em;
      }
      .iair-order-table td {
        padding: 12px 10px 12px 0;
        border-bottom: 1px solid var(--iair-border);
        color: var(--iair-text);
        vertical-align: middle;
      }
      .iair-order-table td:last-child { color: var(--iair-accent); font-weight: 600; }
      .iair-order-table tr:last-child td { border-bottom: none; }

      /* Form */
      .iair-form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        margin-bottom: 14px;
      }
      .iair-form-row.iair-full { grid-template-columns: 1fr; }
      .iair-form-group { display: flex; flex-direction: column; gap: 6px; }
      .iair-form-group label {
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: .06em;
        color: var(--iair-muted);
      }
      .iair-form-group label span { color: #ff5555; }
      .iair-form-group input,
      .iair-form-group select,
      .iair-form-group textarea {
        background: #212529 !important;
        border: none;
        border-radius: 10px;
        color: var(--iair-text);
        padding: 12px 14px;
        font-size: 14px;
        outline: none;
        transition: border-color .2s, box-shadow .2s;
        resize: vertical;
        font-family: inherit;
        width: 100%;
        box-sizing: border-box;
      }
      .iair-form-group input:focus,
      .iair-form-group select,
      .iair-form-group textarea:focus {
        border-color: var(--iair-accent);
        box-shadow: 0 0 0 3px rgba(201,243,29,.1);
      }
      .iair-form-group input.iair-error,
      .iair-form-group select.iair-error,
      .iair-form-group textarea.iair-error {
        border-color: #ff4444;
        box-shadow: 0 0 0 3px rgba(255,68,68,.1);
      }
      .iair-form-group .iair-err-msg {
        font-size: 11px;
        color: #ff5555;
        display: none;
      }
      .iair-form-group.iair-has-error .iair-err-msg { display: block; }
      .iair-form-group select option { background: #1a1a1a; }

      .iair-modal-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
      }
      .iair-btn-secondary {
        flex: 1;
        background: transparent;
        border: 1px solid var(--iair-border);
        color: var(--iair-muted);
        border-radius: 10px;
        padding: 14px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all .2s;
      }
      .iair-btn-secondary:hover { border-color: var(--iair-text); color: var(--iair-text); }
      .iair-modal-actions .iair-btn-primary { flex: 2; }

      /* Success */
      .iair-success {
        text-align: center;
        padding: 32px 0 16px;
      }
      .iair-success-icon {
        width: 64px;
        height: 64px;
        background: rgba(201,243,29,.12);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
      }
      .iair-success h3 { color: var(--iair-text); font-size: 22px; margin-bottom: 10px; }
      .iair-success p { color: var(--iair-muted); font-size: 14px; line-height: 1.6; }

      @keyframes iairFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (max-width: 480px) {
        :root { --iair-oc-w: 100vw; }
        #iair-modal-inner { padding: 8px 20px 28px; }
        .iair-form-row { grid-template-columns: 1fr; }
        .iair-modal-title { font-size: 22px; }
        #iair-float-btn { bottom: 20px; right: 20px; }
      }
    `;
    document.head.appendChild(s);
  }

  /* ─── Render Cart ─────────────────────────────────────────────── */
  function renderCart() {
    const body = document.getElementById('iair-oc-body');
    const footer = document.getElementById('iair-oc-footer');
    const badge = document.getElementById('iair-badge');
    const totalEl = document.getElementById('iair-total-price');
    if (!body) return;

    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    badge.textContent = count;
    badge.classList.toggle('iair-hidden', count === 0);
    footer.classList.toggle('iair-hidden', cart.length === 0);

    if (totalEl) totalEl.textContent = '€' + total.toFixed(2).replace('.', ',');

    if (cart.length === 0) {
      body.innerHTML = `
        <div class="iair-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p>A sua lista de desejos está vazia.<br>Adicione produtos para começar.</p>
        </div>`;
      return;
    }

    body.innerHTML = cart.map(item => `
      <div class="iair-cart-item" data-id="${esc(item.id)}">
        <img class="iair-cart-img" src="${esc(item.img)}" alt="${esc(item.name)}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2272%22 height=%2272%22><rect width=%2272%22 height=%2272%22 fill=%22%23222%22/></svg>'">
        <div class="iair-cart-info">
          <div class="iair-cart-cat">${esc(item.category || '')}</div>
          <div class="iair-cart-name">${esc(item.name)}</div>
          <div class="iair-cart-price">€${(item.price * item.qty).toFixed(2).replace('.', ',')}</div>
        </div>
        <div class="iair-cart-controls">
          <button class="iair-remove-btn" data-action="remove" data-id="${esc(item.id)}" aria-label="Remover">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
          <div class="iair-qty-wrap">
            <button class="iair-qty-btn" data-action="dec" data-id="${esc(item.id)}">−</button>
            <input class="iair-qty-input" type="number" min="1" max="99" value="${item.qty}" data-action="qty" data-id="${esc(item.id)}" aria-label="Quantidade">
            <button class="iair-qty-btn" data-action="inc" data-id="${esc(item.id)}">+</button>
          </div>
        </div>
      </div>
    `).join('');

    body.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener(el.tagName === 'INPUT' ? 'change' : 'click', handleCartAction);
    });
  }

  function handleCartAction(e) {
    const el = e.currentTarget;
    const action = el.dataset.action;
    const id = el.dataset.id;
    const idx = cart.findIndex(i => i.id === id);
    if (idx === -1) return;

    if (action === 'remove') {
      cart.splice(idx, 1);
    } else if (action === 'inc') {
      cart[idx].qty = Math.min(cart[idx].qty + 1, 99);
    } else if (action === 'dec') {
      if (cart[idx].qty > 1) cart[idx].qty--;
      else cart.splice(idx, 1);
    } else if (action === 'qty') {
      const v = parseInt(el.value, 10);
      if (v > 0 && v <= 99) cart[idx].qty = v;
      else el.value = cart[idx].qty;
    }

    saveCart(cart);
    renderCart();
  }

  /* ─── Offcanvas ──────────────────────────────────────────────── */
  function openWishlist() {
    offcanvasOpen = true;
    document.getElementById('iair-offcanvas').classList.add('iair-active');
    document.getElementById('iair-overlay').classList.add('iair-active');
    document.body.style.overflow = 'hidden';
  }

  function closeWishlist() {
    offcanvasOpen = false;
    document.getElementById('iair-offcanvas').classList.remove('iair-active');
    document.getElementById('iair-overlay').classList.remove('iair-active');
    document.body.style.overflow = '';
  }

  /* ─── Modal ──────────────────────────────────────────────────── */
  function openModal(mode, productName) {
    modalMode = mode || 'contact';
    modalOpen = true;
    renderModal(productName);
    document.getElementById('iair-modal-overlay').classList.add('iair-active');
    document.body.style.overflow = 'hidden';
    closeWishlist();
  }

  function closeModal() {
    modalOpen = false;
    document.getElementById('iair-modal-overlay').classList.remove('iair-active');
    document.body.style.overflow = '';
  }

  function renderModal(productName) {
    const inner = document.getElementById('iair-modal-inner');
    const isOrder = modalMode === 'order';

    const orderTable = isOrder && cart.length > 0 ? `
      <table class="iair-order-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${cart.map(i => `
            <tr>
              <td>${esc(i.name)}</td>
              <td>${i.qty}</td>
              <td>€${(i.price * i.qty).toFixed(2).replace('.', ',')}</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="2" style="font-weight:600;color:var(--iair-text)">Total</td>
            <td>€${cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2).replace('.', ',')}</td>
          </tr>
        </tbody>
      </table>
    ` : (productName ? `
      <div style="background:rgba(201,243,29,.07);border:1px solid rgba(201,243,29,.2);border-radius:10px;padding:12px 16px;margin-bottom:22px;font-size:14px;color:var(--iair-text)">
        Produto solicitado: <strong style="color:var(--iair-accent)">${esc(productName)}</strong>
      </div>
    ` : '');

    inner.innerHTML = ` 
      <h2 class="iair-modal-title">${isOrder ? 'Finalizar Encomenda' : 'Fale Connosco'}</h2>
      <p class="iair-modal-sub">${isOrder ? 'Preencha os seus dados para confirmarmos a sua encomenda. Entraremos em contacto em breve.' : 'Envie-nos uma mensagem. A nossa equipa responde em menos de 24 horas.'}</p>

      ${orderTable}

      <form id="iair-form" novalidate autocomplete="on">
        <div class="iair-form-row">
          <div class="iair-form-group">
            <label>Nome <span>*</span></label>
            <input type="text" name="name" placeholder="João" autocomplete="given-name">
            <span class="iair-err-msg">Introduza o seu nome</span>
          </div>
          <div class="iair-form-group">
            <label>Apelido <span>*</span></label>
            <input type="text" name="surname" placeholder="Silva" autocomplete="family-name">
            <span class="iair-err-msg">Introduza o seu apelido</span>
          </div>
        </div>
        <div class="iair-form-row">
          <div class="iair-form-group">
            <label>Email <span>*</span></label>
            <input type="email" name="email" placeholder="joao@empresa.pt" autocomplete="email">
            <span class="iair-err-msg">Email inválido</span>
          </div>
          <div class="iair-form-group">
            <label>Telefone <span>*</span></label>
            <input type="tel" name="phone" placeholder="+351 9XX XXX XXX" autocomplete="tel" maxlength="20">
            <span class="iair-err-msg">Telefone inválido</span>
          </div>
        </div>
        ${isOrder ? `
        <div class="iair-form-row">
          <div class="iair-form-group">
            <label>Empresa</label>
            <input type="text" name="company" placeholder="Nome da Empresa" autocomplete="organization">
            <span class="iair-err-msg"></span>
          </div>
          <div class="iair-form-group">
            <label>Tipo de Espaço <span>*</span></label>
            <select name="space">
              <option value="">Seleccione...</option>
              <option>Hotel / Alojamento</option>
              <option>Spa / Bem-estar</option>
              <option>Retalho / Loja</option>
              <option>Escritório</option>
              <option>Restaurante / Lounge</option>
              <option>Ginásio</option>
              <option>Outro</option>
            </select>
            <span class="iair-err-msg">Seleccione o tipo de espaço</span>
          </div>
        </div>` : `
        <div class="iair-form-row">
          <div class="iair-form-group">
            <label>Assunto <span>*</span></label>
            <select name="subject">
              <option value="">Seleccione...</option>
              <option>Informação sobre produtos</option>
              <option>Solicitar orçamento</option>
              <option>Suporte técnico</option>
              <option>Parceria / Distribuição</option>
              <option>Outro</option>
            </select>
            <span class="iair-err-msg">Seleccione um assunto</span>
          </div>
          <div class="iair-form-group">
            <label>Empresa</label>
            <input type="text" name="company" placeholder="Nome da Empresa" autocomplete="organization">
            <span class="iair-err-msg"></span>
          </div>
        </div>`}
        <div class="iair-form-row iair-full">
          <div class="iair-form-group">
            <label>Mensagem Adicional</label>
            <textarea name="message" rows="4" placeholder="Descreva o seu espaço, necessidades ou questões adicionais..."></textarea>
            <span class="iair-err-msg"></span>
          </div>
        </div>
        <div class="iair-modal-actions">
          <button type="button" class="iair-btn-secondary" id="iair-modal-cancel">Cancelar</button>
          <button type="submit" class="iair-btn-primary">
            ${isOrder ? 'Confirmar Encomenda' : 'Enviar Mensagem'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </form>
    `;

    document.getElementById('iair-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('iair-modal-cancel').addEventListener('click', closeModal);

    // Sanitize inputs live
    inner.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => sanitizeInput(el));
    });
  }

  function sanitizeInput(el) {
    // Strip potential XSS from text inputs
    if (el.type !== 'email' && el.tagName !== 'SELECT' && el.tagName !== 'TEXTAREA') {
      el.value = el.value.replace(/[<>"']/g, '');
    }
    clearError(el);
  }

  function validateForm(form) {
    let valid = true;
    const fields = form.querySelectorAll('input[name], select[name], textarea[name]');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRe = /^[\d\s\+\-\(\)]{7,20}$/;

    fields.forEach(el => {
      const name = el.name;
      const val = el.value.trim();
      const required = ['name','surname','email','phone','space','subject'].includes(name);
      clearError(el);

      if (required && !val) {
        setError(el, el.closest('.iair-form-group')); valid = false;
      } else if (name === 'email' && val && !emailRe.test(val)) {
        setError(el, el.closest('.iair-form-group')); valid = false;
      } else if (name === 'phone' && val && !phoneRe.test(val)) {
        setError(el, el.closest('.iair-form-group')); valid = false;
      }
    });

    return valid;
  }

  function setError(el, group) {
    el.classList.add('iair-error');
    if (group) group.classList.add('iair-has-error');
  }
  function clearError(el) {
    el.classList.remove('iair-error');
    const group = el.closest('.iair-form-group');
    if (group) group.classList.remove('iair-has-error');
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm(e.target)) return;

    // Simulate submission
    const inner = document.getElementById('iair-modal-inner');
    inner.innerHTML = `
      <div class="iair-success">
        <div class="iair-success-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--iair-accent)" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3>${modalMode === 'order' ? 'Encomenda Recebida!' : 'Mensagem Enviada!'}</h3>
        <p>${modalMode === 'order' ? 'A sua encomenda foi registada com sucesso. Entraremos em contacto nas próximas horas para confirmar os detalhes.' : 'Recebemos a sua mensagem. A nossa equipa responderá em menos de 24 horas.'}</p>
        <button class="iair-btn-primary" style="margin-top:24px;max-width:200px" onclick="window.iAIR.closeModal()">
          Fechar
        </button>
      </div>
    `;

    if (modalMode === 'order') {
      cart = [];
      saveCart(cart);
      renderCart();
    }
  }

  /* ─── Bind Events ────────────────────────────────────────────── */
  function bindEvents() {
    document.getElementById('iair-float-btn').addEventListener('click', openWishlist);
    document.getElementById('iair-oc-close').addEventListener('click', closeWishlist);
    document.getElementById('iair-overlay').addEventListener('click', closeWishlist);
    document.getElementById('iair-modal-close').addEventListener('click', closeModal);
    document.getElementById('iair-modal-overlay').addEventListener('click', e => {
      if (e.target === document.getElementById('iair-modal-overlay')) closeModal();
    });
    document.getElementById('iair-finalizar-btn').addEventListener('click', () => {
      if (cart.length === 0) return;
      openModal('order');
    });

    // Keyboard: Esc closes
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (modalOpen) closeModal();
        else if (offcanvasOpen) closeWishlist();
      }
    });

    // CTA buttons: data-iair-modal="order|contact" data-iair-product="name"
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-iair-modal]');
      if (btn) {
        e.preventDefault();
        openModal(btn.dataset.iairModal, btn.dataset.iairProduct || null);
      }
      const addBtn = e.target.closest('[data-iair-add]');
      if (addBtn) {
        e.preventDefault();
        const d = addBtn.dataset;
        addToWishlist({
          id: d.iairAdd,
          name: d.iairName,
          price: parseFloat(d.iairPrice),
          img: d.iairImg,
          category: d.iairCat
        });
      }
    });
  }

  /* ─── Add to Wishlist ─────────────────────────────────────────── */
  function addToWishlist(product) {
    if (!product.id || !product.name) return;
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + 1, 99);
    } else {
      cart.push({ ...product, qty: product.qty || 1 });
    }
    saveCart(cart);
    renderCart();
    // Pulse animation on float btn
    const btn = document.getElementById('iair-float-btn');
    if (btn) {
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => { btn.style.transform = ''; }, 300);
    }
  }

  /* ─── Helpers ─────────────────────────────────────────────────── */
  function esc(str) {
    return String(str || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  /* ─── Public API ─────────────────────────────────────────────── */
  window.iAIR = {
    openWishlist,
    closeWishlist,
    openModal,
    closeModal,
    addToWishlist,
  };

  /* ─── Init ─────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();