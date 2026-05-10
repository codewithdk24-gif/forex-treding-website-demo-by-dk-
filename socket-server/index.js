const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow Next.js frontend to connect
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3005;

// Define base prices
const basePrices = {
  'EUR/USD': 1.08240,
  'GBP/USD': 1.26500,
  'BTC/USD': 94240.00,
  'XAU/USD': 2340.00
};

// Current prices memory
let currentPrices = { ...basePrices };

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send immediate current prices to new client
  socket.emit('priceUpdate', currentPrices);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Broadcast randomized price updates every second
setInterval(() => {
  const symbol = 'EUR/USD';
  // Random fluctuation between -0.00002 and +0.00002
  const rand = (Math.random() * 0.00004 - 0.00002);
  currentPrices[symbol] = parseFloat((currentPrices[symbol] + rand).toFixed(5));

  // Additional mock for BTC
  const btcRand = (Math.random() * 20 - 10);
  currentPrices['BTC/USD'] = parseFloat((currentPrices['BTC/USD'] + btcRand).toFixed(2));

  // Broadcast to all clients
  io.emit('priceUpdate', currentPrices);
}, 1000);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});