// controllers/userController.js

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user");
const Message = require("../models/message");

// Sample messages for the board
let messages = [
  { name: "Alice", message: "Hello everyone! This is my first message." },
  { name: "Bob", message: "Hi Alice! Welcome to the message board." },
  { name: "Charlie", message: "I love this simple Node.js board. 😄" },
];

// ---------- Render Pages ----------

// Login page
exports.loginPage = (req, res) => {
  res.render("login", { title: "Welcome", errors: [], data: {} });
};

// Signup page
exports.signUp = (req, res) => {
  res.render("signup", { title: "Sign Up", errors: [], data: {} });
};

// Account created page
exports.accountCreated = (req, res) => {
  res.render("account-created", {
    title: "Account Created",
    errors: [],
    data: {},
  });
};

// Dashboard page (protected)

exports.dashboard = async (req, res) => {
  try {
    const messages = await Message.getMessages(); // fetch from DB
    res.render("dashboard", {
      title: "Dashboard",
      errors: [],
      data: {},
      user: req.user,
      messages, // send messages to EJS
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { message } = req.body;
    console.log(message);
    if (!message || message.trim() === "") return res.redirect("/dashboard");

    await Message.createMessage(req.user.id, message.trim());
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ---------- Validation Middleware ----------

exports.validateUser = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) throw new Error("Passwords do not match");
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("signup", {
        title: "Sign Up",
        errors: errors.array(),
        data: req.body,
      });
    }
    next();
  },
];

// ---------- User Actions ----------

// Create new user
exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findByUsernameOrEmail(email);

    if (existingUser) {
      return res.render("signup", {
        title: "Sign Up",
        errors: [{ msg: "Email already in use" }],
        data: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, email, password: hashedPassword });

    res.redirect("/account-created");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Login (Passport local strategy)

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};
// Logout
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};

// ---------- Authentication Middleware ----------

// Protect routes
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next(); // user logged in
  res.redirect("/login"); // user not logged in → redirect
};
