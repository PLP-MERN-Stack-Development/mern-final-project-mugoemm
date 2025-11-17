require('dotenv').config();
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

// Import security middleware
const {
  securityHeaders,
  apiLimiter,
  corsOptions,
  sanitizeData,
  preventParamPollution,
  secureCookieParser,
  compressionMiddleware,
} = require('./middleware/security');
const { logger, requestLogger, errorLogger } = require('./middleware/logger');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: corsOptions });

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders); // Set security headers
app.use(cors(corsOptions)); // CORS configuration
app.use(express.json({ limit: '10mb' })); // Body parser with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(secureCookieParser); // Parse cookies securely
app.use(sanitizeData); // Sanitize data to prevent NoSQL injection
app.use(preventParamPollution); // Prevent parameter pollution
app.use(compressionMiddleware); // Compress responses

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}
app.use(requestLogger);

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info('Client connected', { socketId: socket.id });
  
  socket.on('disconnect', () => {
    logger.info('Client disconnected', { socketId: socket.id });
  });

  // Example: Real-time order updates
  socket.on('join-order-room', (orderId) => {
    socket.join(`order-${orderId}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// Health check endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error logging middleware
app.use(errorLogger);

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log error
  logger.error('Application error', {
    error: message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).json({
      error: statusCode === 500 ? 'Internal Server Error' : message,
    });
  } else {
    res.status(statusCode).json({
      error: message,
      stack: err.stack,
    });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
mongoose
  .connect(MONGO, mongoOptions)
  .then(() => {
    logger.info('MongoDB connected successfully');
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error', { error: err.message });
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', { error: err.message });
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message });
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

module.exports = { app, io };
