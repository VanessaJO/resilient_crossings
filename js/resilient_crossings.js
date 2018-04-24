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
    var waterShed = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/2'
    }).addTo(map);

    // add a feature service: Fire Stations
    var fireStations = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/1'
    }).addTo(map);

    // customize popups on a feature layer: Fire Stations
    fireStations.bindPopup(function (layer) {
        return L.Util.template('<p>District: {District}<br>Chief: {Chief}<br>Website: {Website1}<br>Address: {Address}<br>Captain: {Captain}<br>Phone: {Phone}<br>Paid Employees: {Paid_Emplo}<br>Volunteers: {Volunteers}<br>Station Name: {Station_Na}<br>Equipment: {Equipment}<br></p>', layer.feature.properties);
    });

    // add a feature service: Bridges and Culverts
    var bridgesCulverts = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/0'
    }).addTo(map);

    // customize popups on a feature layer: Bridges and Culverts
    bridgesCulverts.bindPopup(function (layer) {
        return L.Util.template('<p>Address: {Address}<br>Access Type: {AccessType}<br>Material: {ConstType}<br>Width: {Width}<br>Span: {Span}<br>Railings: {Railings}<br>Wt Limit: {WtLimit}<br>Damage: {Damage}<br>Response: {Response}</p>', layer.feature.properties);
    });

});