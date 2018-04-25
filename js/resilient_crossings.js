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

    // A1) add a map service: Streams and Ditches from Boulder County
    var streams = L.esri.dynamicMapLayer({
        url: 'http://maps.bouldercounty.org/arcgis/rest/services/HYDRO/STREAMS_DITCHES/MapServer',
        opacity: 0.55
    }).addTo(map);

    // A2) customize a popup on a dynamic map layer: Streams and Ditches
    streams.bindPopup(function (error, featureCollection) {
        if (error || featureCollection.features.length === 0) {
            return false;
        } else {
            return 'Name: ' + featureCollection.features[0].properties.Name;
        }
    });

    // B1) add a feature service: Fourmile Creek Watershed
    var waterShed = 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/2';
    L.esri.featureLayer({
        url: waterShed
    }).addTo(map);

    // C1) add a feature service: Fire Stations
    var fireStations = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/1'
    }).addTo(map);

    // C2) customize popup for Fire Stations feature layer
    var popupFireStations = '<strong>{Station_Na}</strong><br>{Address}<br>{Phone}<br><small>Chief: {Chief}<br>Captain: {Captain}<br>Paid Employees: {Paid_Emplo}<br>Volunteers: {Volunteers}<br>Equipment: {Equipment}<small>';

    // C3) bind popup for Fire Stations feature layer
    fireStations.bindPopup(function(e) {
        return L.Util.template(popupFireStations, e.feature.properties)
    });

    // D1) add a feature service: Bridges and Culverts
    var bridgesCulverts = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/0'
    }).addTo(map);

    // D2) customize popup for Bridges and Culverts feature layer
    var popupBridgesCulverts = '<strong>{AccessType}</strong><br>{Address}<br>Damage: {Damage}<br>Response: {Response}<br><small>Material: {ConstType}<br>Width: {Width}<br>Span: {Span}<br>Railings: {Railings}<br>Wt Limit: {WtLimit}<small>';

    // D3) bind popup for Bridges and Culverts feature layer
    bridgesCulverts.bindPopup(function(e) {
        return L.Util.template(popupBridgesCulverts, e.feature.properties)
    });

    // E1) GeoCode: create the geocoding control and add it to the map
    var searchControl = L.esri.Geocoding.geosearch().addTo(map);

    // E2) GeoCode: create an empty layer group to store the results and add it to the map
    var results = L.layerGroup().addTo(map);

    // E3) GeoCode: listen for the results event and add every result to the map
    searchControl.on("results", function(data) {
        results.clearLayers();
        for (var i = data.results.length - 1; i >= 0; i--) {
            results.addLayer(L.marker(data.results[i].latlng));
        }
    });

    // F1) The Geosearch control can also search for results from a variety of sources including Feature Layers and Map Services. This is done with plain text matching and is not "real" geocoding. But it allows you to mix custom results into a search box.
    var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/0',
        searchFields: ['AccessType', 'Damage'], // Search these fields for text matches
        label: 'Bridges', // Group suggestions under this header
        formatSuggestion: function(feature){
            return feature.properties.AccessType + ' - ' + feature.properties.Damage; // format suggestions like this
        }
    });
    var gisDay = L.esri.Geocoding.featureLayerProvider({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/ArcGIS/rest/services/Fourmile_Creek_Watershed/FeatureServer/0',
        searchFields: ['AccessType', 'Damage'], // Search these fields for text matches
        label: 'Bridges', // Group suggestions under this header
        formatSuggestion: function(feature){
            return feature.properties.AccessType + ' - ' + feature.properties.Damage; // format suggestions like this
        }
    });

    L.esri.Geocoding.Controls.geosearch({
        providers: [arcgisOnline, gisDay] // will geocode via ArcGIS Online and search the GIS Day feature service.
    }).addTo(map);

});