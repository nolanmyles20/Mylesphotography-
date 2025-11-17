// virtual-tours.js

(function () {
  var configUrl = 'virtual-tours.json';
  var panoConfig = null;

  var panoContainer = null;
  var pannellumScriptLoaded = false;

  document.addEventListener('DOMContentLoaded', function () {
    panoContainer = document.getElementById('panorama-viewer');
    if (!panoContainer) return;

    fetch(configUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data || !data.panorama) {
          console.warn('No panorama defined in virtual-tours.json');
          return;
        }

        panoConfig = data.panorama;
        setupLazyLoading();
      })
      .catch(function (err) {
        console.error('Failed to load virtual-tours.json', err);
      });
  });

  function setupLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      // Older browsers: just load it
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
    if (!panoConfig) return;
    if (panoContainer.getAttribute('data-loaded') === 'true') return;

    loadPannellumScript(function () {
      panoContainer.innerHTML = ''; // remove loading text

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
