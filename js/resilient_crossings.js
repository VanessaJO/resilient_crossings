document.addEventListener('DOMContentLoaded', function() {
    var map = L.map("map").setView([40.03, -105.36], 13);

    L.esri.basemapLayer("Topographic").addTo(map);

});