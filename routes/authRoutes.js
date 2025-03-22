import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { verifyAdmin, verifyUser } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

// POST request for signup (no middleware, open to everyone)
router.post('/signup', signup);

// POST request for login (no middleware, open to everyone)
router.post('/login', login);

// Admin-only route (protected by verifyAdmin middleware)
router.get('/admin-only', verifyAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome Admin' });
});

// User route (protected by verifyUser middleware, open to authenticated users)
router.get('/user', verifyUser, (req, res) => {
  res.status(200).json({ message: 'Welcome User, you are logged in' });
});

export default router;
