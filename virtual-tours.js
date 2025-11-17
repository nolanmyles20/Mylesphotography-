// virtual-tours.js

(function () {
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
        console.log('virtual-tours.json loaded:', data);
        panoConfig = data.panorama || null;

        if (panoConfig && panoConfig.image) {
          loadPanorama();
        } else {
          panoContainer.innerHTML = '<p class="loading-text">No 360° image configured.</p>';
        }
      })
      .catch(function (err) {
        console.error('Failed to load virtual-tours.json:', err);
        panoContainer.innerHTML = '<p class="loading-text">Error loading 360° view.</p>';
      });
  });

  function loadPanorama() {
    if (!panoConfig || !panoContainer) return;

    loadPannellumScript(function () {
      panoContainer.innerHTML = ''; // remove "Loading..." text

      try {
        pannellum.viewer('panorama-viewer', {
          type: 'equirectangular',
          panorama: panoConfig.image,
          autoLoad: true,
          showZoomCtrl: true,
          compass: false,
          title: panoConfig.title || ''
        });
      } catch (e) {
        console.error('Error creating Pannellum viewer:', e);
        panoContainer.innerHTML = '<p class="loading-text">Unable to display 360° image.</p>';
      }
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
      panoContainer.innerHTML = '<p class="loading-text">Error loading viewer script.</p>';
    };

    document.head.appendChild(script);
  }
})();
