const Booking = require('../models/Booking.js');
const Flight = require('../models/Flight.js');
const User = require('../models/User.js');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (requires token)
const createBooking = async (req, res) => {
  try {
    const { flightId, seatNumber } = req.body;
    const userId = req.user._id; // We get this from our auth middleware

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Find the specific seat in the flight's seats array
    const seat = flight.seats.find((s) => s.seatNumber === seatNumber);

    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    if (seat.isBooked) {
      return res.status(400).json({ message: 'Seat is already booked' });
    }

    // Mark the seat as booked and save the flight document
    seat.isBooked = true;
    await flight.save();

    // Broadcast a message to all connected clients to update the UI in real-time
    req.io.emit('seatBooked', { flightId, seatNumber });

    // Create the new booking document using the shorthand .create() method
    const booking = await Booking.create({
      user: userId,
      flight: flightId,
      seatNumber,
    });

    res.status(201).json(booking);
  } catch (error) {
    // Provide a more detailed error message for easier debugging
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/mybookings
// @access  Private (requires token)
const getMyBookings = async (req, res) => {
  try {
    // Use .populate() to fetch related flight data along with the booking.
    // Selecting specific fields makes the query more efficient than fetching the whole flight document.
    const bookings = await Booking.find({ user: req.user._id }).populate(
      'flight',
      'flightNumber airline source destination departureTime arrivalTime' // Added arrivalTime for completeness
    );
    res.status(200).json(bookings);
  } catch (error) {
    // Provide a more detailed error message
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = { createBooking, getMyBookings };
