// generate map with centre point and zoom amount
let wellington = [-41.28664, 174.77557];
let map = L.map('map').setView(wellington, 12);

// generate map layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'happygoalvin/ckztp5u9m005714lm88jgoqyh',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaGFwcHlnb2FsdmluIiwiYSI6ImNrenJ5djFxZTFlZ3AycnM4eTc2ODJzYWQifQ.5COZ2EO8iEf_uNokeHaNrQ' 
}).addTo(map);
