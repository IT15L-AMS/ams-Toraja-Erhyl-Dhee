import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../config/db.js';

dotenv.config();

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

// Middleware to authorize based on roles
export const authorizeRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Get user's role name from the database to ensure it's up to date
            const [rows] = await db.execute(
                'SELECT r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
                [req.user.id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }

            const userRole = rows[0].role_name;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Requires one of these roles: ${allowedRoles.join(', ')}`
                });
            }

            next();
        } catch (err) {
            res.status(500).json({ success: false, message: 'Authorization error.' });
        }
    };
};
