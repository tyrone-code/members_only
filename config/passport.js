const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "identifier", // username OR email
      passwordField: "password",
    },
    async (userInput, password, done) => {
      try {
        const user = await User.findByUsernameOrEmail(userInput, userInput);

        if (!user) {
          return done(null, false, {
            message: "Invalid username or password",
          });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// store user id in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// retrieve user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
