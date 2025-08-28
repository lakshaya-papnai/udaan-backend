require('dotenv').config();
const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const server = http.createServer(app); //  Create http server with the app
const io = new Server(server, { // Create socket.io server
  cors: {
    origin: ["http://localhost:5173", "https://udaan-frontend-mocha.vercel.app"],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(express.json());

// A simple middleware to attach the io instance to each request
// This allows us to access it in our controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const startServer = async () => {
  try {
    await connectDB();
    // Use server.listen instead of app.listen
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

// --- App Routes Go Here ---
app.get('/', (req, res) => {
  res.send('Udaan API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
// -------------------------

startServer();
