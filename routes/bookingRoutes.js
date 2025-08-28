const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Any request to these routes will first have to pass through the 'protect' middleware
router.route('/').post(protect, createBooking);
router.route('/mybookings').get(protect, getMyBookings);

module.exports = router;