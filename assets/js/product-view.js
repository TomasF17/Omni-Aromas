/**
 * infinityAIR — Ficha de Produto (Difusores & Fragrâncias)
 * ---------------------------------------------------------------
 * Segue o mesmo padrão dos outros módulos (wishlist.js / cart.js):
 * IIFE isolada, injeta o seu próprio HTML + <style>, e expõe uma
 * API pública (window.iView).
 *
 * Como se liga ao resto do site:
 *  - Qualquer elemento com [data-iair-view="ID"] abre a ficha desse
 *    produto (já está colocado nas imagens dos Difusores e das
 *    Fragrâncias no index.html).
 *  - O conteúdo de cada produto vive no objeto PRODUCTS, em baixo.
 *    type:"difusor"    -> mostra Capacidade + Segmentos de Negócio
 *    type:"fragrancia" -> mostra a Pirâmide Aromática + benefício
 *
 * API pública: window.iView = { open, close }
 */

(function () {
  'use strict';

  /* ─── Base de Dados dos Produtos ────────────────────────────────
     (mesmos IDs já usados nos botões data-iair-add / data-cart-add
     que já existem no index.html, para tudo ficar ligado)            */
  const PRODUCTS = {

    'dif-001': {
      type: 'difusor',
      name: 'WAV-MDAS10001H',
      sku: 'WAV-MDAS10001H',
      price: 349,
      category: 'Difusor Profissional',
      m2: 1200,
      images: [
        'https://ik.imagekit.io/mtrtszz/DIFUSORES/WAV-MDAS10001H?updatedAt=1781688528523.png?tr=w-500,h-500,cm-pad_resize',
      ],
      capacidade: '2 reservatórios de 1000 ml (5 L úteis) · autonomia até 30 dias',
      segmentos: ['Hotelaria', 'Centros Comerciais', 'Escritórios Corporativos'],
      descricao: 'Difusor comercial de nebulização a frio para áreas amplas, com caudal ajustável e funcionamento contínuo.'
    },

    'dif-002': {
      type: 'difusor',
      name: 'WAV-MDAS05P',
      sku: 'WAV-MDAS05P',
      price: 199,
      category: 'Difusor Compacto',
      m2: 150,
      images: [
        "https://ik.imagekit.io/mtrtszz/DIFUSORES/WAV-MDAS05P?updatedAt=1781688542439.png?tr=w-500,h-500,cm-pad_resize",
        "https://ik.imagekit.io/mtrtszz/DIFUSORES/BRANCO/BRANCO/WAV-MDAS05P.png?updatedAt=1782814627100tr=w-500,h-500,cm-pad_resize?"
      ],
      capacidade: 'Reservatório de 100 ml · autonomia até 60 dias',
      segmentos: ['Receções', 'Salas de Reunião', 'Lojas de Pequena Dimensão'],
      descricao: 'Modelo compacto e discreto, indicado para espaços de menor dimensão que exigem presença olfativa constante.'
    },

    'dif-003': {
      type: 'difusor',
      name: 'WAV-MDAS3000C',
      sku: 'WAV-MDAS3000C',
      price: 549,
      category: 'Difusor Industrial',
      m2: 3000,
      images: [
        'https://ik.imagekit.io/mtrtszz/DIFUSORES/WAV-MDAS3000C?updatedAt=1781688552371.png',
        'https://ik.imagekit.io/mtrtszz/DIFUSORES/BRANCO/BRANCO/WAV-MDAS3000C.png?updatedAt=1782814681553'
      ],
      capacidade: 'Reservatório de 3000 ml · caudal industrial ajustável',
      segmentos: ['Naves Industriais', 'Ginásios', 'Grandes Superfícies'],
      descricao: 'Difusor de alta potência preparado para ambientes de grande volume e renovação de ar acelerada.'
    },

    'dif-004': {
      type: 'difusor',
      name: 'WAV-MDAS30N',
      sku: 'WAV-MDAS30N',
      price: 89,
      category: 'Fragrância Oriental',
      m2: 70,
      images: [
        'https://ik.imagekit.io/mtrtszz/DIFUSORES/WAV-MDAS30N?updatedAt=1781688564444.png',
        'https://ik.imagekit.io/mtrtszz/DIFUSORES/BRANCO/BRANCO/WAV-MDAS30N.png?updatedAt=1782814882730'
      ],
      capacidade: 'Reservatório de 3000 ml · caudal industrial ajustável',
      segmentos: ['Naves Industriais', 'Ginásios', 'Grandes Superfícies'],
      descricao: 'Difusor de alta potência preparado para ambientes de grande volume e renovação de ar acelerada.'
    },

    'dif-005': {
      type: 'difusor',
      name: 'WAV-MDAS501F',
      sku: 'WAV-MDAS501F',
      price: 69,
      category: 'Fragrância Fresca',
      m2: 50,
      images: [
        'https://ik.imagekit.io/mtrtszz/DIFUSORES/WAV-MDAS501F?updatedAt=1781688600367.png',
        'https://ik.imagekit.io/mtrtszz/DIFUSORES/BRANCO/BRANCO/WAV-MDAS30N.png?updatedAt=1782814715636'
      ],
      capacidade: 'Reservatório de 3000 ml · caudal industrial ajustável',
      segmentos: ['Naves Industriais', 'Ginásios', 'Grandes Superfícies'],
      descricao: 'Difusor de alta potência preparado para ambientes de grande volume e renovação de ar acelerada.'
    },

    'dif-006': {
      type: 'difusor',
      name: 'WAV-MDAS1500F',
      sku: 'WAV-MDAS1500F',
      price: 79,
      category: 'Fragrância Amadeirada',
      m2: 90,
      images: [
        'https://ik.imagekit.io/mtrtszz/DIFUSORES/WAV-MDAS1500F?updatedAt=1781688612075.png',
        'https://ik.imagekit.io/mtrtszz/DIFUSORES/BRANCO/BRANCO/WAV-MDAS1500F.png?updatedAt=1782814913360'
      ],
     capacidade: 'Reservatório de 3000 ml · caudal industrial ajustável',
      segmentos: ['Naves Industriais', 'Ginásios', 'Grandes Superfícies'],
      descricao: 'Difusor de alta potência preparado para ambientes de grande volume e renovação de ar acelerada.'
    },

    'dif-007': {
      type: 'difusor',
      name: 'WAV-MDAS1001F',
      sku: 'WAV-MDAS1001F',
      price: 149,
      category: 'Difusor Residencial',
      m2: 120,
      images: [
        'https://ik.imagekit.io/mtrtszz/DIFUSORES/WAV-MDAS1001F',
        'https://ik.imagekit.io/mtrtszz/DIFUSORES/BRANCO/BRANCO/WAV-MDAS1001F.png?updatedAt=1782814939795'
      ],
      capacidade: 'Reservatório de 300 ml · controlo via aplicação móvel',
      segmentos: ['Residências', 'Apartamentos', 'Home Office'],
      descricao: 'Difusor inteligente com nebulização silenciosa, pensado para o conforto olfativo do dia a dia em casa.'
    },

    'fra-vb': {
      type: 'fragrancia',
      name: 'Vanilla Black',
      sku: 'FRA-VB',
      price: 74,
      category: 'Fragrância Gourmand',
      m2: 70,
      images: ['https://cdn.awsli.com.br/400x400/2102/2102462/produto/146356949/vanilla-black-9dfps523sv.png'],
      piramide: { topo: 'Pimenta Rosa', coracao: 'Baunilha Negra', fundo: 'Almíscar e Âmbar Quente' },
      beneficio: 'A baunilha é amplamente associada a sensações de conforto e aconchego, tornando espaços de lounge mais acolhedores e envolventes.'
    },

    'fra-mo': {
      type: 'fragrancia',
      name: 'Madeiras do Oriente',
      sku: 'FRA-MO',
      price: 79,
      category: 'Fragrância Oriental',
      m2: 110,
      images: ['https://cdn.awsli.com.br/2500x2500/2102/2102462/produto/146356945/madeiras-do-oriente-jo3tgi3fwi.png'],
      piramide: { topo: 'Especiarias Orientais', coracao: 'Sândalo', fundo: 'Cedro e Resinas' },
      beneficio: 'As madeiras orientais transmitem uma sensação de sofisticação serena, indicada para ambientes hoteleiros e de spa onde se procura uma experiência imersiva.'
    },

    'dif-td': {
      type: 'difusor',
      name: 'Teardrop Essence',
      sku: 'DIF-TD',
      price: 129,
      category: 'Difusor Compacto',
      m2: 80,
      images: ['https://png.pngtree.com/png-vector/20250517/ourmid/pngtree-a-sleek-brown-wooden-essential-oil-diffuser-with-teardrop-shape-emitting-png-image_16298820.png'],
      capacidade: 'Reservatório de 130 ml · nebulização silenciosa',
      segmentos: ['Escritórios', 'Receções', 'Consultórios'],
      descricao: 'Estrutura em madeira natural com nebulização silenciosa, desenhada para espaços de receção até 80 m².'
    },

    'dif-tl': {
      type: 'difusor',
      name: 'Tulip Light',
      sku: 'DIF-TL',
      price: 189,
      category: 'Difusor Premium',
      m2: 200,
      images: ['https://naturashop.pt/loja/925-large_default/difusor-oleos-essenciais-tulip-light.jpg'],
      capacidade: 'Reservatório de 500 ml · luz ambiente integrada',
      segmentos: ['Spas', 'Boutiques', 'Showrooms'],
      descricao: 'Cerâmica premium com iluminação ambiente integrada, garantindo nebulização contínua em espaços até 200 m².'
    },

    'kit-av': {
      type: 'difusor',
      name: 'Kit Aromas & Velas',
      sku: 'KIT-AV',
      price: 220,
      category: 'Kit Pack Completo',
      m2: 60,
      images: ['https://www.essencialorganics.com/cdn/shop/files/difusor_de_aromas_sun_41_2_20201214014732.webp?v=1742302978&width=566'],
      capacidade: 'Difusor + 2 fragrâncias de 100 ml + 2 velas aromáticas',
      segmentos: ['Presentes Corporativos', 'Lançamento de Espaços', 'Uso Residencial'],
      descricao: 'Solução completa e pronta a usar, combinando difusão e velas para criar de imediato uma identidade olfativa coerente.'
    }
  };

  let currentId = null;
  let currentImg = 0;

  /* ─── Injeção do HTML da Ficha de Produto ───────────────────────── */
  function inject() {
    const root = document.getElementById('iair-pview-root');
    if (!root) return;

    root.innerHTML = `
      <div id="ipv-overlay" class="ipv-overlay">
        <div id="ipv-modal" class="ipv-modal" role="dialog" aria-modal="true" aria-label="Ficha de produto">
          <button id="ipv-close" class="ipv-close" aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div class="ipv-grid">
            <div class="ipv-gallery">
              <div class="ipv-gallery-main">
                <img id="ipv-main-img" src="" alt="">
                <button id="ipv-img-prev" class="ipv-img-nav ipv-img-prev" aria-label="Imagem anterior">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button id="ipv-img-next" class="ipv-img-nav ipv-img-next" aria-label="Imagem seguinte">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
              <div id="ipv-thumbs" class="ipv-thumbs"></div>
            </div>
            <div class="ipv-info">
              <p id="ipv-cat" class="ipv-cat"></p>
              <h2 id="ipv-name" class="ipv-name"></h2>
              <div id="ipv-body" class="ipv-body"></div>
              <div class="ipv-footer">
                <span id="ipv-price" class="ipv-price"></span>
                <div class="ipv-actions">
                  <button id="ipv-wish-btn" class="ipv-icon-btn" title="Adicionar à lista de desejos">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                  <button id="ipv-cart-btn" class="ipv-btn-primary">
                    Adicionar ao Carrinho
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    injectStyles();
    bindEvents();
  }

  /* ─── Estilos (CSS Isolado, prefixo ipv-) ───────────────────────── */
  function injectStyles() {
    if (document.getElementById('ipv-styles')) return;
    const s = document.createElement('style');
    s.id = 'ipv-styles';
    s.textContent = `
      .ipv-overlay {
        position: fixed; inset: 0; z-index: 9998;
        background: rgba(10, 9, 7, 0.75);
        backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
        opacity: 0; pointer-events: none;
        transition: opacity .3s;
      }
      .ipv-overlay.ipv-active { opacity: 1; pointer-events: all; }

      .ipv-modal {
        position: relative;
        background: var(--iair-dark, #0d0d0d);
        border: 1px solid var(--iair-border, rgba(255,255,255,.08));
        border-radius: 20px;
        width: 100%;
        max-width: 980px;
        max-height: 90vh;
        overflow-y: auto;
        transform: translateY(24px) scale(.97);
        transition: transform .35s cubic-bezier(.34,1.56,.64,1);
      }
      .ipv-overlay.ipv-active .ipv-modal { transform: translateY(0) scale(1); }

      .ipv-close {
        position: absolute; top: 16px; right: 16px; z-index: 2;
        width: 36px; height: 36px; border-radius: 50%;
        background: var(--iair-dark2, #161616);
        border: 1px solid var(--iair-border, rgba(255,255,255,.08));
        color: var(--iair-muted, #888);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: color .2s, border-color .2s;
      }
      .ipv-close:hover { color: var(--iair-accent, var(--base)); border-color: var(--iair-accent, var(--base)); }

      .ipv-grid { display: grid; grid-template-columns: 1fr 1fr; }
      @media (max-width: 760px) { .ipv-grid { grid-template-columns: 1fr; } }

      /* ── Galeria (esquerda) ── */
      .ipv-gallery { padding: 32px; display: flex; flex-direction: column; gap: 14px; }
      .ipv-gallery-main {
        position: relative;
        background: rgba(255,255,255,.03);
        border-radius: 14px;
        height: 320px;
        display: flex; align-items: center; justify-content: center;
        overflow: hidden;
      }
      .ipv-gallery-main img { width: 100%; height: 100%; object-fit: contain; padding: 20px; }
      .ipv-img-nav {
        position: absolute; top: 50%; transform: translateY(-50%);
        width: 34px; height: 34px; border-radius: 50%;
        background: var(--iair-dark, #0d0d0d);
        border: 1px solid var(--iair-border, rgba(255,255,255,.08));
        color: var(--iair-text, #e8e8e8);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: border-color .2s, color .2s;
      }
      .ipv-img-nav:hover { border-color: var(--iair-accent, var(--base)); color: var(--iair-accent, var(--base)); }
      .ipv-img-prev { left: 12px; } .ipv-img-next { right: 12px; }
      .ipv-img-nav.ipv-hidden { display: none; }

      .ipv-thumbs { display: flex; gap: 10px; justify-content: center; }
      .ipv-thumb {
        width: 56px; height: 56px; border-radius: 10px;
        border: 2px solid var(--iair-border, rgba(255,255,255,.08));
        background: rgba(255,255,255,.03);
        cursor: pointer; padding: 4px; opacity: .6;
        transition: opacity .2s, border-color .2s;
      }
      .ipv-thumb img { width: 100%; height: 100%; object-fit: contain; }
      .ipv-thumb.ipv-thumb-active { opacity: 1; border-color: var(--iair-accent, var(--base)); }

      /* ── Ecrã informativo (direita) ── */
      .ipv-info { padding: 32px 32px 28px 0; display: flex; flex-direction: column; }
      @media (max-width: 760px) { .ipv-info { padding: 0 24px 28px; } }
      .ipv-cat { font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--iair-accent, var(--base)); margin: 0 0 8px; }
      .ipv-name { font-size: 26px; font-weight: 600; color: var(--iair-text, #e8e8e8); margin: 0 0 18px; }
      .ipv-body { flex: 1; }

      /* Specs (Difusores) */
      .ipv-specs { display: grid; gap: 12px; margin-bottom: 22px; }
      .ipv-spec {
        display: flex; justify-content: space-between; gap: 12px;
        padding: 12px 16px; border-radius: 10px;
        background: rgba(255,255,255,.03);
        border: 1px solid var(--iair-border, rgba(255,255,255,.08));
        font-size: 13px;
      }
      .ipv-spec strong { color: var(--iair-text, #e8e8e8); font-weight: 600; }
      .ipv-spec span:last-child { color: var(--iair-muted, #888); text-align: right; }

      .ipv-segments h4, .ipv-pyramid h4 {
        font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em;
        color: var(--iair-text, #e8e8e8); margin: 0 0 12px;
      }
      .ipv-chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 20px; padding: 0; list-style: none; }
      .ipv-chip {
        font-size: 12px; padding: 7px 14px; border-radius: 20px;
        background: rgba(255,255,255,.04);
        border: 1px solid var(--iair-border, rgba(255,255,255,.08));
        color: var(--iair-muted, #888);
      }
      .ipv-desc { font-size: 14px; line-height: 1.7; color: var(--iair-muted, #888); margin: 0; }

      /* Pirâmide Aromática (Fragrâncias) */
      .ipv-pyramid { margin-bottom: 20px; }
      .ipv-pyr-band {
        display: flex; align-items: center; justify-content: space-between; gap: 10px;
        margin: 0 auto 8px; padding: 10px 18px;
        border-radius: 8px; font-size: 13px;
        background: rgba(254, 201, 97, 0.08);
        border: 1px solid var(--iair-border, rgba(255,255,255,.08));
      }
      .ipv-pyr-top { width: 62%; }
      .ipv-pyr-heart { width: 82%; }
      .ipv-pyr-base { width: 100%; margin-bottom: 0; }
      .ipv-pyr-label { font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: .06em; color: var(--iair-accent, var(--base)); white-space: nowrap; }
      .ipv-pyr-val { color: var(--iair-text, #e8e8e8); text-align: right; }

      .ipv-benefit {
        font-size: 14px; line-height: 1.7; color: var(--iair-muted, #888); margin: 0;
        padding: 14px 16px; border-radius: 10px;
        background: rgba(255,255,255,.03);
        border-left: 3px solid var(--iair-accent, var(--base));
      }
      .ipv-benefit strong { color: var(--iair-text, #e8e8e8); }

      .ipv-m2-tag {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 12px; color: var(--iair-muted, #888);
        margin-bottom: 18px;
      }
      .ipv-m2-tag strong { color: var(--iair-text, #e8e8e8); }

      /* Rodapé: preço + ações */
      .ipv-footer {
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        margin-top: 24px; padding-top: 20px;
        border-top: 1px solid var(--iair-border, rgba(255,255,255,.08));
      }
      .ipv-price { font-size: 22px; font-weight: 700; color: var(--iair-text, #e8e8e8); }
      .ipv-actions { display: flex; align-items: center; gap: 10px; }
      .ipv-icon-btn {
        width: 44px; height: 44px; border-radius: 10px;
        background: rgba(255,255,255,.04);
        border: 1px solid var(--iair-border, rgba(255,255,255,.08));
        color: var(--iair-text, #e8e8e8);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: border-color .2s, color .2s; flex-shrink: 0;
      }
      .ipv-icon-btn:hover { border-color: var(--iair-accent, var(--base)); color: var(--iair-accent, var(--base)); }
      .ipv-btn-primary {
        background: var(--iair-accent, var(--base)); color: #0d0d0d; border: none;
        border-radius: 10px; padding: 13px 22px; font-size: 13px; font-weight: 700;
        letter-spacing: .04em; text-transform: uppercase; cursor: pointer;
        display: flex; align-items: center; gap: 8px;
        transition: opacity .2s, transform .15s; white-space: nowrap;
      }
      .ipv-btn-primary:hover { opacity: .85; transform: translateY(-2px); }
    `;
    document.head.appendChild(s);
  }

  /* ─── Construir o conteúdo do ecrã informativo ──────────────────── */
  function renderBody(p) {
    if (p.type === 'fragrancia') {
      return `
        <p class="ipv-m2-tag">Indicado para espaços até <strong>${p.m2} m²</strong></p>
        <div class="ipv-pyramid">
          <h4>Pirâmide Aromática</h4>
          <div class="ipv-pyr-band ipv-pyr-top"><span class="ipv-pyr-label">Topo</span><span class="ipv-pyr-val">${esc(p.piramide.topo)}</span></div>
          <div class="ipv-pyr-band ipv-pyr-heart"><span class="ipv-pyr-label">Coração</span><span class="ipv-pyr-val">${esc(p.piramide.coracao)}</span></div>
          <div class="ipv-pyr-band ipv-pyr-base"><span class="ipv-pyr-label">Fundo</span><span class="ipv-pyr-val">${esc(p.piramide.fundo)}</span></div>
        </div>
        <p class="ipv-benefit"><strong>Como ajuda:</strong> ${esc(p.beneficio)}</p>
      `;
    }
    // type === 'difusor'
    return `
      <div class="ipv-specs">
        <div class="ipv-spec"><strong>Capacidade</strong><span>${esc(p.capacidade)}</span></div>
        <div class="ipv-spec"><strong>Indicado até</strong><span>${p.m2} m²</span></div>
      </div>
      <div class="ipv-segments">
        <h4>Segmentos de Negócio</h4>
        <ul class="ipv-chips">${p.segmentos.map(seg => `<li class="ipv-chip">${esc(seg)}</li>`).join('')}</ul>
      </div>
      <p class="ipv-desc">${esc(p.descricao)}</p>
    `;
  }

  /* ─── Abrir / Fechar ─────────────────────────────────────────────── */
  function open(id) {
    const p = PRODUCTS[id];
    if (!p) return;
    currentId = id;
    currentImg = 0;
    render(p, id);
    document.getElementById('ipv-overlay').classList.add('ipv-active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    document.getElementById('ipv-overlay').classList.remove('ipv-active');
    document.body.style.overflow = '';
  }

  function render(p, id) {
    document.getElementById('ipv-cat').textContent = p.category;
    document.getElementById('ipv-name').textContent = p.name;
    document.getElementById('ipv-price').textContent = '€' + p.price.toFixed(2).replace('.', ',');
    document.getElementById('ipv-body').innerHTML = renderBody(p);

    renderGallery(p);

    document.getElementById('ipv-wish-btn').onclick = () => {
      if (window.iAIR && window.iAIR.addToWishlist) {
        window.iAIR.addToWishlist({ id, name: p.name, price: p.price, img: p.images[0], category: p.category });
      }
    };
    document.getElementById('ipv-cart-btn').onclick = () => {
      if (window.iCart && window.iCart.addToCart) {
        window.iCart.addToCart({ id, name: p.name, price: p.price, img: p.images[0], category: p.category });
      }
    };
  }

  function renderGallery(p) {
    const main = document.getElementById('ipv-main-img');
    const thumbsWrap = document.getElementById('ipv-thumbs');
    const prevBtn = document.getElementById('ipv-img-prev');
    const nextBtn = document.getElementById('ipv-img-next');

    main.src = p.images[currentImg];
    main.alt = p.name;

    const multiple = p.images.length > 1;
    prevBtn.classList.toggle('ipv-hidden', !multiple);
    nextBtn.classList.toggle('ipv-hidden', !multiple);

    thumbsWrap.innerHTML = multiple ? p.images.map((src, i) => `
      <button class="ipv-thumb ${i === currentImg ? 'ipv-thumb-active' : ''}" data-idx="${i}" aria-label="Ver imagem ${i + 1}">
        <img src="${src}" alt="">
      </button>
    `).join('') : '';

    thumbsWrap.querySelectorAll('.ipv-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        currentImg = parseInt(btn.dataset.idx, 10);
        renderGallery(p);
      });
    });
  }

  function switchImage(dir) {
    const p = PRODUCTS[currentId];
    if (!p || p.images.length < 2) return;
    currentImg = (currentImg + dir + p.images.length) % p.images.length;
    renderGallery(p);
  }

  /* ─── Eventos ────────────────────────────────────────────────────── */
  function bindEvents() {
    document.getElementById('ipv-close').addEventListener('click', close);
    document.getElementById('ipv-overlay').addEventListener('click', e => {
      if (e.target.id === 'ipv-overlay') close();
    });
    document.getElementById('ipv-img-prev').addEventListener('click', () => switchImage(-1));
    document.getElementById('ipv-img-next').addEventListener('click', () => switchImage(1));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });

    // Qualquer elemento da página com [data-iair-view="ID"] abre a ficha
    document.addEventListener('click', e => {
      const el = e.target.closest('[data-iair-view]');
      if (el) {
        e.preventDefault();
        open(el.dataset.iairView);
      }
    });
  }

  function esc(str) {
    return String(str || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* API Pública */
  window.iView = { open, close };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
