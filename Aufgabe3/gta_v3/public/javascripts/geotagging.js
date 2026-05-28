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
  * A class to help using the HTML5 Geolocation API.
  */
/**
 * A class to help using the Leaflet map service.
 */
/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
let mapManager;

function updateLocation() {
  const latField = document.getElementById('tag-latitude');
  const lonField = document.getElementById('tag-longitude');

  const mapElement = document.getElementById("map");
  const tags = JSON.parse(mapElement.dataset.tags || "[]");

  if (latField.value === "49.01379" && lonField.value === "8.404435") {

    LocationHelper.findLocation((helper) => {
      const lat = helper.latitude;
      const lon = helper.longitude;

      latField.value = lat;
      lonField.value = lon;

      mapManager = new MapManager();

      mapManager.initMap(lat, lon);

      mapManager.updateMarkers(lat, lon, tags);
    });

  } else {
    const lat = latField.value;
    const lon = lonField.value;

    mapManager = new MapManager();
    mapManager.initMap(lat, lon);
    mapManager.updateMarkers(lat, lon, tags);
  }
}



// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
    //alert("Please change the script 'geotagging.js'");
});
