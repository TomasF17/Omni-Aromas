/**
 * infinityAIR — Modo Light / Dark
 * ---------------------------------------------------------------
 * Segue o mesmo padrão dos outros módulos (wishlist.js / cart.js):
 * injeta o seu próprio botão + o seu próprio <style>, e guarda a
 * preferência do utilizador no localStorage.
 *
 * Como funciona:
 *  - Lê/escreve o atributo data-theme="light" em <html>.
 *  - Quando data-theme="light", um bloco de CSS sobrepõe as
 *    variáveis --body, --white, --pra, etc. (já usadas em todo o
 *    main.css) e os componentes que tu próprio criaste
 *    (wishlist.js / cart.js / product-view.js / filters.js), que
 *    reutilizam as mesmas variáveis --iair-*.
 *
 * API pública: window.iTheme = { toggle, set, get }
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'iair_theme';

  function getTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'dark';
    } catch { return 'dark'; }
  }

  function setTheme(mode) {
    const theme = mode === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
    updateToggleIcon(theme);
  }

  function toggleTheme() {
    setTheme(getTheme() === 'light' ? 'dark' : 'light');
  }

  /* ─── Botão de alternância (injetado no #iair-theme-root) ──────── */
  function inject() {
    const root = document.getElementById('iair-theme-root');
    injectStyles();

    if (root) {
      root.innerHTML = `
        <button id="itheme-toggle-btn" type="button" aria-label="Alternar para modo claro" title="Alternar modo light/dark">
          <svg id="itheme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <svg id="itheme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>
      `;
      document.getElementById('itheme-toggle-btn').addEventListener('click', toggleTheme);
    }

    // Aplica o tema guardado (o <head> já fez isto antes do CSS carregar,
    // isto só garante que o ícone do botão fica sincronizado)
    updateToggleIcon(getTheme());
  }

  function updateToggleIcon(theme) {
    const moon = document.getElementById('itheme-icon-moon');
    const sun = document.getElementById('itheme-icon-sun');
    const btn = document.getElementById('itheme-toggle-btn');
    if (!moon || !sun) return;
    moon.classList.toggle('itheme-hidden', theme === 'light');
    sun.classList.toggle('itheme-hidden', theme !== 'light');
    if (btn) btn.setAttribute('aria-label', theme === 'light' ? 'Alternar para modo escuro' : 'Alternar para modo claro');
  }

  /* ─── Estilos do botão + Tema Light (CSS Isolado) ───────────────── */
  function injectStyles() {
    if (document.getElementById('itheme-styles')) return;
    const s = document.createElement('style');
    s.id = 'itheme-styles';
    s.textContent = `
      .itheme-hidden { display: none !important; }

      #itheme-toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 1px solid var(--cusborder);
        background: transparent;
        color: var(--white);
        cursor: pointer;
        transition: border-color .2s, color .2s, transform .2s;
        flex-shrink: 0;
      }
      #itheme-toggle-btn:hover {
        border-color: var(--base);
        color: var(--base);
        transform: rotate(15deg);
      }

      /* ─────────────────────────────────────────────────────────
         MODO LIGHT
         Sobrepõe as variáveis de raiz já usadas em todo o site
         e nos componentes próprios (--iair-*, --icart-*), mais
         um pequeno conjunto de seletores que tinham cores fixas.
         ───────────────────────────────────────────────────────── */
      :root[data-theme="light"] {
        --body: #f6f2e9;
        --white: #1c160f;
        --title: #1c160f;
        --mtitle: #1c160f;
        --pra: #6e6a60;
        --subtitle: #1c160f;
        --bgsection: #fffaf0;
        --footer: #1c160f;
        --ftext: #6e6a60;
        --border1: #e2dac8;
        --cusborder: rgba(28, 22, 15, 0.14);
        --cborder: #e2dac8;

        /* Painéis flutuantes próprios (wishlist.js / cart.js / product-view.js / filters.js) */
        --iair-dark: #ffffff;
        --iair-dark2: #fbf7ee;
        --iair-border: rgba(28, 22, 15, 0.12);
        --iair-text: #1c160f;
        --iair-muted: #6e6a60;

        --icart-dark: #ffffff;
        --icart-dark2: #fbf7ee;
        --icart-border: rgba(28, 22, 15, 0.12);
        --icart-text: #1c160f;
        --icart-muted: #6e6a60;
      }

      /* Cabeçalho fixo ao fazer scroll */
      [data-theme="light"] .menu-fixed {
        background: var(--body) !important;
        box-shadow: 0 4px 24px rgba(28, 22, 15, 0.08);
      }
      /* Menu lateral mobile */
      [data-theme="light"] .subside__barmenu { background: var(--body) !important; }
      /* Faixa final do footer */
      [data-theme="light"] .cmn__bg { background: #ece3d1 !important; }

      /* Botões circulares (coração da wishlist / favoritos) — mantêm-se sempre legíveis */
      [data-theme="light"] .common__icon { background-color: rgba(28, 22, 15, 0.06); }
      [data-theme="light"] button.common__icon { background-color: var(--bronze, #996b43) !important; }
      [data-theme="light"] .common__icon i { color: #fff !important; }
      [data-theme="light"] .common__icon:hover i { color: var(--base) !important; }

      /* Setas do carrossel de Fragrâncias */
      [data-theme="light"] .iair-carousel-prev,
      [data-theme="light"] .iair-carousel-next { background: rgba(28,22,15,0.06) !important; border-color: rgba(28,22,15,0.12) !important; color: var(--white) !important; }
      [data-theme="light"] .iair-carousel-controls button { background: rgba(28,22,15,0.06) !important; }

      /* Textos dos cartões de produto do carrossel (estavam fixos a branco) */
      [data-theme="light"] .iair-card-name,
      [data-theme="light"] .iair-card-price { color: var(--white) !important; }
      [data-theme="light"] .iair-card-desc { color: var(--pra) !important; }
      [data-theme="light"] .iair-add-btn { color: var(--white) !important; border-color: var(--cusborder) !important; }
      [data-theme="light"] .iair-wish-mini { color: var(--white) !important; border-color: var(--cusborder) !important; }

      /* Campos de formulário dentro dos modais (contacto / encomenda) */
      [data-theme="light"] .iair-form-group input,
      [data-theme="light"] .iair-form-group select,
      [data-theme="light"] .iair-form-group textarea { background: #fff !important; border: 1px solid var(--cusborder) !important; }
      [data-theme="light"] .iair-form-group select option { background: #fff; color: #1c160f; }
      [data-theme="light"] .iair-modal { background: #fffdf8 !important; }
      [data-theme="light"] .contact-form input,
      [data-theme="light"] .contact-form textarea { background-color: #fff !important; border: 1px solid var(--cusborder); }

      /* Página de Entrar / Registar */
      [data-theme="light"] .auth-card { background: #fffdf8 !important; border-color: var(--cusborder) !important; }
      [data-theme="light"] .auth-form-group input { background: #fff !important; color: var(--white) !important; }
    `;
    document.head.appendChild(s);
  }

  /* API Pública */
  window.iTheme = { toggle: toggleTheme, set: setTheme, get: getTheme };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
