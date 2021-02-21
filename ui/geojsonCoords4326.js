require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/widgets/BasemapGallery",
    "esri/layers/FeatureLayer",
    "esri/core/Collection",
    "esri/Graphic",
    ], function(Map, MapView, BasemapToggle, BasemapGallery, FeatureLayer, Collection, Graphic) {

    var map = new Map({
        basemap: "topo-vector"
    });

    let coordsArray4326; 
      
    var view = new MapView({
        container: "viewDiv",
        map: map,
        //center: [17, 59], // longitude, latitude
        center: [13.026539614755073, 57.64802842353919],
        zoom: 7
    });

    var basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "satellite"
    });

    var biotopskyddLayer = new FeatureLayer({
        url: "http://geodpags.skogsstyrelsen.se/arcgis/rest/services/Geodataportal/GeodataportalVisaBiotopskydd/MapServer"
    });
    
    /*
    --- API Doc for building own poly-graphic:
    https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#constructors-summary
    https://developers.arcgis.com/javascript/latest/api-reference/esri-core-Collection.html#methods-summary
    https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html
    */
    
    async function geoGet4326(){
        let result = await fetch("/api/geojsonCoords4326");
        coordsArray4326 = await result.json();
        console.log(coordsArray4326.features[0].geometry.coordinates[0][0])
        console.log(coordsArray4326.features.length)
        console.log(coordsArray4326.features[0].properties.Kommun)
        //geoRenderGraphics();

        if(coordsArray4326.features[0].properties.Kommun == "BORÅS"){
            geoRenderGraphics();
        }
    }

    function geoRenderGraphics(){
        for(let i = 0; i < coordsArray4326.features.length; i++){

            var polyline = {
                type: "polyline",  // autocasts as new Polyline()
                paths: coordsArray4326.features[i].geometry.coordinates[0][0]
            };

            var polygon = {
                type: "polygon",
                rings: coordsArray4326.features[i].geometry.coordinates[0][0],
                color: [255, 0, 0]
            }

            var polylineSymbol = {
                type: "simple-line",  // autocasts as SimpleLineSymbol()
                color: [255, 0, 0],
                width: 4
            };

            var polylineAtt = {
                Name: "Keystone Pipeline",
                Owner: "treehuggers"
            };

            var popupTemplate = {
                title: `ID ${coordsArray4326.features[i].properties.OBJECTID}`,
                content: `Inkommen: ${coordsArray4326.features[i].properties.Inkomdatum} Averkings typ: ${coordsArray4326.features[i].properties.Avverktyp}`
            }

            var polylineGraphic = new Graphic({
                geometry: polygon,
                symbol: polylineSymbol,
                attributes: polylineAtt,
                popupTemplate: popupTemplate
            });

            var coordsCollection = new Collection()
            coordsCollection.add(polylineGraphic)

            var coordsArray = new FeatureLayer({
                source: coordsCollection,
                //fields: fields,
                objectIdField:`id${i}`,
                //popupTemplate: pTemplate,
                //renderer: quakesRenderer 
            });
            view.graphics.add(polylineGraphic);
            map.add(coordsArray, 0)
        }
    }

    map.add(biotopskyddLayer, 0)
    view.ui.add(basemapToggle, "bottom-right");

    //function calls
    geoGet4326();
});