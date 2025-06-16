import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from '../models/User';

// Local Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email: string, password: string, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }
      
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid email or password' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && 
    process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id') {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await User.findOne({ 'oAuth.google.id': profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails?.[0]?.value });
      
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
      
      user = new User({
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
    } catch (error) {
      return done(error);
    }
  }
  ));
}

// Facebook OAuth Strategy (only if credentials are provided)
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET && 
    process.env.FACEBOOK_APP_ID !== 'your-facebook-app-id') {
  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'picture']
    },
    async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Facebook ID
      let user = await User.findOne({ 'oAuth.facebook.id': profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails?.[0]?.value });
      
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
      const username = await generateUniqueUsername(
        `${profile.name?.givenName}${profile.name?.familyName}` || 
        profile.emails?.[0]?.value?.split('@')[0] || 
        'user'
      );
      
      user = new User({
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
    } catch (error) {
      return done(error);
    }
  }
  ));
}

// Serialize/Deserialize user
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Helper function to generate unique username
async function generateUniqueUsername(baseName: string): Promise<string> {
  let username = baseName.toLowerCase().replace(/[^a-z0-9_]/g, '');
  
  if (username.length < 3) {
    username = `user_${username}`;
  }
  
  if (username.length > 30) {
    username = username.substring(0, 30);
  }
  
  let counter = 0;
  let finalUsername = username;
  
  while (await User.findOne({ username: finalUsername })) {
    counter++;
    finalUsername = `${username}${counter}`;
    
    if (finalUsername.length > 30) {
      const baseLength = 30 - counter.toString().length;
      finalUsername = `${username.substring(0, baseLength)}${counter}`;
    }
  }
  
  return finalUsername;
}

export default passport;
