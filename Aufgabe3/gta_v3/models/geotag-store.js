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
class InMemoryGeoTagStore{

    // TODO: ... your code here ...

    constructor() {
        this._tags = [];
    }

    addGeoTag(tag){
        this._tags.push(tag);
    }

    removeGeoTag(name){
        this._tags = this._tags.filter(tag => tag.name != name);
    }

    _distance(lat1, lon1, lat2, lon2){
        const dx = lat1 -lat2;
        const dy = lon1 - lon2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getNearbyGeoTags(location, radius){
        return this._tags.filter(tag => {
            return this._distance(
                location.latitude,
                location.longitude,
                tag.latitude,
                tag.longitude) <= radius;});
        
    }

    searchNearbyGeoTags(location, radius, keyword) {
    return this.getNearbyGeoTags(location, radius).filter(tag => {
    const kw = keyword.toLowerCase();

    return (
      tag.name.toLowerCase().includes(kw) ||
      tag.hashtag.toLowerCase().includes(kw)
    );
    });
    }

    
    getAll() {
        return this._tags;
    }

}

module.exports = InMemoryGeoTagStore
