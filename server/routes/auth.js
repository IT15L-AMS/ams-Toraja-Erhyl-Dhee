import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper function to generate JWT
const generateToken = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// @route   POST /auth/register
// @desc    Register a new user
router.post('/register', [
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role_name').notEmpty().withMessage('Role is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { full_name, email, password, role_name } = req.body;

    try {
        // 1. Check if user already exists
        const [existingUser] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // 2. Get the role ID
        const [roleRows] = await db.execute('SELECT id FROM roles WHERE role_name = ?', [role_name]);
        if (roleRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid role specified' });
        }
        const role_id = roleRows[0].id;

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 4. Insert user into database
        const [result] = await db.execute(
            'INSERT INTO users (full_name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
            [full_name, email, password_hash, role_id]
        );

        // 5. Generate JWT using helper
        const token = generateToken(result.insertId, email, role_name);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

// @route   POST /auth/login
// @desc    Authenticate user & get token
router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // 1. Find user and get role name
        const [users] = await db.execute(
            'SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const user = users[0];

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // 3. Generate JWT using helper
        const token = generateToken(user.id, user.email, user.role_name);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role_name
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// @route   GET /auth/profile
// @desc    Get current user profile (Protected)
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT u.id, u.full_name, u.email, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
