const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // This is a special ID type
      required: true,
      ref: 'User', // This tells Mongoose this ID refers to a document in the 'User' collection
    },
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Flight', // This ID refers to a document in the 'Flight' collection
    },
    seatNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'CONFIRMED',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;