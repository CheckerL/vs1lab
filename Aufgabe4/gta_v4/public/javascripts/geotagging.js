// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

// Here the API used for geolocations is selected
// The following declaration is a 'mockup' that always works and returns a fixed position.
var GEOLOCATION_API = {
    getCurrentPosition: function(onsuccess) {
        onsuccess({
            "coords": {
                "latitude": 49.013790,
                "longitude": 8.390071,
                "altitude": null,
                "accuracy": 39,
                "altitudeAccuracy": null,
                "heading": null,
                "speed": null
            },
            "timestamp": 1775140116396
        });
    }
};

// This is the real API.
// If there are problems with it, comment out the line.
GEOLOCATION_API = navigator.geolocation;

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
let mapManager;
function updateLocation() {
    const latValue = document.getElementById("disc-latitude").value;
    const lonValue = document.getElementById("disc-longitude").value;
    const tags = JSON.parse(document.getElementById("map").dataset.tags);

    if (latValue === "" || lonValue === "") {
        LocationHelper.findLocation((helper) => {
        document.getElementById("tag-latitude").value = helper.latitude;
        document.getElementById("tag-longitude").value = helper.longitude;
        document.getElementById("disc-latitude").value = helper.latitude;
        document.getElementById("disc-longitude").value = helper.longitude;

        if (!mapManager) {
            mapManager = new MapManager();
            mapManager.initMap(helper.latitude, helper.longitude);
        }
        mapManager.updateMarkers(helper.latitude, helper.longitude, tags);
        document.getElementById("mapView")?.remove();
        document.getElementById("mapDescription")?.remove();
    });
} else {
    if (!mapManager) {
            mapManager = new MapManager();
            mapManager.initMap(latValue, lonValue);
        }
        mapManager.updateMarkers(latValue, lonValue, tags);
        document.getElementById("mapView")?.remove();
        document.getElementById("mapDescription")?.remove();
    }
}

async function blockAndValidateEvent(event) {  
    event.preventDefault();
    const formular = event.currentTarget;
    const formElements = formular.elements;
    if(formular.reportValidity()) {   
        if(formular.id === "tag-form") {      
            postNewGeoTag();
            await updateDiscovery();
        } else if (formular.id === "discoveryFilterForm") {
            await updateDiscovery();
        }
        console.log("Isch gut");
    } else {
        console.log("Isch ned so gut");
    }
}

async function postNewGeoTag() {
    const latitude =  document.getElementById("tag-latitude").value;
    const longitude = document.getElementById("tag-longitude").value;
    const name = document.getElementById("name").value;
    const hashtag = document.getElementById("hashtag").value;

    const newGeoTag = {name, 
        latitude: parseFloat(latitude), 
        longitude: parseFloat(longitude), 
        hashtag
    };
            
    const response = await fetch("/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify(newGeoTag)
    });
    await responseErrorHandling(response);
}

async function fetchCurrentDiscoveryTags() {
    const latitude = document.getElementById("disc-latitude").value;
    const longitude = document.getElementById("disc-longitude").value;
    const searchterm = document.getElementById("searchterm").value;
    const query = new URLSearchParams({
        latitude,
        longitude,
        searchterm
    });
    const response = await fetch(`/api/geotags?${query.toString()}`);
    return await responseErrorHandling(response);
}

async function responseErrorHandling (response) {
    if(!response.ok) {
        throw new Error("Schade schade, das Posten von dem GeoTag hat wohl nicht geklappt :(");
    }
    const data = await response.json();
    console.log(data);
    return data.geoTags;
}

async function updateDiscovery() {
    const tags = await fetchCurrentDiscoveryTags();
    const latitude = document.getElementById("disc-latitude").value;
    const longitude = document.getElementById("disc-longitude").value;
    const discoveryResults = document.getElementById("discoveryResults");
    discoveryResults.textContent = "";
    //update tags in map
    mapManager.updateMarkers(latitude, longitude, tags);
    //Update tags in tagging list
    tags.forEach((tag) => {
        const listItem = document.createElement("li");
        listItem.textContent = ` ${tag.name} (  ${tag.latitude} , ${tag.longitude} )  ${tag.hashtag}  `;
        discoveryResults.appendChild(listItem);
    });
    
}



// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
    document.getElementById("tag-form").addEventListener("submit", blockAndValidateEvent);
    document.getElementById("discoveryFilterForm").addEventListener("submit", blockAndValidateEvent);
    //alert("Please change the script 'geotagging.js'");
});