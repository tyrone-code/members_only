//controllers/userController.js
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user");

let messages = [
  { name: "Alice", message: "Hello everyone! This is my first message." },
  { name: "Bob", message: "Hi Alice! Welcome to the message board." },
  { name: "Charlie", message: "I love this simple Node.js board. 😄" },
];

// Render login page
exports.loginPage = (req, res) => {
  res.render("login", {
    title: "Welcome",
    errors: [],
    data: {},
  });
};

// Render signup page
exports.signUp = (req, res) => {
  res.render("signup", {
    title: "Sign Up",
    errors: [],
    data: {},
  });
};

exports.accountCreated = (req, res) => {
  res.render("account-created", {
    title: "account created",
    errors: [],
    data: {},
  });
};

exports.dashboard = (req, res) => {
  res.render("dashboard", {
    title: "dashboard",
    errors: [],
    data: {},
  });
};

// Validation middleware
exports.validateUser = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
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

// Create new user
exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1️⃣ Check if user exists
    const existingUser = await User.findByUsernameOrEmail(email);

    if (existingUser) {
      return res.render("signup", {
        title: "Sign Up",
        errors: [{ msg: "Email already in use" }],
        data: req.body,
      });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 4️⃣ Redirect
    res.redirect("/account-created");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.postLogin = passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
});

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};
