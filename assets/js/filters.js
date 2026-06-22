/**
 * infinityAIR — Filtro por Espaço (m²)
 * ---------------------------------------------------------------
 * Segue o mesmo padrão dos outros módulos: IIFE isolada, injeta o
 * seu próprio HTML + <style>, sem dependências externas.
 *
 * Como funciona:
 *  - Lê o atributo data-iair-m2="NUMERO" que já está em cada
 *    produto (Difusores e Fragrâncias) e agrupa-os em escalões
 *    de área (m²).
 *  - Na grelha de Difusores (#prot), os produtos fora do escalão
 *    escolhido são simplesmente escondidos (display:none).
 *  - No carrossel de Fragrâncias (#services), os produtos fora do
 *    escalão ficam "esbatidos" em vez de escondidos — o carrossel
 *    Swiper está em modo loop e remover slides em tempo real
 *    partiria a animação, por isso optei por esta abordagem.
 */

(function () {
  'use strict';

  // Escalões usados nos dois filtros (Difusores e Fragrâncias)
  const BUCKETS = [
    { id: 'b1', label: 'Até 80 m²', min: 0, max: 80 },
    { id: 'b2', label: '81 – 150 m²', min: 81, max: 150 },
    { id: 'b3', label: '151 – 1.000 m²', min: 151, max: 1000 },
    { id: 'b4', label: '+1.000 m²', min: 1001, max: Infinity }
  ];

  function init() {
    injectStyles();
    setupFilter({
      mountId: 'iair-filter-difusores',
      itemSelector: '#prot .iair-products-grid .project__item[data-iair-m2]',
      mode: 'hide'
    });
    setupFilter({
      mountId: 'iair-filter-fragrancias',
      itemSelector: '#services .iair-product-card[data-iair-m2]',
      mode: 'dim',
      targetFn: function (el) { return el.closest('.swiper-slide') || el; }
    });
  }

  function setupFilter(opts) {
    var mountId = opts.mountId, itemSelector = opts.itemSelector, mode = opts.mode, targetFn = opts.targetFn;
    var mount = document.getElementById(mountId);
    var items = Array.from(document.querySelectorAll(itemSelector));
    if (!mount || items.length === 0) return;

    // Conta quantos produtos existem em cada escalão, para mostrar nos botões
    var counts = BUCKETS.map(function (b) {
      return items.filter(function (el) { return matchesBucket(el, b); }).length;
    });

    mount.innerHTML =
      '<div class="iair-m2filter">' +
        '<span class="iair-m2filter-label">Filtrar por espaço:</span>' +
        '<div class="iair-m2filter-chips">' +
          '<button class="iair-m2chip iair-m2chip-active" data-bucket="all">Todos (' + items.length + ')</button>' +
          BUCKETS.map(function (b, i) {
            return '<button class="iair-m2chip" data-bucket="' + b.id + '">' + b.label + ' (' + counts[i] + ')</button>';
          }).join('') +
        '</div>' +
      '</div>';

    mount.querySelectorAll('.iair-m2chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        mount.querySelectorAll('.iair-m2chip').forEach(function (b) { b.classList.remove('iair-m2chip-active'); });
        btn.classList.add('iair-m2chip-active');
        applyFilter(items, btn.dataset.bucket, mode, targetFn);
      });
    });
  }

  function matchesBucket(el, bucket) {
    var m2 = parseFloat(el.dataset.iairM2);
    return !isNaN(m2) && m2 >= bucket.min && m2 <= bucket.max;
  }

  function applyFilter(items, bucketId, mode, targetFn) {
    var bucket = BUCKETS.find(function (b) { return b.id === bucketId; });
    items.forEach(function (el) {
      var target = targetFn ? targetFn(el) : el;
      var match = bucketId === 'all' || matchesBucket(el, bucket);
      if (mode === 'hide') {
        target.classList.toggle('iair-m2-hidden', !match);
      } else {
        target.classList.toggle('iair-m2-dimmed', !match);
      }
    });
  }

  /* Estilos (CSS Isolado) */
  function injectStyles() {
    if (document.getElementById('iair-m2filter-styles')) return;
    var s = document.createElement('style');
    s.id = 'iair-m2filter-styles';
    s.textContent =
      '.iair-m2filter { display:flex; flex-wrap:wrap; align-items:center; gap:14px; justify-content:center; margin:-10px 0 36px; }' +
      '.iair-m2filter-label { font-size:13px; font-weight:600; color:var(--pra); white-space:nowrap; }' +
      '.iair-m2filter-chips { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; }' +
      '.iair-m2chip { background:rgba(255,255,255,.03); border:1px solid var(--cusborder); color:var(--pra); border-radius:20px; padding:8px 16px; font-size:12px; font-weight:600; cursor:pointer; transition:border-color .2s, color .2s, background .2s; white-space:nowrap; }' +
      '.iair-m2chip:hover { border-color:var(--base); color:var(--base); }' +
      '.iair-m2chip-active { background:var(--base); border-color:var(--base); color:#0d0d0d; }' +
      '.iair-m2-hidden { display:none !important; }' +
      '.swiper-slide.iair-m2-dimmed { opacity:.25; pointer-events:none; }' +
      '.swiper-slide { transition: opacity .25s; }';
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
