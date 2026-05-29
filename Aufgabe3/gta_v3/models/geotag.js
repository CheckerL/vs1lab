// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    #name;
    #latitude;
    #longitude;
    #hashtag;

    constructor(name, latitude, longitude, hashtag) {
        this.#name = name;
        this.#latitude = parseFloat(latitude);
        this.#longitude = parseFloat(longitude);
        this.#hashtag = hashtag;
    }

    get name() {
        return this.#name;
    }

    get latitude() {
        return this.#latitude;
    }

    get longitude() {
        return this.#longitude;
    }

    get hashtag() {
        return this.#hashtag;
    }
}

module.exports = GeoTag;
