// virtual-tours.js

(function () {
  var configUrl = 'virtual-tours.json';
  var vtConfig = null;
  var panoConfig = null;

  var virtualTourContainer = null;
  var panoContainer = null;
  var pannellumScriptLoaded = false;

  document.addEventListener('DOMContentLoaded', function () {
    virtualTourContainer = document.getElementById('virtual-tour-embed');
    panoContainer        = document.getElementById('panorama-viewer');

    if (!virtualTourContainer || !panoContainer) return;

    fetch(configUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        vtConfig   = data.virtualTour || null;
        panoConfig = data.panorama || null;

        // 1) Load TeliportMe tour immediately (NOT lazy)
        if (vtConfig) {
          loadVirtualTour();
        }

        // 2) Set up lazy loading for panorama (Pannellum)
        if (panoConfig) {
          setupPanoramaLazyLoading();
        }
      })
      .catch(function (err) {
        console.error('Failed to load virtual-tours.json', err);
      });
  });

  // -------- Virtual Tour (TeliportMe) – immediate load --------
  function loadVirtualTour() {
    if (!vtConfig || !virtualTourContainer) return;
    if (virtualTourContainer.getAttribute('data-loaded') === 'true') return;

    virtualTourContainer.innerHTML = ''; // clear "Loading tour…" text

    var script = document.createElement('script');
    script.src = 'https://teliportme.com/js/embed.js';
    script.setAttribute('data-teliportme', vtConfig.url);
    script.setAttribute('data-height', (vtConfig.height || 480).toString());
    script.setAttribute('data-width', (vtConfig.width || 800).toString());

    virtualTourContainer.appendChild(script);
    virtualTourContainer.setAttribute('data-loaded', 'true');
  }

  // -------- Panorama (Pannellum) – lazy load on scroll --------
  function setupPanoramaLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      loadPanorama();
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (entry.target === panoContainer) {
          loadPanorama();
          obs.unobserve(panoContainer);
        }
      });
    }, {
      threshold: 0.25
    });

    observer.observe(panoContainer);
  }

  function loadPanorama() {
    if (!panoConfig || !panoContainer) return;
    if (panoContainer.getAttribute('data-loaded') === 'true') return;

    loadPannellumScript(function () {
      panoContainer.innerHTML = ''; // clear "Loading 360° view…"

      pannellum.viewer('panorama-viewer', {
        type: 'equirectangular',
        panorama: panoConfig.image,
        autoLoad: true,
        showZoomCtrl: true,
        compass: false,
        title: panoConfig.title || ''
      });

      panoContainer.setAttribute('data-loaded', 'true');
    });
  }

  function loadPannellumScript(callback) {
    if (pannellumScriptLoaded || window.pannellum) {
      pannellumScriptLoaded = true;
      if (typeof callback === 'function') callback();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.async = true;
    script.onload = function () {
      pannellumScriptLoaded = true;
      if (typeof callback === 'function') callback();
    };
    script.onerror = function () {
      console.error('Failed to load Pannellum script.');
    };

    document.head.appendChild(script);
  }
})();
