const API_BASE_URL="https://api.foursquare.com/v3";
const API_KEY="fsq3/nHX2UILdHAjTckzdb6PtyE8f8aNLMyI6Q5VOHJ8Grw="
const headers = {
    Accept: 'application/json',
    Authorization: API_KEY    
}

async function search(lat, lng, query) {
    // create the coordinate
    let ll = lat + "," + lng;
    let response = await axios.get(API_BASE_URL + "/places/search",{
        headers: {
            ...headers
        },
        params: {
            'll': ll,
            'v': '20220211',  // YYYYMMDD format
            'query': query
        }
    })
    return response.data;
}

