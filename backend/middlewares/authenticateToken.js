// middleware/authenticateToken.js
/*The authenticateToken middleware ensures that a request is authenticated by checking for
 a valid JWT (JSON Web Token). It's used to protect routes that should only be accessed by logged-in users.*/

 import jwt from 'jsonwebtoken';
 import dotenv from 'dotenv';
 
 dotenv.config();
 
 const authenticateToken = (req, res, next) => {
   const token = req.header('Authorization')?.split(' ')[1]; // Expect token to be in the format "Bearer token"
   if (!token) return res.status(403).send('Access denied');
 
   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' }); // ← JSON response
    req.user = { id: decoded.userId };
    next();
  });
}
 
 export default authenticateToken;