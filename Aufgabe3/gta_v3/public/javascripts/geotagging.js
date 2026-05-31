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
    var currentLatitude = document.getElementById("tag-latitude").value;
    var currentLongitude = document.getElementById("tag-longitude").value;
    if(currentLatitude === "" || currentLongitude === "") {
        LocationHelper.findLocation((helper) => {
        document.getElementById("tag-latitude").value = helper.latitude;
        document.getElementById("tag-longitude").value = helper.longitude;
        document.getElementById("disc-latitude").value = helper.latitude;
        document.getElementById("disc-longitude").value = helper.longitude;

        if (!mapManager) {
            mapManager = new MapManager();
            mapManager.initMap(helper.latitude, helper.longitude);
        }
        mapManager.updateMarkers(helper.latitude, helper.longitude, JSON.parse(document.getElementById("map").dataset.tags));

        document.getElementById("mapView")?.remove();
        document.getElementById("mapDescription")?.remove();
        });  
    } else {
        if (!mapManager) {
            mapManager = new MapManager();
            mapManager.initMap(currentLatitude, currentLongitude);
        }
        mapManager.updateMarkers(currentLatitude, currentLongitude, JSON.parse(document.getElementById("map").dataset.tags));
        document.getElementById("mapView")?.remove();
        document.getElementById("mapDescription")?.remove();
    }
    
}



// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
    //alert("Please change the script 'geotagging.js'");
});