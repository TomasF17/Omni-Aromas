/**
 * infinityAIR — Carrinho de Compras Independente
 * ---------------------------------------------------------------
 * Baseado no motor da Wishlist, otimizado para gestão de encomendas.
 */

(function () {
  'use strict';

  /* ─── Estado do Carrinho ─────────────────────────────────────────── */
  const STORAGE_KEY = 'iair_cart_v1'; // Chave separada da wishlist

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

  /* ─── Injeção do HTML do Carrinho ───────────────────────────────── */
  function inject() {
    const root = document.getElementById('iair-cart-root');
    if (!root) return;

    root.innerHTML = `
      <button id="icart-float-btn" aria-label="Carrinho de compras" title="Carrinho de compras">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <span id="icart-badge" class="icart-badge icart-hidden">0</span>
      </button>

      <div id="icart-overlay" class="icart-overlay"></div>
      <aside id="icart-offcanvas" class="icart-offcanvas" role="dialog" aria-modal="true" aria-label="Carrinho de compras">
        <div class="icart-oc-header">
          <div class="icart-oc-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            O Seu Carrinho
          </div>
          <button id="icart-oc-close" class="icart-oc-close" aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div id="icart-oc-body" class="icart-oc-body"></div>
        <div id="icart-oc-footer" class="icart-oc-footer icart-hidden">
          <div class="icart-oc-total">
            Subtotal: <strong id="icart-total-price">€0,00</strong>
          </div>
          <button id="icart-finalizar-btn" class="icart-btn-primary">
            Avançar para o Checkout
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </aside>
    `;

    injectStyles();
    bindEvents();
    renderCart();
  }

  /* ─── Estilos Personalizados (CSS Isolado) ───────────────────────── */
  function injectStyles() {
    if (document.getElementById('icart-styles')) return;
    const s = document.createElement('style');
    s.id = 'icart-styles';
    s.textContent = `
      :root {
        --icart-accent: var(--base, #FEC961);
        --icart-dark: #0d0d0d;
        --icart-dark2: #161616;
        --icart-border: rgba(255,255,255,0.08);
        --icart-text: #e8e8e8;
        --icart-muted: #888;
        --icart-radius: 14px;
        --icart-oc-w: 420px;
      }
      .icart-hidden { display: none !important; }

      /* Botão flutuante deslocado para a esquerda para não tapar o coração */
      #icart-float-btn {
        position: fixed;
        bottom: 32px;
        right: 100px; /* Wishlist fica em 32px, Carrinho fica em 100px */
        z-index: 9990;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--icart-accent);
        color: var(--icart-dark);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 32px rgba(254, 201, 97, 0.25);
        transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s;
      }
      #icart-float-btn:hover { transform: scale(1.12); box-shadow: 0 12px 40px rgba(254, 201, 97, 0.4); }
      #icart-float-btn:active { transform: scale(.96); }
      
      .icart-badge {
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

      .icart-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.6);
        backdrop-filter: blur(4px);
        z-index: 9991;
        opacity: 0;
        pointer-events: none;
        transition: opacity .35s;
      }
      .icart-overlay.icart-active { opacity: 1; pointer-events: all; }

      .icart-offcanvas {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: min(var(--icart-oc-w), 100vw);
        z-index: 9992;
        background: var(--icart-dark2);
        border-left: 1px solid var(--icart-border);
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform .4s cubic-bezier(.4,0,.2,1);
      }
      .icart-offcanvas.icart-active { transform: translateX(0); }

      .icart-oc-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 24px 20px;
        border-bottom: 1px solid var(--icart-border);
        flex-shrink: 0;
      }
      .icart-oc-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 17px;
        font-weight: 600;
        color: var(--icart-text);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .icart-oc-title svg { color: var(--icart-accent); }
      
      .icart-oc-close {
        background: transparent;
        border: 1px solid var(--icart-border);
        color: var(--icart-muted);
        border-radius: 8px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all .2s;
      }
      .icart-oc-close:hover { border-color: var(--icart-accent); color: var(--icart-accent); }

      .icart-oc-body { flex: 1; overflow-y: auto; padding: 16px 24px; }
      .icart-oc-footer { padding: 20px 24px 28px; border-top: 1px solid var(--icart-border); flex-shrink: 0; }
      .icart-oc-total { color: var(--icart-muted); font-size: 14px; margin-bottom: 14px; }
      .icart-oc-total strong { color: var(--icart-text); font-size: 20px; color: var(--icart-accent); }

      .icart-btn-primary {
        width: 100%;
        background: var(--icart-accent);
        color: var(--icart-dark);
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
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }
      .icart-btn-primary:hover { background: var(--hover, #996b43); color: #fff; transform: translateY(-1px); }

      .icart-empty { text-align: center; padding: 48px 16px; }
      .icart-empty svg { color: var(--icart-border); margin-bottom: 16px; }
      .icart-empty p { color: var(--icart-muted); font-size: 15px; }

      .icart-item {
        display: flex;
        gap: 14px;
        align-items: flex-start;
        padding: 16px 0;
        border-bottom: 1px solid var(--icart-border);
      }
      .icart-img { width: 72px; height: 72px; border-radius: 10px; object-fit: cover; background: #111; border: 1px solid var(--icart-border); }
      .icart-info { flex: 1; min-width: 0; }
      .icart-cat { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--icart-accent); margin-bottom: 4px; }
      .icart-name { font-size: 14px; font-weight: 600; color: var(--icart-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 8px; }
      .icart-price { font-size: 15px; font-weight: 700; color: #fff; }
      
      .icart-controls { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
      .icart-qty-wrap { display: flex; align-items: center; border: 1px solid var(--icart-border); border-radius: 8px; overflow: hidden; }
      .icart-qty-btn { background: transparent; border: none; color: var(--icart-muted); width: 30px; height: 30px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
      .icart-qty-btn:hover { background: rgba(255,255,255,.05); color: var(--icart-text); }
      .icart-qty-input { background: transparent; border: none; border-left: 1px solid var(--icart-border); border-right: 1px solid var(--icart-border); color: var(--icart-text); width: 38px; height: 30px; text-align: center; font-size: 13px; outline: none; -moz-appearance: textfield; }
      .icart-qty-input::-webkit-outer-spin-button, .icart-qty-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      
      .icart-remove-btn { background: transparent; border: none; color: var(--icart-muted); cursor: pointer; padding: 4px; display: flex; align-items: center; }
      .icart-remove-btn:hover { color: #ff4444; }
    `;
    document.head.appendChild(s);
  }

  /* ─── Renderização dos Itens do Carrinho ─────────────────────────── */
  function renderCart() {
    const body = document.getElementById('icart-oc-body');
    const footer = document.getElementById('icart-oc-footer');
    const badge = document.getElementById('icart-badge');
    const totalEl = document.getElementById('icart-total-price');
    if (!body) return;

    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    badge.textContent = count;
    badge.classList.toggle('icart-hidden', count === 0);
    footer.classList.toggle('icart-hidden', cart.length === 0);

    if (totalEl) totalEl.textContent = '€' + total.toFixed(2).replace('.', ',');

    if (cart.length === 0) {
      body.innerHTML = `
        <div class="icart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
             <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
             <line x1="3" y1="6" x2="21" y2="6"/>
          </svg>
          <p>O seu carrinho está vazio.<br>Adicione produtos para começar.</p>
        </div>`;
      return;
    }

    body.innerHTML = cart.map(item => `
      <div class="icart-item" data-id="${esc(item.id)}">
        <img class="icart-img" src="${esc(item.img)}" alt="${esc(item.name)}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2272%22 height=%2272%22><rect width=%2272%22 height=%2272%22 fill=%22%23222%22/></svg>'">
        <div class="icart-info">
          <div class="icart-cat">${esc(item.category || '')}</div>
          <div class="icart-name">${esc(item.name)}</div>
          <div class="icart-price">€${(item.price * item.qty).toFixed(2).replace('.', ',')}</div>
        </div>
        <div class="icart-controls">
          <button class="icart-remove-btn" data-cartaction="remove" data-id="${esc(item.id)}" aria-label="Remover">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
          <div class="icart-qty-wrap">
            <button class="icart-qty-btn" data-cartaction="dec" data-id="${esc(item.id)}">−</button>
            <input class="icart-qty-input" type="number" min="1" max="99" value="${item.qty}" data-cartaction="qty" data-id="${esc(item.id)}" aria-label="Quantidade">
            <button class="icart-qty-btn" data-cartaction="inc" data-id="${esc(item.id)}">+</button>
          </div>
        </div>
      </div>
    `).join('');

    body.querySelectorAll('[data-cartaction]').forEach(el => {
      el.addEventListener(el.tagName === 'INPUT' ? 'change' : 'click', handleCartAction);
    });
  }

  function handleCartAction(e) {
    const el = e.currentTarget;
    const action = el.dataset.cartaction;
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

  /* ─── Controlo do Menu Lateral (Abre/Fecha) ─────────────────────── */
  function openCart() {
    offcanvasOpen = true;
    document.getElementById('icart-offcanvas').classList.add('icart-active');
    document.getElementById('icart-overlay').classList.add('icart-active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    offcanvasOpen = false;
    document.getElementById('icart-offcanvas').classList.remove('icart-active');
    document.getElementById('icart-overlay').classList.remove('icart-active');
    document.body.style.overflow = '';
  }

  /* ─── Eventos Globais ───────────────────────────────────────────── */
  function bindEvents() {
    document.getElementById('icart-float-btn').addEventListener('click', openCart);
    document.getElementById('icart-oc-close').addEventListener('click', closeCart);
    document.getElementById('icart-overlay').addEventListener('click', closeCart);
    
    // Conecta com o modal de encomendas que tu já tens no teu wishlist.js,
    // mas passando os ITENS DO CARRINHO (não os da wishlist) e um callback
    // para limpar o carrinho só depois da encomenda ser confirmada.
    document.getElementById('icart-finalizar-btn').addEventListener('click', () => {
      if (cart.length === 0) return;
      closeCart();
      if (window.iAIR && typeof window.iAIR.openModal === 'function') {
         window.iAIR.openModal('order', null, {
           items: cart,
           onConfirm: () => {
             cart = [];
             saveCart(cart);
             renderCart();
           }
         });
      } else {
         alert('A processar encomenda...');
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && offcanvasOpen) closeCart();
    });

    // Captura cliques em botões com atributo [data-cart-add]
    document.addEventListener('click', e => {
      const addBtn = e.target.closest('[data-cart-add]');
      if (addBtn) {
        e.preventDefault();
        const d = addBtn.dataset;
        addToCart({
          id: d.cartAdd,
          name: d.cartName,
          price: parseFloat(d.cartPrice),
          img: d.cartImg,
          category: d.cartCat
        });
      }
    });
  }

  function addToCart(product) {
    if (!product.id || !product.name) return;
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + 1, 99);
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
    renderCart();
    openCart(); // Abre o menu lateral para dar feedback visual imediato!
    
    const btn = document.getElementById('icart-float-btn');
    if (btn) {
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => { btn.style.transform = ''; }, 300);
    }
  }

  function esc(str) {
    return String(str || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  /* API Pública do Carrinho */
  window.iCart = { openCart, closeCart, addToCart };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();