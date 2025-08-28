const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);//useless staement lol
  } 
  catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit if there's error
    process.exit(1);
  }
};

module.exports = connectDB;

