// virtual-tours.js

(function () {
  var configUrl = 'virtual-tours.json';
  var tourConfig = null;

  var virtualTourContainer = null;
  var panoContainer = null;
  var pannellumScriptLoaded = false;

  document.addEventListener('DOMContentLoaded', function () {
    virtualTourContainer = document.getElementById('virtual-tour-embed');
    panoContainer = document.getElementById('panorama-viewer');

    if (!virtualTourContainer || !panoContainer) return;

    // Load the JSON config
    fetch(configUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data || !data.tours || !data.tours.length) {
          console.warn('No tours defined in virtual-tours.json');
          return;
        }

        tourConfig = data.tours[0]; // Use the first tour for now
        setupLazyLoading();
      })
      .catch(function (err) {
        console.error('Failed to load virtual-tours.json', err);
      });
  });

  function setupLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load both immediately
      loadVirtualTour();
      loadPanorama();
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        if (entry.target === virtualTourContainer) {
          loadVirtualTour();
          obs.unobserve(virtualTourContainer);
        }

        if (entry.target === panoContainer) {
          loadPanorama();
          obs.unobserve(panoContainer);
        }
      });
    }, {
      threshold: 0.25
    });

    observer.observe(virtualTourContainer);
    observer.observe(panoContainer);
  }

  // ============ Virtual Tour (TeliportMe) ============

  function loadVirtualTour() {
    if (!tourConfig || !tourConfig.virtualTour) return;
    if (virtualTourContainer.getAttribute('data-loaded') === 'true') return;

    // Clear placeholder text
    virtualTourContainer.innerHTML = '';

    var vt = tourConfig.virtualTour;
    // We recreate the TeliportMe embed script lazily
    var script = document.createElement('script');
    script.src = 'https://teliportme.com/js/embed.js';
    script.setAttribute('data-teliportme', vt.url);
    script.setAttribute('data-height', (vt.height || 480).toString());
    script.setAttribute('data-width', (vt.width || 800).toString());

    virtualTourContainer.appendChild(script);
    virtualTourContainer.setAttribute('data-loaded', 'true');
  }

  // ============ Panorama (Pannellum) ============

  function loadPanorama() {
    if (!tourConfig || !tourConfig.panorama) return;
    if (panoContainer.getAttribute('data-loaded') === 'true') return;

    // Load pannellum.js only once
    loadPannellumScript(function () {
      panoContainer.innerHTML = ''; // remove "loading" text

      // Create the viewer
      pannellum.viewer('panorama-viewer', {
        type: 'equirectangular',
        panorama: tourConfig.panorama.image,
        autoLoad: true,
        showZoomCtrl: true,
        compass: false,
        title: tourConfig.panorama.title || ''
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
