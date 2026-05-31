// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */

const GeoTagExamples = require('./geotag-examples');
const GeoTag = require('./geotag');

class InMemoryGeoTagStore{

    // TODO: ... your code here ...
    #store = [];

    #geoTagExamples = GeoTagExamples.tagList;

    constructor() {
        this.addExampleGeoTags();
    }

    addExampleGeoTags() {
        for(var geoTag of this.#geoTagExamples) {
            this.addGeoTag(new GeoTag(geoTag[0], geoTag[1], geoTag[2], geoTag[3]));
        }
    }        

    addGeoTag(geoTag) {
        this.#store.push(geoTag);
    }
    removeGeoTag(geoTagName) {
        for(var geoTag of this.#store) {
            if(geoTag.name === geoTagName) {
                this.#store.splice(this.#store.indexOf(geoTag), 1);
            }
        }
    }

    getNearbyGeoTags(location, radius) {
        var latitude = parseFloat(location.latitude);
        var longitude = parseFloat(location.longitude);
        var nearbyGeoTags = [];
        for(var geoTag of this.#store) {
            if(geoTag.latitude >= latitude - radius 
                && geoTag.latitude <= latitude + radius
                && geoTag.longitude >= longitude - radius
                && geoTag.longitude <= longitude + radius) {
                    nearbyGeoTags.push(geoTag);
            }
        }
        return nearbyGeoTags;
    }

    searchNearbyGeoTags(location, radius, keyword) {
        var nearbyGeoTags = this.getNearbyGeoTags(location, radius);
        var matchingGeoTags = [];
        for (var geoTag of nearbyGeoTags) {
            if(geoTag.name.includes(keyword) || geoTag.hashtag.includes(keyword)) {
                matchingGeoTags.push(geoTag);
            }
        }
        return matchingGeoTags;
    }
}

module.exports = InMemoryGeoTagStore