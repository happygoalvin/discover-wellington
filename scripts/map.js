// generate map with centre point and zoom amount
let wellington = [-41.28664, 174.77557];
let map = L.map('map').setView(wellington, 12);
map.zoomControl.setPosition('bottomleft');
// generate map layer start

let mapBasicLayerGroup = L.layerGroup();
let mapBasic = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 23,
    id: 'happygoalvin/ckzz4pvdb002v14qry8vigywm',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaGFwcHlnb2FsdmluIiwiYSI6ImNrenJ5djFxZTFlZ3AycnM4eTc2ODJzYWQifQ.5COZ2EO8iEf_uNokeHaNrQ'
})
mapBasic.addTo(mapBasicLayerGroup)

let mapMinimoLayerGroup = L.layerGroup();
let mapMinimo = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 23,
    id: 'happygoalvin/ckzu19x7w000915paw31igmdd',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaGFwcHlnb2FsdmluIiwiYSI6ImNrenJ5djFxZTFlZ3AycnM4eTc2ODJzYWQifQ.5COZ2EO8iEf_uNokeHaNrQ'
}).addTo(mapMinimoLayerGroup);

// generate map layer end

// generate custom marker icons start
let parkIcon = L.icon({
    iconUrl: '/images/map-icons/park.svg',
    iconSize: [27, 27],
    iconAnchor: [13, 27],
    popupAnchor: [1, -24],
})

let treeIcon = L.icon({
    iconUrl: '/images/map-icons/tree.svg',
    iconSize: [27, 27],
    iconAnchor: [13, 27],
    popupAnchor: [1, -24],
})

let bicycleIcon = L.icon({
    iconUrl: '/images/map-icons/bicycle.svg',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -30],
})

let maoriIcon = L.icon({
    iconUrl: '/images/map-icons/maori.svg',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -30],
})

let mapMarkerIcon = L.icon({
    iconUrl: '/images/map-icons/map-marker.svg',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -30],
})
// generate custom marker icons end


// load in geoJSON files start

async function loadMapData() {

    function load() {
        window.addEventListener('DOMContentLoaded', async function () {
            loadParks();
            loadParkMarker();
            loadTracks();
            loadCycleRacks();
            loadHeritageTrees();
            loadMaoriSites();
            loadMaoriTracks();

            let searchResultLayer = L.layerGroup();
            searchResultLayer.addTo(map) 
            document.getElementById('search-btn').addEventListener('click', async() => {
                searchResultLayer.clearLayers();
                let query = document.querySelector('#search-input').value;
                let center = map.getBounds().getCenter();
                let data = await search(center.lat, center.lng, query);

                let searchResults = document.querySelector('#search-results')
                searchResults.innerHTML = "";

                for (let eachLocation of data.results) {
                    let coordinates = [eachLocation.geocodes.main.latitude, eachLocation.geocodes.main.longitude];
                    let marker = L.marker(coordinates, {icon : mapMarkerIcon});
                    marker.bindPopup(`<div>${eachLocation.name}</div>`)
                    marker.addTo(searchResultLayer);

                    let imageResponse = await searchPicture(eachLocation.fsq_id) // returns array of objects
                    let imageElement = document.createElement('div')
                    for (let images of imageResponse) {
                        let displayImage = images.prefix + "200" + images.suffix;
                        imageElement.className = "image-result";
                        imageElement.innerHTML = `<img src="${displayImage}">`
                        imageElement.addEventListener('click', ()=>{
                            map.flyTo(coordinates, 20);
                            marker.openPopup(); 
                        })
                        searchResults.appendChild(imageElement)
                    }
                    

                    let resultElement = document.createElement('div');
                    resultElement.className = "search-result";
                    resultElement.innerHTML = `<p>${eachLocation.name}</p>
                                               <p>${eachLocation.location.formatted_address}</p>`

                    resultElement.addEventListener('click', function (){ 
                        map.flyTo(coordinates, 20);
                        marker.openPopup();
                    })

                    searchResults.appendChild(resultElement);
                }

                if (!map.hasLayer(searchResultLayer)) {
                    map.addLayer(searchResultLayer);
                }
            })
        })
    };

    async function loadParks() {
        let response = await axios.get('data/parks-and-reserves.geojson');
        data = response.data;
        let parkLayer = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.name_);
            }
        }).addTo(parkAreaLayerGroup);
        parkLayer.setStyle({
            'color': '#4c8f77'
        })
        return parkLayer
    }
    
    async function loadParkMarker() {
        let response = await axios.get('data/parks-and-reserves.geojson');
        data = response.data;
        let parkMarkerLayer = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                let lat = layer.getBounds().getCenter()['lat'];
                let lng = layer.getBounds().getCenter()['lng'];
                let parkMarker = L.marker([lat, lng], { icon: parkIcon });
                parkMarker.on('click', function(){
                    map.flyTo(parkMarker.getLatLng(), 20)
                })
                parkMarker.bindPopup(feature.properties.name_);
                parkMarker.addTo(parkMarkerLayerGroup)
            }
        })
        return parkMarkerLayer;
    }
    
    async function loadTracks() {
        let response = await axios.get('data/tracks.geojson');
        let data = response.data
        let trackLayer = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<table class="table table-bordered">
                                   <thead>
                                        <tr>
                                           <th scope="col">Track Name</th>
                                           <th scope="col">Track Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr scope="row">
                                            <td>${feature.properties.track_Name}</td>
                                            <td>${feature.properties.type}</td>
                                        </tr>
                                    </tbody>
                                 </table>`)
            }
        }).addTo(trackLayerGroup)
        trackLayer.setStyle({
            'color': '#cc846d'
        })
        return trackLayer;
    }
    
    async function loadCycleRacks() {
        let response = await axios.get('data/cycle-racks.geojson')
        let data = response.data.features;
        
        for (let i of data) {
            for (let coord of i.geometry.coordinates) {
                let lat = coord[1];
                let lng = coord[0];
                let cycleRackLayer = L.marker([lat,lng], {icon: bicycleIcon});
                cycleRackLayer.on('click', function(){
                    map.flyTo(cycleRackLayer.getLatLng(), 23)
                })
                cycleRackLayer.bindPopup(i.properties.Asset_Search_Description)
                cycleRackLayer.addTo(cycleRackLayerGroup)
            }
        }
    }
    
    async function loadHeritageTrees() {
        let response = await axios.get('data/heritage-trees.geojson')
        let data = response.data.features;
        for (let i of data){
            let lat = i.geometry.coordinates[1]
            let lng = i.geometry.coordinates[0]
            let heritageTreesLayer = L.marker([lat,lng], {icon: treeIcon});
            heritageTreesLayer.on('click', function(){
                map.flyTo(heritageTreesLayer.getLatLng(), 20)
            })
            heritageTreesLayer.bindPopup(i.properties.COMM_NAME);
            heritageTreesLayer.addTo(heritageTreesLayerGroup)
        }
    }
    
    async function loadMaoriSites() {
        let response = await axios.get('data/sites-of-maori.geojson')
        let data = response.data;
        let maoriSitesLayer = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.Name)
            },
            pointToLayer: function (feature, latlng) {
                let maoriSitesMarker = L.marker(latlng, { icon: maoriIcon })
                maoriSitesMarker.on('click', function(){
                    map.flyTo(maoriSitesMarker.getLatLng(), 20)
                })
                return maoriSitesMarker
            }
        }).addTo(maoriSitesLayerGroup)
        return maoriSitesLayer;
    }
    
    async function loadMaoriTracks() {
        let response = await axios.get('data/maori-tracks.geojson');
        let data = response.data
        let maoriTrackLayer = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.Name)
            }
        }).addTo(maoriTracksLayerGroup)
        maoriTrackLayer.setStyle({
            'color': '#6DCC93'
        })
        return maoriTrackLayer;
    }    
    
    load();
}
loadMapData();

// load in geoJSON files end

// layer switching controls start

let parkAreaLayerGroup = L.layerGroup();
let parkMarkerLayerGroup = L.markerClusterGroup();
let trackLayerGroup = L.layerGroup();
let cycleRackLayerGroup = L.markerClusterGroup();
let heritageTreesLayerGroup = L.markerClusterGroup();
let maoriSitesLayerGroup = L.markerClusterGroup();
let maoriTracksLayerGroup = L.layerGroup();

let baseLayers = [{
    group: "Map Style",
    collapsed: true,
    layers: [{
        active: true,
        name: "Street",
        layer: mapBasicLayerGroup,
    },
    {
        name: "Minimalistic",
        layer: mapMinimoLayerGroup,
    }
    ]
}]

let overlays = [
    {
        group: "Park Layers",
        collapsed: true,
        layers: [
            {
                name: "Park Location",
                icon: '<i class ="icon icon-park-marker"></i>',
                layer: parkMarkerLayerGroup,
            },
            {
                name: "Park Area",
                icon: '<i class="icon icon-park-area"></i>',
                layer: parkAreaLayerGroup,
            }
        ]
    },
    {
        group: "Maori Sites",
        collapsed: true,
        layers: [
            {
                name: "Maori Sites-of-Importance",
                icon: '<i class ="icon icon-maori-sites"></i>',
                layer: maoriSitesLayerGroup,
            },
            {
                name: "Maori Tracks",
                icon: '<i class ="icon icon-maori-track"></i>',
                layer: maoriTracksLayerGroup,
            }
        ]
    },
    {
        name: "Tracks in Wellington",
        icon: '<i class ="icon icon-track-legend"></i>',
        layer: trackLayerGroup,
    },
    {
        name: "Cycle Racks",
        icon: '<i class ="icon icon-cycle-rack"></i>',
        layer: cycleRackLayerGroup,
    },
    {
        name: "Heritage Trees",
        icon: '<i class ="icon icon-heritage-trees"></i>',
        layer: heritageTreesLayerGroup,
    }
]

let panelLayers = new L.Control.PanelLayers(baseLayers, overlays, {
    collapsibleGroups: true,
    collapsed: true,
})

map.addControl(panelLayers)

//layer switching controls end

