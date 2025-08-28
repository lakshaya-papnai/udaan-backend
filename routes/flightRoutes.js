const express = require('express');
const router = express.Router();
const { searchFlights, getFlightById, findCheapestRoute } = require('../controllers/flightController.js');

// URL: /api/flights/search?source=...&destination=...
router.get('/search', searchFlights);

// URL: /api/flights/route?source=...&destination=...
router.get('/route', findCheapestRoute);


// URL: /api/flights/some_flight_id
router.get('/:id', getFlightById);

module.exports = router;