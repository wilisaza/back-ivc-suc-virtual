import logger from '../util/logger'

const libName = '[jwtValidate]'

import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        logger.info(`${libName} Validando token`)
        return done(null, { id: payload.id });
      } catch (err) {
        logger.error(`${libName} ${ err}`)
        return done(err, false);
      }
    }
  )
);

export const validateTokenSingle = passport.authenticate("jwt", { session: false });
