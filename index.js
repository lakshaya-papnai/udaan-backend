require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // 1. Make sure cors is required
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const server = http.createServer(app);

// 2. Define your CORS options
const corsOptions = {
  origin: ["http://localhost:5173", "https://udaan-frontend-mocha.vercel.app"],
  methods: ["GET", "POST"]
};

// 3. Apply CORS to the main Express app
app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions // Use the same options for Socket.io
});

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

app.get('/', (req, res) => {
  res.send('Udaan API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

startServer();
