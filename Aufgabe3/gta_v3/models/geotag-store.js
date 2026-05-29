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
// File origin: VS1LAB A3

const GeoTag = require('./geotag');

class InMemoryGeoTagStore {

    #tagList = [];

    addGeoTag(name, latitude, longitude, hashtag) {
        const tag = new GeoTag(name, latitude, longitude, hashtag);
        this.#tagList.push(tag);
    }

    removeGeoTag(name) {
        this.#tagList = this.#tagList.filter(
            tag => tag.name !== name
        );
    }

    getNearbyGeoTags(latitude, longitude, radius = 1) {

        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);

        return this.#tagList.filter(tag => {
            return (
                Math.abs(tag.latitude - latitude) <= radius &&
                Math.abs(tag.longitude - longitude) <= radius
            );
        });
    }

    searchNearbyGeoTags(latitude, longitude, searchterm) {

        const nearby = this.getNearbyGeoTags(latitude, longitude);

        if (!searchterm || searchterm.trim() === '') {
            return nearby;
        }

        searchterm = searchterm.toLowerCase();

        return nearby.filter(tag =>
            tag.name.toLowerCase().includes(searchterm) ||
            tag.hashtag.toLowerCase().includes(searchterm)
        );
    }
}

module.exports = InMemoryGeoTagStore
