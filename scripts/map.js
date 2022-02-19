// generate map with centre point and zoom amount
let wellington = [-41.28664, 174.77557];
let map = L.map('map').setView(wellington, 12);

// generate map layer start
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    minZoom: 11,
    id: 'happygoalvin/ckztp5u9m005714lm88jgoqyh',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaGFwcHlnb2FsdmluIiwiYSI6ImNrenJ5djFxZTFlZ3AycnM4eTc2ODJzYWQifQ.5COZ2EO8iEf_uNokeHaNrQ' 
}).addTo(map);
// generate map layer end

// load in geoJSON files start
async function loadParks() {
    let response = await axios.get('data/parks-and-reserves.geojson');
    let parkLayer = L.geoJson(response.data, {
        onEachFeature: function(feature,layer){
            layer.bindPopup(feature.properties.name_)
        }
    }).addTo(map);
    return parkLayer;
} 

async function loadTracks() {
    let response = await axios.get('data/tracks.geojson');
    let data = response.data
    let trackLayer = L.geoJson(data, {
        onEachFeature: function(feature,layer){
            layer.bindPopup(`<div>
            <ul>
            <li>Track Name: ${feature.properties.track_Name}</li>
            <li>Track Type: ${feature.properties.type}</li>
            </ul>
            </div>`)
        }
    }).addTo(map)
    trackLayer.setStyle ({
        'color' : 'red'
    })
    return trackLayer;
}

async function loadCycleRacks(){
    let response = await axios.get('data/cycle-racks.geojson')
    let data = response.data
    let cycleRackLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            layer.bindPopup(feature.properties.Asset_Search_Description);
        }
    }).addTo(map)
    return cycleRackLayer;
}

async function loadHeritageTrees(){
    let response = await axios.get('data/heritage-trees.geojson')
    let data = response.data;
    let heritageTreesLayer = L.geoJson (data, {
        onEachFeature: function(feature,layer){
            layer.bindPopup(feature.properties.COMM_NAME)
        }
    }).addTo(map)
    return heritageTreesLayer;
}

async function loadMaoriSites(){
    let response = await axios.get('data/sites-of-maori.geojson')
    let data = response.data;
    let maoriSitesLayer = L.geoJson (data, {
        onEachFeature: function(feature, layer){
            layer.bindPopup(feature.properties.Name)
        }
    }).addTo(map)
    return maoriSitesLayer;
}

window.addEventListener('DOMContentLoaded', async function(){
    loadParks();
    loadTracks();
    loadCycleRacks();
    loadHeritageTrees();
    loadMaoriSites();
})

// load in geoJSON files end