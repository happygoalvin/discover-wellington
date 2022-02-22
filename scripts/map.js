// generate map with centre point and zoom amount
let wellington = [-41.28664, 174.77557];
let map = L.map('map').setView(wellington, 12);


// generate map layer start
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    // minZoom: 11,
    id: 'happygoalvin/ckzu19x7w000915paw31igmdd',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaGFwcHlnb2FsdmluIiwiYSI6ImNrenJ5djFxZTFlZ3AycnM4eTc2ODJzYWQifQ.5COZ2EO8iEf_uNokeHaNrQ'
}).addTo(map);
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

let trackIcon = L.icon({
    iconUrl: '/images/map-icons/track-legend.png',
    iconSize: [27, 27],
    iconAnchor: [13, 27],
    popupAnchor: [1, -24],
})

let maoriTrackIcon = L.icon({
    iconUrl: '/images/map-icons/maori-track.png',
    iconSize: [27, 27],
    iconAnchor: [13, 27],
    popupAnchor: [1, -24],
})
// generate custom marker icons end


// load in geoJSON files start
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
            let newMarker = L.marker([lat, lng], { icon: parkIcon });
            newMarker.bindPopup(feature.properties.name_);
            newMarker.addTo(parkMarkerLayerGroup)
        }
    })
    return parkMarkerLayer;
}

async function loadTracks() {
    let response = await axios.get('data/tracks.geojson');
    let data = response.data
    let trackLayer = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<div>
            <ul>
            <li>Track Name: ${feature.properties.track_Name}</li>
            <li>Track Type: ${feature.properties.type}</li>
            </ul>
            </div>`)
        }
    }).addTo(trackLayerGroup)
    trackLayer.setStyle({
        'color': '#cc846d'
    })
    return trackLayer;
}

async function loadCycleRacks() {
    let response = await axios.get('data/cycle-racks.geojson')
    let data = response.data
    let cycleRackLayer = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.Asset_Search_Description)
        },
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, { icon: bicycleIcon })
        }
    }).addTo(cycleRackLayerGroup)
    return cycleRackLayer;
}

async function loadHeritageTrees() {
    let response = await axios.get('data/heritage-trees.geojson')
    let data = response.data;
    let heritageTreesLayer = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.COMM_NAME)
        },
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, { icon: treeIcon })
        }
    }).addTo(heritageTreesLayerGroup)
    return heritageTreesLayer;
}

async function loadMaoriSites() {
    let response = await axios.get('data/sites-of-maori.geojson')
    let data = response.data;
    let maoriSitesLayer = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.Name)
        },
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, { icon: maoriIcon })
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

window.addEventListener('DOMContentLoaded', async function () {
    loadParks();
    loadParkMarker();
    loadTracks();
    loadCycleRacks();
    loadHeritageTrees();
    loadMaoriSites();
    loadMaoriTracks();
})
// load in geoJSON files end

// layer switching controls start
let parkAreaLayerGroup = L.layerGroup();
let parkMarkerLayerGroup = L.layerGroup();
let trackLayerGroup = L.layerGroup();
let cycleRackLayerGroup = L.layerGroup();
let heritageTreesLayerGroup = L.layerGroup();
let maoriSitesLayerGroup = L.layerGroup();
let maoriTracksLayerGroup = L.layerGroup();

let baseLayers = [{
    group: "Park Layers",
    collapsed: true,
    layers: [
        {
            name: "Park Location",
            layer: parkMarkerLayerGroup,
        },
        {
            name: "Park Area",
            layer: parkAreaLayerGroup,
        }
    ]
}]

let overlays = [
    {
        group: "Maori Sites",
        collapsed: true,
        layers: [
            {
                name: "Maori Sites of importance",             
                layer: maoriSitesLayerGroup,
            },
            {
                name: "Tracks used by Maori",
                layer: maoriTracksLayerGroup,
            }
        ]
    },
    {
        name: "Tracks in Wellington",
        layer: trackLayerGroup,
    },
    {
        name: "Cycle Racks",
        layer: cycleRackLayerGroup,
    },
    {
        name: "Heritage Trees",
        layer: heritageTreesLayerGroup,
    }
]


let panelLayers = new L.Control.PanelLayers(baseLayers, overlays, {
    collapsibleGroups: true,
    collapsed: true,
})

map.addControl(panelLayers)


// let baseLayers = {
//     'Park Area':parkAreaLayerGroup,
//     'Park Location':parkMarkerLayerGroup, 
// }

// let overlays = {
//     'Maori Sites': maoriSitesLayerGroup,
// }

// L.control.layers(baseLayers,overlays).addTo(map);
//layer switching controls end