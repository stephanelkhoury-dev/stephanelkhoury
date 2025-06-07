import express from 'express';
import Joi from 'joi';
import { User } from '../models/User';
import logger from '../utils/logger';

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = user.generateJWT();

    logger.info(`New user registered: ${username} (${email})`);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        preferences: user.preferences
      }
    });
  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update user status and last seen
    user.status = 'online';
    user.lastSeen = new Date();
    await user.save();

    // Generate JWT token
    const token = user.generateJWT();

    logger.info(`User logged in: ${user.username} (${user.email})`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        statusMessage: user.statusMessage,
        preferences: user.preferences,
        contacts: user.contacts,
        lastSeen: user.lastSeen
      }
    });
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      // You might want to implement token blacklisting here
      // For now, we'll just update the user's status
      try {
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        const user = await User.findById(decoded.userId);
        if (user) {
          user.status = 'offline';
          user.lastSeen = new Date();
          await user.save();
          logger.info(`User logged out: ${user.username}`);
        }
      } catch (tokenError) {
        // Token might be invalid, but we still want to allow logout
        logger.warn('Invalid token during logout:', tokenError);
      }
    }

    res.json({ message: 'Logout successful' });
  } catch (error: any) {
    logger.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        statusMessage: user.statusMessage,
        preferences: user.preferences,
        contacts: user.contacts,
        lastSeen: user.lastSeen
      }
    });
  } catch (error: any) {
    logger.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
