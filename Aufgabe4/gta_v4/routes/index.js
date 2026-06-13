// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const geoTagStore = new GeoTagStore();
// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [], latitude: '', longitude: '' });
});

router.post('/tagging', (req, res) => {
  const {name, latitude, longitude, hashtag} = req.body;
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);
  geoTagStore.addGeoTag(newGeoTag);
  const location = {latitude, longitude};
  const nearbyGeoTags = geoTagStore.getNearbyGeoTags(location, 10);
  res.render('index', {taglist: nearbyGeoTags, latitude: latitude, longitude: longitude});
});

router.post('/discovery', (req, res) => {
    const {latitude, longitude, searchterm} = req.body;
    const location = {latitude, longitude};
    let nearbyGeoTags;
    if (searchterm) {
        nearbyGeoTags = geoTagStore.searchNearbyGeoTags(location, 10, searchterm);
    } else {
        nearbyGeoTags = geoTagStore.getNearbyGeoTags(location, 10);
    }
    res.render('index', {taglist: nearbyGeoTags, latitude: latitude, longitude: longitude});
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
router.get('/api/geotags', (req, res) => {
  const WORLD_RADIUS = 403; //For showing ALL GeoTags
  const GERMANY_RADIUS = 7; //For showing Germanys GeoTags
  const DEFAULT_LOCATION = {latitude: 0, longitude: 0};
  const {latitude, longitude, searchterm} = req.query;
  let result = [];

  if(latitude !== undefined && longitude !== undefined && latitude && longitude) {
    const location = {latitude: parseFloat(latitude), longitude: parseFloat(longitude)}; 
    if(searchterm !== undefined) {
      result = geoTagStore.searchNearbyGeoTags(location, GERMANY_RADIUS, searchterm);
    } else {
      result = geoTagStore.getNearbyGeoTags(location);
    }
  } else {
    if(searchterm !== undefined) {
      result = geoTagStore.searchNearbyGeoTags(DEFAULT_LOCATION, WORLD_RADIUS, searchterm);
    } else {
      result = geoTagStore.getNearbyGeoTags(DEFAULT_LOCATION, WORLD_RADIUS);
    }
  }
  res.json(result);
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post('/api/geotags', (req, res) => {
  //JSON-Umwandlung üassiert schon durch express.json()
  const newGeoTag = new GeoTag(req.body.name, req.body.latitude, req.body.longitude, req.body.hashtag);
  const id = geoTagStore.addGeoTag(newGeoTag);
  res
    .status(201)
    .location(`/api/geotags/${id}`) //<=> .location("/api/geotags/" + id)
    .json(newGeoTag)
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get('/api/geotags/:id', (req, res) => {
  //10 wählt Zahlensystem aus
  const id = parseInt(req.params.id, 10);

  if(!Number.isInteger(id) || id < 0) {
    return res.status(400).json({error: "Upsidupsidu, da war wohl die ID falsch"});
  }

  const geoTag = geoTagStore.getGeoTagById(id);

  if(geoTag === undefined) {
    return res.status(404).json({error: "Schwupsidupsidu, den (Geo)Tag gibts wohl nicht, probiere es doch mal mit 'Sonntag'"});
  }

  res.json(geoTag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put('/api/geotags/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if(!Number.isInteger(id) || id < 0) {
    return res.status(400).json({error: "Upsidupsidu, da war wohl die ID falsch"});
  }
  const geoTag = new GeoTag(req.body.name, req.body.latitude, req.body.longitude, req.body.hashtag);

  if(geoTag === undefined) {
    return res.status(404).json({error: "Schwupsidupsidu, den (Geo)Tag gibts wohl nicht, probiere es doch mal mit 'Sonntag'"});
  }

  geoTagStore.putGeoTagById(id, geoTag);
  res.json(geoTag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete('/api/geotags/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if(!Number.isInteger(id) || id < 0) {
    return res.status(400).json({error: "Upsidupsidu, da war wohl die ID falsch"});
  }
  const geoTag = geoTagStore.getGeoTagById(id);
  if(geoTag === undefined) {
    return res.status(404).json({error: "Schwupsidupsidu, den (Geo)Tag gibts wohl nicht, probiere es doch mal mit 'Sonntag'"});
  }
  geoTagStore.deleteGeoTagById(id);
  res.json(geoTag);
});


module.exports = router;
