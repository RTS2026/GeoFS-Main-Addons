// ==UserScript==
// @name         GeoFS HD Satellite Imagery & AdBlock
// @namespace    Afin19
// @version      2.3.1
// @description  FREE HD Satellite Imagery support for GeoFS Main and Beta.
// @author       Afin19
// @match        https://www.geo-fs.com/geofs.php*
// @match        https://*.geo-fs.com/geofs.php*
// @match        https://beta.geo-fs.com/geofs.php*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/598328/GeoFS%20HD%20Satellite%20Imagery%20%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/598328/GeoFS%20HD%20Satellite%20Imagery%20%20AdBlock.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function applySatelliteImagery() {
        var C = window.Cesium || (window.geofs && window.geofs.api && window.geofs.api.Cesium);
        var v = window.geofs && window.geofs.api && window.geofs.api.viewer;

        if (!C || !v || !v.imageryLayers) {
            setTimeout(applySatelliteImagery, 500);
            return;
        }

        try {
            document.body.classList.add("geofs-hd");
            if (window.geofs.api) window.geofs.api.hdOn = true;

            // Удаляем рекламу
            var ad = document.querySelector('.geofs-adbanner.geofs-adsense-container, .geofs-ad-container, #geofs-adbanner');
            if (ad) ad.remove();

            // Очищаем старые/черные слои
            v.imageryLayers.removeAll();

            // Подгружаем рабочий провайдер ArcGIS
            var provider = new C.UrlTemplateImageryProvider({
                url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                maximumLevel: 19
            });

            v.imageryLayers.addImageryProvider(provider);

            console.log("[GeoFS Fix] HD Satellite Loaded");

            if (window.ui && window.ui.notification && window.ui.notification.show) {
                window.ui.notification.show("HD Satellite Loaded");
            }
        } catch (err) {
            console.error("[GeoFS Fix] Error:", err);
        }
    }

    // Удаление рекламы по таймеру
    setInterval(function() {
        var adEl = document.querySelector('.geofs-adbanner.geofs-adsense-container, .geofs-ad-container, #geofs-adbanner');
        if (adEl) adEl.remove();
    }, 3000);

    // Запуск после полной загрузки страницы
    window.addEventListener("load", function() {
        setTimeout(applySatelliteImagery, 2000);
    });
})();
