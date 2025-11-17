// virtual-tours.js

(function () {
  // JSON is in the same folder as this HTML file
  var configUrl = './virtual-tours.json';

  var panoConfig = null;
  var panoContainer = null;
  var pannellumScriptLoaded = false;

  document.addEventListener('DOMContentLoaded', function () {
    panoContainer = document.getElementById('panorama-viewer');
    if (!panoContainer) {
      console.error('Panorama container not found in DOM.');
      return;
    }

    fetch(configUrl)
      .then(function (res) {
        if (!res.ok) {
          throw new Error('HTTP ' + res.status + ' when loading ' + configUrl);
        }
        return res.json();
      })
      .then(function (data) {
        panoConfig = data.panorama || null;

        if (panoConfig) {
          setupPanoramaLazyLoading();
        } else {
          panoContainer.innerHTML = '<p class="loading-text">No 360° image configured.</p>';
        }
      })
      .catch(function (err) {
        console.error('Failed to load virtual-tours.json:', err);
        panoContainer.innerHTML = '<p class="loading-text">Error loading 360° view.</p>';
      });
  });

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
      panoContainer.innerHTML = ''; // remove "Loading 360° view…"

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
