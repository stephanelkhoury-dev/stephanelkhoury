"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const passport_1 = __importDefault(require("../config/passport"));
const User_1 = require("../models/User");
const emailService_1 = require("../services/emailService");
const twoFactorAuthService_1 = require("../services/twoFactorAuthService");
const auth_1 = require("../middleware/auth");
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
// Validation schemas
const registerSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(30).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required()
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    twoFactorCode: joi_1.default.string().optional(),
    backupCode: joi_1.default.string().optional()
});
const emailVerificationSchema = joi_1.default.object({
    token: joi_1.default.string().required()
});
const forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
const resetPasswordSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(6).required()
});
const enable2FASchema = joi_1.default.object({
    secret: joi_1.default.string().required(),
    token: joi_1.default.string().required(),
    backupCodes: joi_1.default.array().items(joi_1.default.string()).required()
});
const disable2FASchema = joi_1.default.object({
    password: joi_1.default.string().required()
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
        const existingUser = await User_1.User.findOne({
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
        const user = new User_1.User({
            username,
            email,
            password
        });
        // Generate email verification token
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();
        // Send verification email
        try {
            await emailService_1.emailService.sendEmailVerification({
                username: user.username,
                email: user.email,
                verificationToken
            });
        }
        catch (emailError) {
            logger_1.default.error('Email verification sending failed:', emailError);
            // Continue registration even if email fails
        }
        // Generate JWT token
        const token = user.generateJWT();
        logger_1.default.info(`New user registered: ${username} (${email})`);
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
    }
    catch (error) {
        logger_1.default.error('Registration error:', error);
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
        const user = await User_1.User.findOne({ email });
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
                is2FAValid = twoFactorAuthService_1.twoFactorAuthService.verifyToken(user.twoFactorAuth.secret, twoFactorCode);
            }
            else if (backupCode) {
                // Verify backup code
                const backupResult = await twoFactorAuthService_1.twoFactorAuthService.verifyBackupCode(user._id.toString(), backupCode);
                is2FAValid = backupResult.isValid;
            }
            else {
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
        logger_1.default.info(`User logged in: ${user.username} (${user.email})`);
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
    }
    catch (error) {
        logger_1.default.error('Login error:', error);
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
                const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'your-secret-key');
                const user = await User_1.User.findById(decoded.userId);
                if (user) {
                    user.status = 'offline';
                    user.lastSeen = new Date();
                    await user.save();
                    logger_1.default.info(`User logged out: ${user.username}`);
                }
            }
            catch (tokenError) {
                // Token might be invalid, but we still want to allow logout
                logger_1.default.warn('Invalid token during logout:', tokenError);
            }
        }
        res.json({ message: 'Logout successful' });
    }
    catch (error) {
        logger_1.default.error('Logout error:', error);
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
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User_1.User.findById(decoded.userId).select('-password');
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
    }
    catch (error) {
        logger_1.default.error('Token verification error:', error);
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
        const user = await User_1.User.findOne({
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
        logger_1.default.info(`Email verified for user: ${user.username}`);
        res.json({ message: 'Email verified successfully' });
    }
    catch (error) {
        logger_1.default.error('Email verification error:', error);
        res.status(500).json({ error: 'Email verification failed' });
    }
});
// Resend Email Verification
// @ts-ignore
router.post('/resend-verification', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        if (!authReq.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const user = await User_1.User.findById(authReq.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();
        await emailService_1.emailService.sendEmailVerification({
            username: user.username,
            email: user.email,
            verificationToken
        });
        res.json({ message: 'Verification email sent' });
    }
    catch (error) {
        logger_1.default.error('Resend verification error:', error);
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
        const user = await User_1.User.findOne({ email });
        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({ message: 'If an account with that email exists, you will receive a password reset email.' });
        }
        const resetToken = user.generatePasswordResetToken();
        await user.save();
        await emailService_1.emailService.sendPasswordReset({
            username: user.username,
            email: user.email,
            resetToken
        });
        logger_1.default.info(`Password reset requested for: ${user.username}`);
        res.json({ message: 'If an account with that email exists, you will receive a password reset email.' });
    }
    catch (error) {
        logger_1.default.error('Forgot password error:', error);
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
        const user = await User_1.User.findOne({
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
        logger_1.default.info(`Password reset completed for: ${user.username}`);
        res.json({ message: 'Password reset successfully' });
    }
    catch (error) {
        logger_1.default.error('Reset password error:', error);
        res.status(500).json({ error: 'Password reset failed' });
    }
});
// === OAuth Routes ===
// Google OAuth
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email']
}));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), (req, res) => {
    const user = req.user;
    const token = user.generateJWT();
    // Redirect to client with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
});
// Facebook OAuth
router.get('/facebook', passport_1.default.authenticate('facebook', {
    scope: ['email']
}));
router.get('/facebook/callback', passport_1.default.authenticate('facebook', { session: false }), (req, res) => {
    const user = req.user;
    const token = user.generateJWT();
    // Redirect to client with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
});
// === 2FA Routes ===
// Setup 2FA - Generate QR Code
// @ts-ignore
router.post('/2fa/setup', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        if (!authReq.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const result = await twoFactorAuthService_1.twoFactorAuthService.generateSecret(authReq.user.userId);
        res.json({
            message: '2FA setup initiated',
            secret: result.secret,
            qrCodeUrl: result.qrCodeUrl,
            backupCodes: result.backupCodes
        });
    }
    catch (error) {
        logger_1.default.error('2FA setup error:', error);
        res.status(500).json({ error: 'Failed to setup 2FA' });
    }
});
// Enable 2FA
// @ts-ignore
router.post('/2fa/enable', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        if (!authReq.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const { error } = enable2FASchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { secret, token, backupCodes } = req.body;
        const success = await twoFactorAuthService_1.twoFactorAuthService.enableTwoFactor(authReq.user.userId, secret, token, backupCodes);
        if (!success) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }
        logger_1.default.info(`2FA enabled for user: ${authReq.user.userId}`);
        res.json({ message: '2FA enabled successfully' });
    }
    catch (error) {
        logger_1.default.error('2FA enable error:', error);
        res.status(500).json({ error: 'Failed to enable 2FA' });
    }
});
// Disable 2FA
// @ts-ignore
router.post('/2fa/disable', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        if (!authReq.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const { error } = disable2FASchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { password } = req.body;
        const success = await twoFactorAuthService_1.twoFactorAuthService.disableTwoFactor(authReq.user.userId, password);
        if (!success) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        logger_1.default.info(`2FA disabled for user: ${authReq.user.userId}`);
        res.json({ message: '2FA disabled successfully' });
    }
    catch (error) {
        logger_1.default.error('2FA disable error:', error);
        res.status(500).json({ error: 'Failed to disable 2FA' });
    }
});
// Generate new backup codes
// @ts-ignore
router.post('/2fa/backup-codes', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        if (!authReq.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password required' });
        }
        const backupCodes = await twoFactorAuthService_1.twoFactorAuthService.generateNewBackupCodes(authReq.user.userId, password);
        logger_1.default.info(`New backup codes generated for user: ${authReq.user.userId}`);
        res.json({
            message: 'New backup codes generated',
            backupCodes
        });
    }
    catch (error) {
        logger_1.default.error('Backup codes generation error:', error);
        if (error.message === 'Invalid password') {
            return res.status(400).json({ error: 'Invalid password' });
        }
        res.status(500).json({ error: 'Failed to generate backup codes' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map