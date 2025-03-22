import jwt from 'jsonwebtoken';

// Middleware to verify if the user is an admin
export const verifyAdmin = (req, res, next) => {
  // Extract token from Authorization header (e.g., Bearer <token>)
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // If no token is found, send a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Attach decoded user info (userId, role) to the request object
    req.user = decoded;

    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied, not an admin' });
    }

    // If user is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: 'Invalid token' });
  }
};

// Middleware to verify if the user is authenticated (non-admin routes)
export const verifyUser = (req, res, next) => {
  // Extract token from Authorization header (e.g., Bearer <token>)
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // If no token is found, send a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Attach decoded user info (userId, role) to the request object
    req.user = decoded;  // user data (userId, role)

    // Proceed to the next middleware or route handler if the token is valid
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: 'Invalid token' });
  }
};
