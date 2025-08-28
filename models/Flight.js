const mongoose = require('mongoose');

// We define a small schema for a single seat
const seatSchema = mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const flightSchema = mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
    },
    airline: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // A flight has an array of seats, using the seatSchema blueprint
    seats: [seatSchema],
  },
  {
    timestamps: true,
  }
);

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;