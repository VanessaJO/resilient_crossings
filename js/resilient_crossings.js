document.addEventListener('DOMContentLoaded', function () {
    var map = L.map("map").setView([40.03, -105.42], 13); // ([lat, lon], initial zoom level)

    var layer = L.esri.basemapLayer('Topographic').addTo(map);

    var layerLabels;

    // function to switch basemaps
    function setBasemap(basemap) {
        if (layer) {
            map.removeLayer(layer);
        }

        layer = L.esri.basemapLayer(basemap);

        map.addLayer(layer);

        if (layerLabels) {
            map.removeLayer(layerLabels);
        }

        if (basemap === 'ShadedRelief'
            || basemap === 'Oceans'
            || basemap === 'Gray'
            || basemap === 'DarkGray'
            || basemap === 'Imagery'
            || basemap === 'Terrain'
           ) {
            layerLabels = L.esri.basemapLayer(basemap + 'Labels');
            map.addLayer(layerLabels);
        }
    }

    function changeBasemap(basemaps) {
        var basemap = basemaps.value;
        setBasemap(basemap);
    }

    // add a map service: Streams and Ditches from Boulder County
    var streams = L.esri.dynamicMapLayer({
        url: 'http://maps.bouldercounty.org/arcgis/rest/services/HYDRO/STREAMS_DITCHES/MapServer',
        opacity: 0.55
    }).addTo(map);

    // customize a popup on a dynamic map layer: Streams and Ditches
    streams.bindPopup(function (error, featureCollection) {
        if (error || featureCollection.features.length === 0) {
            return false;
        } else {
            return 'Name: ' + featureCollection.features[0].properties.Name;
        }
    });

    /*
    How would I append Feature Type and Water Source fields to the streams popup above so that it would return all 3 values?
    */

    // add a feature service: Fourmile Creek Watershed
    var waterShed = 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/2';
    L.esri.featureLayer({
        url: waterShed
    }).addTo(map);

    // 1) add a feature service: Fire Stations
    var fireStations = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/1'
    }).addTo(map);
  
    // 2) customize popup for Fire Stations feature layer
    var popupFireStations = '<strong>{Station_Na}</strong><br>{Address}<br>{Phone}<br><small>Chief: {Chief}<br>Captain: {Captain}<br>Paid Employees: {Paid_Emplo}<br>Volunteers: {Volunteers}<br>Equipment: {Equipment}<small>';

    // 3) bind popup for Fire Stations feature layer
    fireStations.bindPopup(function(e) {
        return L.Util.template(popupFireStations, e.feature.properties)
    });

    // 1) add a feature service: Bridges and Culverts
    var bridgesCulverts = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/0'
    }).addTo(map);

    // 2) customize popup for Bridges and Culverts feature layer
    var popupBridgesCulverts = '<strong>{AccessType}</strong><br>{Address}<br>Damage: {Damage}<br>Response: {Response}<br><small>Material: {ConstType}<br>Width: {Width}<br>Span: {Span}<br>Railings: {Railings}<br>Wt Limit: {WtLimit}<small>';

    // 3) bind popup for Bridges and Culverts feature layer
    bridgesCulverts.bindPopup(function(e) {
        return L.Util.template(popupBridgesCulverts, e.feature.properties)
    });


});