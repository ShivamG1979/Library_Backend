//middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js'; // Ensure the path is correct


// Middleware for authenticating JWT
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
   
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error); // Debugging
        res.status(401).json({ message: 'Token is not valid' });
    }
};
// Middleware for checking if the user is an admin
const isAdmin = async (req, res, next) => { 
    try {
        const admin = await Admin.findById(req.user.id);
        
        
        if (!admin) return res.status(401).json({ message: 'Admin not found' });

        if (!admin.isAdmin) return res.status(403).json({ message: 'Access denied' });

        next();
    } catch (error) {
        console.error('isAdmin Middleware Error:', error); // Debugging 
        res.status(500).json({ message: 'Server error', error });
    } 
};


export { auth, isAdmin };
