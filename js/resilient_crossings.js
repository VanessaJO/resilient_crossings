document.addEventListener('DOMContentLoaded', function() {
    var map = L.map("map").setView([40.03, -105.42], 13);

    L.esri.basemapLayer("Topographic").addTo(map);

    // add a map service such as streams from Boulder County

    // Fourmile Creek Watershed
    var waterShed = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/2',
    }).addTo(map);

    // Fire Stations
    var fireStations = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/1',
    }).addTo(map);

    // Bridges and Culverts
    var bridgesCulverts = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/0',
    }).addTo(map);

});