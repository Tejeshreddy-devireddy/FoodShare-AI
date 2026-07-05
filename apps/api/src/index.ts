import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { initSocketIo } from './sockets/socket';
import { sanitizeInput } from './middleware/security';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5006;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodshare';

// Security Headers & CORS config
app.use(helmet());
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: ALLOWED_ORIGIN,
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Support base64 image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization against XSS
app.use(sanitizeInput);

// API Router registration
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
    timestamp: new Date()
  });
});

// Setup Socket.io
initSocketIo(server);

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB successfully connected.');
    server.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL: Database connection failed in production environment. Exiting.');
      process.exit(1);
    }
    console.log('Falling back to local server execution without DB for test run...');
    server.listen(PORT, () => {
      console.log(`Backend server running (fallback mode) on port ${PORT}`);
    });
  });

export { app, server };
