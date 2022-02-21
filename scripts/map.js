// generate map with centre point and zoom amount
let wellington = [-41.28664, 174.77557];
let map = L.map('map').setView(wellington, 12);


// generate map layer start
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    minZoom: 11,
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
// generate custom marker icons end


// load in geoJSON files start
async function loadParks() {
    let response = await axios.get('data/parks-and-reserves.geojson');
    data = response.data;
    let parkLayer = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name_);
        }
    }).addTo(map);
    parkLayer.setStyle({
        'color':'#4c8f77'
    })
    return parkLayer
}

async function parksCentreMarker() {
    let response = await axios.get('data/parks-and-reserves.geojson');
    data = response.data;
    let parkCentreMarker = L.geoJson(data, {
        onEachFeature: function(feature,layer) {
            let lat = layer.getBounds().getCenter()['lat'];
            let lng = layer.getBounds().getCenter()['lng'];
            let newMarker = L.marker([lat,lng], {icon: parkIcon});
            newMarker.bindPopup(feature.properties.name_);
            newMarker.addTo(map)
        }
    })
    return parkCentreMarker;
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
    }).addTo(map)
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
        pointToLayer: function(feature, latlng){
            return L.marker(latlng, {icon:bicycleIcon})
        }
    }).addTo(map)
    return cycleRackLayer;
}

async function loadHeritageTrees() {
    let response = await axios.get('data/heritage-trees.geojson')
    let data = response.data;
    let heritageTreesLayer = L.geoJson(data,   {
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.COMM_NAME)
    }, 
    pointToLayer: function(feature,latlng){
            return L.marker(latlng, {icon:treeIcon})
        }
    }).addTo(map)
    return heritageTreesLayer;
}

async function loadMaoriSites() {
    let response = await axios.get('data/sites-of-maori.geojson')
    let data = response.data;
    let maoriSitesLayer = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.Name)
        },
        pointToLayer: function(feature, latlng){
            return L.marker(latlng, {icon:maoriIcon})
        }
    }).addTo(map)
    return maoriSitesLayer;
}

async function loadMaoriTracks() {
    let response = await axios.get('data/maori-tracks.geojson');
    let data = response.data
    let trackLayer = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.Name)
        }
    }).addTo(map)
    trackLayer.setStyle({
        'color': 'green'
    })
    return trackLayer;
}

window.addEventListener('DOMContentLoaded', async function () {
    loadParks();
    parksCentreMarker();
    loadTracks();
    loadCycleRacks();
    loadHeritageTrees();
    loadMaoriSites();
    loadMaoriTracks();
})

// load in geoJSON files end