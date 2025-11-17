// virtual-tours.js

(function () {
  var configUrl = './virtual-tours.json';
  var pannellumScriptLoaded = false;

  document.addEventListener('DOMContentLoaded', function () {
    var listContainer = document.getElementById('panorama-list');
    if (!listContainer) return;

    fetch(configUrl)
      .then(res => res.json())
      .then(data => {
        var panos = data.panoramas || [];
        if (!panos.length) {
          listContainer.innerHTML = '<p style="color:#ccc;">No 360° images configured.</p>';
          return;
        }

        loadPannellumScript(function () {
          panos.forEach(function (pano, index) {
            // Wrapper + title
            var wrapper = document.createElement('div');
            wrapper.style.marginBottom = '2rem';

            if (pano.title) {
              var heading = document.createElement('h3');
              heading.textContent = pano.title;
              wrapper.appendChild(heading);
            }

            // Viewer container
            var viewerDiv = document.createElement('div');
            var viewerId = 'panorama-viewer-' + index;
            viewerDiv.id = viewerId;
            viewerDiv.style.width = '100%';
            viewerDiv.style.height = '480px';
            viewerDiv.style.background = '#111';
            viewerDiv.style.borderRadius = '8px';
            wrapper.appendChild(viewerDiv);

            listContainer.appendChild(wrapper);

            // Init Pannellum for this image
            pannellum.viewer(viewerId, {
              type: 'equirectangular',
              panorama: pano.image,
              autoLoad: true,
              showZoomCtrl: true,
              title: pano.title || ''
            });
          });
        });
      })
      .catch(err => {
        console.error('JSON load error:', err);
        listContainer.innerHTML = '<p style="color:#ccc;">Error loading 360° views.</p>';
      });
  });

  function loadPannellumScript(done) {
    if (pannellumScriptLoaded || window.pannellum) {
      pannellumScriptLoaded = true;
      return done();
    }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    s.onload = function () {
      pannellumScriptLoaded = true;
      done();
    };
    document.head.appendChild(s);
  }
})();
