import passport, { Profile } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import bcrypt from "bcrypt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from ".";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        if (!email) {
          return done(null, false, { message: "Email not found" });
        }

        const existUser = await User.findOne({ email });
        if (!existUser) {
          return done(null, false, { message: "User not found" });
        }
        if (existUser.isVerified === false) {
          return done(null, false, { message: "User is verified" });
        }
        if (
          existUser.isActive === IsActive.INACTIVE ||
          existUser.isActive === IsActive.BLOCKED
        ) {
          return done(null, false, {
            message: `User is :-${existUser.isActive}`,
          });
        }
        if (existUser.isDeleted === true) {
          return done(null, false, { message: "User is Deleted" });
        }
        const passwordMatch = await bcrypt.compare(
          password,
          existUser.password as string
        );
        if (!passwordMatch) {
          return done(null, false, { message: "Password Does not matched" });
        }
        const isGoogleAuthenticated = existUser.auths.some(
          (x) => x.provider === "google"
        );
        if (isGoogleAuthenticated) {
          return done(null, false, { message: "Please do google login" });
        }

        return done(null, existUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID as string,
      clientSecret: config.GOOGLE_CLIENT_SECRET as string,
      callbackURL: config.GOOGLE_CALLBACK_URL as string,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        const email = profile?.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "Email not found" });
        }
        let existUser = await User.findOne({ email });
        if (!existUser) {
          existUser = await User.create({
            name: profile.displayName,
            email: email,
            picture: profile?.photos?.[0].value,
            role: Role.USER,
            auths: [
              {
                provider: "google",
                providerId: profile?.id,
              },
            ],
          });
        }

        if (
          existUser.isActive === IsActive.INACTIVE ||
          existUser.isActive === IsActive.BLOCKED
        ) {
          return done(null, false, {
            message: `User is :-${existUser.isActive}`,
          });
        }
        if (existUser.isDeleted === true) {
          return done(null, false, { message: "User is Deleted" });
        }
        return done(null, existUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
