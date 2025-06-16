"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_local_1 = require("passport-local");
const User_1 = require("../models/User");
// Local Strategy
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
// Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id') {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists with this Google ID
            let user = await User_1.User.findOne({ 'oAuth.google.id': profile.id });
            if (user) {
                return done(null, user);
            }
            // Check if user exists with same email
            user = await User_1.User.findOne({ email: profile.emails?.[0]?.value });
            if (user) {
                // Link Google account to existing user
                user.oAuth.google = {
                    id: profile.id,
                    email: profile.emails?.[0]?.value || ''
                };
                user.isEmailVerified = true; // Google accounts are verified
                await user.save();
                return done(null, user);
            }
            // Create new user
            const username = await generateUniqueUsername(profile.displayName || profile.emails?.[0]?.value?.split('@')[0] || 'user');
            user = new User_1.User({
                username,
                email: profile.emails?.[0]?.value,
                avatar: profile.photos?.[0]?.value,
                isEmailVerified: true,
                oAuth: {
                    google: {
                        id: profile.id,
                        email: profile.emails?.[0]?.value || ''
                    }
                }
            });
            await user.save();
            return done(null, user);
        }
        catch (error) {
            return done(error);
        }
    }));
}
// Facebook OAuth Strategy (only if credentials are provided)
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET &&
    process.env.FACEBOOK_APP_ID !== 'your-facebook-app-id') {
    passport_1.default.use(new passport_facebook_1.Strategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name', 'picture']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists with this Facebook ID
            let user = await User_1.User.findOne({ 'oAuth.facebook.id': profile.id });
            if (user) {
                return done(null, user);
            }
            // Check if user exists with same email
            user = await User_1.User.findOne({ email: profile.emails?.[0]?.value });
            if (user) {
                // Link Facebook account to existing user
                user.oAuth.facebook = {
                    id: profile.id,
                    email: profile.emails?.[0]?.value || ''
                };
                user.isEmailVerified = true;
                await user.save();
                return done(null, user);
            }
            // Create new user
            const username = await generateUniqueUsername(`${profile.name?.givenName}${profile.name?.familyName}` ||
                profile.emails?.[0]?.value?.split('@')[0] ||
                'user');
            user = new User_1.User({
                username,
                email: profile.emails?.[0]?.value,
                avatar: profile.photos?.[0]?.value,
                isEmailVerified: true,
                oAuth: {
                    facebook: {
                        id: profile.id,
                        email: profile.emails?.[0]?.value || ''
                    }
                }
            });
            await user.save();
            return done(null, user);
        }
        catch (error) {
            return done(error);
        }
    }));
}
// Serialize/Deserialize user
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
// Helper function to generate unique username
async function generateUniqueUsername(baseName) {
    let username = baseName.toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (username.length < 3) {
        username = `user_${username}`;
    }
    if (username.length > 30) {
        username = username.substring(0, 30);
    }
    let counter = 0;
    let finalUsername = username;
    while (await User_1.User.findOne({ username: finalUsername })) {
        counter++;
        finalUsername = `${username}${counter}`;
        if (finalUsername.length > 30) {
            const baseLength = 30 - counter.toString().length;
            finalUsername = `${username.substring(0, baseLength)}${counter}`;
        }
    }
    return finalUsername;
}
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map