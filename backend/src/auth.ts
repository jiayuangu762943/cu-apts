// import { RequestHandler } from 'express';
// import { auth } from './firebase-config';

// const authenticate: RequestHandler = async (req, res, next) => {
//   try {
//     const { authorization } = req.headers;
//     if (!authorization) {
//       res.status(401).send({ error: 'Header not found' });
//       return;
//     }
//     const [bearer, token] = authorization.split(' ');
//     if (bearer !== 'Bearer') {
//       res.status(401).send({ error: 'Invalid token syntax' });
//       return;
//     }
//     const user = await auth.verifyIdToken(token);
//     if (!user.email?.endsWith('@cornell.edu')) {
//       res.status(401).send({ error: 'Invalid domain' });
//       return;
//     }

//     req.user = user;
//     next();
//   } catch (e) {
//     res.status(401).send({ error: 'Authentication Error' });
//   }
// };

// export default authenticate;
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import dotenv from 'dotenv';
import User from '../models/User';
import path from 'path';

// dev dotenv path
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.ID_GOOGLE as string,
      clientSecret: process.env.SECRET_GOOGLE as string,
      callbackURL: `${process.env.SERVER_DOMAIN}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ providerId: profile.id });
        const providerData = {
          ...profile,
          accessToken,
          refreshToken,
        };

        if (user) {
          // update providerData
          await User.findByIdAndUpdate(user._id, { providerData });

          return done(null, user);
        } else if (
          providerData?.displayName &&
          providerData?.emails &&
          providerData?.emails?.length >= 1
        ) {
          // create new user
          const userData = {
            name: providerData?.displayName,
            email: providerData?.emails[0]?.value,
            authProvider: 'google',
            providerId: profile.id,
            providerData,
          };
          const newUser = await new User(userData).save();
          return done(null, newUser);
        }
        throw new Error('Invalid user data from Google auth provider');
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
