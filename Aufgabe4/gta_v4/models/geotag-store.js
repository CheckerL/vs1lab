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

const GeoTag = require('./geotag');
const GeoTagExamples = require('./geotag-examples');
const DEFAULT_RADIUS = 0.01;

class InMemoryGeoTagStore{

    // TODO: ... your code here ...
    constructor() {
        this.#geoTags = [];
        GeoTagExamples.tagList.forEach(tag => {
            const [name, latitude, longitude, hashtag] = tag;
            this.addGeoTag(new GeoTag(name, latitude, longitude, hashtag));
        });
    }
    
    #geoTags = [];

    addGeoTag(geoTag) {
        this.#geoTags.push(geoTag);
    }

    removeGeoTag(name) {
        this.#geoTags = this.#geoTags.filter(geoTag => geoTag.name !== name);
    }

    getNearbyGeoTags(location, radius = DEFAULT_RADIUS) {
        return this.#geoTags.filter(geoTag => {
            const distance = Math.sqrt(Math.pow(geoTag.latitude - location.latitude, 2) + Math.pow(geoTag.longitude - location.longitude, 2));
            return distance <= radius;
        });
    }

    searchNearbyGeoTags(location, radius = DEFAULT_RADIUS, keyword) {
        keyword = keyword.toLowerCase();
        return this.getNearbyGeoTags(location, radius).filter(geoTag => {
            return geoTag.name.toLowerCase().includes(keyword) || geoTag.hashtag.toLowerCase().includes(keyword);
        });
    }

    getIndexByGeoTag(geoTag) {
        return this.#geoTags.indexOf(geoTag);
    }
    getGeoTagById(id) {
        return this.#geoTags[id];
    }
    putGeoTagById(id, geoTag) {
        this.#geoTags[id] = geoTag;
    }
    deleteGeoTagById(id) {
        this.#geoTags.splice(id, 1);
    }
}

module.exports = InMemoryGeoTagStore
