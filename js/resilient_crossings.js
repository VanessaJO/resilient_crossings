document.addEventListener('DOMContentLoaded', function() {
    var map = L.map("map").setView([40.03, -105.42], 13);

    L.esri.basemapLayer("Topographic").addTo(map);

    // add a map service: Streams and Ditches from Boulder County
    var streams = L.esri.featureLayer({
        url: 'http://maps.bouldercounty.org/arcgis/rest/services/HYDRO/STREAMS_DITCHES/MapServer/0',
    }).addTo(map);

    // add a feature service: Fourmile Creek Watershed
    var waterShed = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/2',
    }).addTo(map);

    // add a feature service: Fire Stations
    var fireStations = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/1',
    }).addTo(map);

    // add a feature service: Bridges and Culverts
    var bridgesCulverts = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/0',
    }).addTo(map);

});