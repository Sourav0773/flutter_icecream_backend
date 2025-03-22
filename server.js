import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { signup, login } from './controllers/authController.js';
import rateLimit from 'express-rate-limit'; 
import authRoutes from './routes/authRoutes.js'; 
import { verifyAdmin, verifyUser } from './middlewares/authMiddleware.js'; 

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Rate Limiter for Login Requests
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // Limit to 5 requests per window
  message: 'Too many login attempts from this IP, please try again later.',
});

// Routes
app.use('/api/auth', authRoutes);  // All auth routes (signup, login, admin-only) are now handled by authRoutes.js

// MongoDB connection setup
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Protected Routes for Admin and User (Now separated)
app.get('/api/admin', verifyAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome Admin' });
});

app.get('/api/user', verifyUser, (req, res) => {
  res.status(200).json({ message: 'Welcome User, you are logged in' });
});

// Start the server
const PORT = process.env.PORT || 5000; // Set the port to the one in .env or default to 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
