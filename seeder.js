const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Flight = require('./models/Flight');

dotenv.config();
connectDB();

const generateSeats = () => {
  const seats = [];
  for (let i = 1; i <= 10; i++) {
    for (const char of ['A', 'B', 'C', 'D']) {
      seats.push({ seatNumber: `${i}${char}`, isBooked: false });
    }
  }
  return seats;
};

// Helper to create consistent future dates for flights
const futureDate = (days, hour, minute) => {
    const date = new Date('2025-10-01T00:00:00Z'); // Base date for consistency
    date.setDate(date.getDate() + days);
    date.setUTCHours(hour, minute, 0, 0);
    return date;
};

// Cities: DEL, MUM, BLR, KOL, PUNE, GOA
const flights = [
  // --- Day 1: October 2nd, 2025 ---
  // Delhi (DEL) <> Mumbai (MUM)
  { flightNumber: 'AI-101', airline: 'Air India', source: 'DEL', destination: 'MUM', departureTime: futureDate(1, 6, 0), arrivalTime: futureDate(1, 8, 5), price: 5800, seats: generateSeats() },
  { flightNumber: '6E-204', airline: 'IndiGo', source: 'DEL', destination: 'MUM', departureTime: futureDate(1, 9, 30), arrivalTime: futureDate(1, 11, 40), price: 6300, seats: generateSeats() },
  { flightNumber: 'UK-995', airline: 'Vistara', source: 'MUM', destination: 'DEL', departureTime: futureDate(1, 10, 0), arrivalTime: futureDate(1, 12, 5), price: 6100, seats: generateSeats() },

  // Delhi (DEL) -> Bengaluru (BLR)
  { flightNumber: 'AI-502', airline: 'Air India', source: 'DEL', destination: 'BLR', departureTime: futureDate(1, 14, 0), arrivalTime: futureDate(1, 16, 45), price: 7200, seats: generateSeats() },
  
  // Mumbai (MUM) -> Goa (GOA)
  { flightNumber: 'SG-481', airline: 'SpiceJet', source: 'MUM', destination: 'GOA', departureTime: futureDate(1, 8, 45), arrivalTime: futureDate(1, 10, 0), price: 3500, seats: generateSeats() },
  
  // Kolkata (KOL) -> Bengaluru (BLR) -> Pune (PUNE)
  { flightNumber: '6E-621', airline: 'IndiGo', source: 'KOL', destination: 'BLR', departureTime: futureDate(1, 7, 0), arrivalTime: futureDate(1, 9, 30), price: 5500, seats: generateSeats() },
  { flightNumber: 'UK-831', airline: 'Vistara', source: 'BLR', destination: 'PUNE', departureTime: futureDate(1, 10, 30), arrivalTime: futureDate(1, 11, 45), price: 3200, seats: generateSeats() },

  // --- Day 2: October 3rd, 2025 ---
  // Bengaluru (BLR) <> Pune (PUNE)
  { flightNumber: 'SG-101', airline: 'SpiceJet', source: 'BLR', destination: 'PUNE', departureTime: futureDate(2, 9, 0), arrivalTime: futureDate(2, 10, 15), price: 3400, seats: generateSeats() },
  { flightNumber: '6E-601', airline: 'IndiGo', source: 'PUNE', destination: 'BLR', departureTime: futureDate(2, 11, 30), arrivalTime: futureDate(2, 12, 45), price: 3600, seats: generateSeats() },

  // Mumbai (MUM) -> Kolkata (KOL)
  { flightNumber: 'AI-607', airline: 'Air India', source: 'MUM', destination: 'KOL', departureTime: futureDate(2, 13, 0), arrivalTime: futureDate(2, 15, 40), price: 6800, seats: generateSeats() },
  
  // Goa (GOA) -> Bengaluru (BLR)
  { flightNumber: '6E-501', airline: 'IndiGo', source: 'GOA', destination: 'BLR', departureTime: futureDate(2, 18, 0), arrivalTime: futureDate(2, 19, 10), price: 3900, seats: generateSeats() },

  // --- Day 3: October 4th, 2025 ---
  // Creating a cheap but long route: KOL -> PUNE -> MUM -> DEL
  { flightNumber: 'SG-333', airline: 'SpiceJet', source: 'KOL', destination: 'PUNE', departureTime: futureDate(3, 6, 0), arrivalTime: futureDate(3, 8, 45), price: 4800, seats: generateSeats() },
  { flightNumber: '6E-444', airline: 'IndiGo', source: 'PUNE', destination: 'MUM', departureTime: futureDate(3, 9, 30), arrivalTime: futureDate(3, 10, 30), price: 2900, seats: generateSeats() },
  { flightNumber: 'AI-888', airline: 'Air India', source: 'MUM', destination: 'DEL', departureTime: futureDate(3, 12, 30), arrivalTime: futureDate(3, 14, 30), price: 5000, seats: generateSeats() },
  // Direct but expensive flight for comparison
  { flightNumber: 'UK-707', airline: 'Vistara', source: 'KOL', destination: 'DEL', departureTime: futureDate(3, 8, 0), arrivalTime: futureDate(3, 10, 30), price: 15000, seats: generateSeats() },

  // Connecting Goa to the network
  { flightNumber: 'AI-480', airline: 'Air India', source: 'DEL', destination: 'GOA', departureTime: futureDate(3, 11, 0), arrivalTime: futureDate(3, 13, 30), price: 6800, seats: generateSeats() },
];

const importData = async () => {
  try {
    await Flight.deleteMany();
    await Flight.insertMany(flights);
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Flight.deleteMany();
    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
