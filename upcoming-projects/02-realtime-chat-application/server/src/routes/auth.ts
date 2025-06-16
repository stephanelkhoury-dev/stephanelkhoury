import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import passport from '../config/passport';
import { User } from '../models/User';
import { emailService } from '../services/emailService';
import { twoFactorAuthService } from '../services/twoFactorAuthService';
import { authenticateToken, AuthRequest } from '../middleware/auth';
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
  password: Joi.string().required(),
  twoFactorCode: Joi.string().optional(),
  backupCode: Joi.string().optional()
});

const emailVerificationSchema = Joi.object({
  token: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const enable2FASchema = Joi.object({
  secret: Joi.string().required(),
  token: Joi.string().required(),
  backupCodes: Joi.array().items(Joi.string()).required()
});

const disable2FASchema = Joi.object({
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

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    try {
      await emailService.sendEmailVerification({
        username: user.username,
        email: user.email,
        verificationToken
      });
    } catch (emailError) {
      logger.error('Email verification sending failed:', emailError);
      // Continue registration even if email fails
    }

    // Generate JWT token
    const token = user.generateJWT();

    logger.info(`New user registered: ${username} (${email})`);

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
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

    const { email, password, twoFactorCode, backupCode } = req.body;

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

    // Check if 2FA is enabled
    if (user.twoFactorAuth.enabled) {
      let is2FAValid = false;

      if (twoFactorCode) {
        // Verify TOTP code
        is2FAValid = twoFactorAuthService.verifyToken(user.twoFactorAuth.secret!, twoFactorCode);
      } else if (backupCode) {
        // Verify backup code
        const backupResult = await twoFactorAuthService.verifyBackupCode((user._id as any).toString(), backupCode);
        is2FAValid = backupResult.isValid;
      } else {
        return res.status(422).json({ 
          error: 'Two-factor authentication required',
          requiresTwoFactor: true 
        });
      }

      if (!is2FAValid) {
        return res.status(401).json({ error: 'Invalid two-factor authentication code' });
      }
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
        bio: user.bio,
        status: user.status,
        statusMessage: user.statusMessage,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorAuth.enabled,
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

// Email Verification
router.post('/verify-email', async (req, res) => {
  try {
    const { error } = emailVerificationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { token } = req.body;
    
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    logger.info(`Email verified for user: ${user.username}`);

    res.json({ message: 'Email verified successfully' });
  } catch (error: any) {
    logger.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

// Resend Email Verification
// @ts-ignore
router.post('/resend-verification', authenticateToken, async (req: any, res: any) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await User.findById(authReq.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    await emailService.sendEmailVerification({
      username: user.username,
      email: user.email,
      verificationToken
    });

    res.json({ message: 'Verification email sent' });
  } catch (error: any) {
    logger.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account with that email exists, you will receive a password reset email.' });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    await emailService.sendPasswordReset({
      username: user.username,
      email: user.email,
      resetToken
    });

    logger.info(`Password reset requested for: ${user.username}`);

    res.json({ message: 'If an account with that email exists, you will receive a password reset email.' });
  } catch (error: any) {
    logger.error('Forgot password error:', error);
    res.status(500).json({ error: 'Password reset request failed' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { token, newPassword } = req.body;
    
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logger.info(`Password reset completed for: ${user.username}`);

    res.json({ message: 'Password reset successfully' });
  } catch (error: any) {
    logger.error('Reset password error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

// === OAuth Routes ===

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user as any;
    const token = user.generateJWT();
    
    // Redirect to client with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    const user = req.user as any;
    const token = user.generateJWT();
    
    // Redirect to client with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

// === 2FA Routes ===

// Setup 2FA - Generate QR Code
// @ts-ignore
router.post('/2fa/setup', authenticateToken, async (req: any, res: any) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await twoFactorAuthService.generateSecret(authReq.user.userId);
    
    res.json({
      message: '2FA setup initiated',
      secret: result.secret,
      qrCodeUrl: result.qrCodeUrl,
      backupCodes: result.backupCodes
    });
  } catch (error: any) {
    logger.error('2FA setup error:', error);
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
});

// Enable 2FA
// @ts-ignore
router.post('/2fa/enable', authenticateToken, async (req: any, res: any) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { error } = enable2FASchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { secret, token, backupCodes } = req.body;
    
    const success = await twoFactorAuthService.enableTwoFactor(
      authReq.user.userId,
      secret,
      token,
      backupCodes
    );

    if (!success) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    logger.info(`2FA enabled for user: ${authReq.user.userId}`);

    res.json({ message: '2FA enabled successfully' });
  } catch (error: any) {
    logger.error('2FA enable error:', error);
    res.status(500).json({ error: 'Failed to enable 2FA' });
  }
});

// Disable 2FA
// @ts-ignore
router.post('/2fa/disable', authenticateToken, async (req: any, res: any) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { error } = disable2FASchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { password } = req.body;
    
    const success = await twoFactorAuthService.disableTwoFactor(authReq.user.userId, password);

    if (!success) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    logger.info(`2FA disabled for user: ${authReq.user.userId}`);

    res.json({ message: '2FA disabled successfully' });
  } catch (error: any) {
    logger.error('2FA disable error:', error);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

// Generate new backup codes
// @ts-ignore
router.post('/2fa/backup-codes', authenticateToken, async (req: any, res: any) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    const backupCodes = await twoFactorAuthService.generateNewBackupCodes(authReq.user.userId, password);

    logger.info(`New backup codes generated for user: ${authReq.user.userId}`);

    res.json({ 
      message: 'New backup codes generated',
      backupCodes 
    });
  } catch (error: any) {
    logger.error('Backup codes generation error:', error);
    if (error.message === 'Invalid password') {
      return res.status(400).json({ error: 'Invalid password' });
    }
    res.status(500).json({ error: 'Failed to generate backup codes' });
  }
});

export default router;
