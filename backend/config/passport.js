const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const CLIENT_URL  = process.env.CLIENT_URL  || 'http://localhost:3000';
const API_URL_RAW = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 10000}`;
const CALLBACK_URL = `${API_URL_RAW.replace(/\/$/, '')}/api/auth/google/callback`;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name  = profile.displayName || profile.name?.givenName || 'Google User';
          const avatar = profile.photos?.[0]?.value || null;

          if (!email) return done(new Error('Email kelmadi'), null);

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name,
              email,
              avatar,
              password: 'GOOGLE_OAUTH_' + Math.random().toString(36).slice(2),
              googleId: profile.id,
              role: 'USER',
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            if (avatar && !user.avatar) user.avatar = avatar;
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
  console.log('✅ Google OAuth strategy yuklandi');
} else {
  console.log('ℹ️  Google OAuth o\'chiq (GOOGLE_CLIENT_ID/SECRET yo\'q)');
}

module.exports = { passport, CLIENT_URL };
