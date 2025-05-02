import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Configure passport with Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in database
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // If user exists but doesn't have Google ID, update it
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        } else {
          // Create new user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            isEmailVerified: true, // Email is already verified by Google
            role: 'user',
            university: 'Unknown', // These can be updated later by the user
            country: 'Unknown',
            department: 'Unknown',
            profilePicture: profile.photos[0].value,
          });
        }
        return done(null, user);
      } catch (error) {
        console.error('Google authentication error:', error);
        return done(error, null);
      }
    }
  )
);

// Configure passport with GitHub strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/api/auth/github/callback',
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub doesn't always provide email in profile, so we need to get primary email
        let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        
        // If no email is available in the profile directly, try to extract from raw profile data
        if (!email && profile._json && profile._json.email) {
          email = profile._json.email;
        }

        if (!email) {
          return done(new Error('No email found from GitHub profile'), null);
        }

        // Check if user already exists in database
        let user = await User.findOne({ email });

        if (user) {
          // If user exists but doesn't have GitHub ID, update it
          if (!user.githubId) {
            user.githubId = profile.id;
            await user.save();
          }
        } else {
          // Create new user
          user = await User.create({
            name: profile.displayName || profile.username,
            email,
            githubId: profile.id,
            isEmailVerified: true, // Email is already verified by GitHub
            role: 'user',
            university: 'Unknown', // These can be updated later by the user
            country: 'Unknown',
            department: 'Unknown',
            profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          });
        }
        return done(null, user);
      } catch (error) {
        console.error('GitHub authentication error:', error);
        return done(error, null);
      }
    }
  )
);

// Configure serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport; 