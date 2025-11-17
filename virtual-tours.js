// virtual-tours.js

(function () {
  var configUrl = './virtual-tours.json';
  var panoConfig = null;
  var panoContainer = null;
  var pannellumScriptLoaded = false;

  document.addEventListener('DOMContentLoaded', function () {
    panoContainer = document.getElementById('panorama-viewer');
    if (!panoContainer) return;

    fetch(configUrl)
      .then(res => res.json())
      .then(data => {
        panoConfig = data.panorama;
        console.log("Loaded JSON:", panoConfig);
        loadPanorama();
      })
      .catch(err => console.error("JSON load error:", err));
  });

  function loadPanorama() {
    if (!panoConfig || !panoConfig.image) {
      panoContainer.innerHTML = "No 360 image found.";
      return;
    }

    loadPannellumScript(function () {
      panoContainer.innerHTML = ""; // clear text
      pannellum.viewer('panorama-viewer', {
        type: "equirectangular",
        panorama: panoConfig.image,
        autoLoad: true,
        showZoomCtrl: true,
        title: panoConfig.title || ""
      });
    });
  }

  function loadPannellumScript(done) {
    if (pannellumScriptLoaded || window.pannellum) return done();
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
    s.onload = function () {
      pannellumScriptLoaded = true;
      done();
    };
    document.head.appendChild(s);
  }
})();
