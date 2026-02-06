// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// ---------- Public Routes ----------

// Home redirects to login
router.get("/", userController.loginPage);

// Login
router.get("/login", userController.loginPage);
router.post("/login", userController.postLogin);
router.post("/message", userController.postMessage);

// Signup
router.get("/signup", userController.signUp);
router.post("/signup", userController.validateUser, userController.createUser);

// Account created success page
router.get("/account-created", userController.accountCreated);

// ---------- Protected Routes ----------

// Dashboard (only accessible if logged in)
router.get(
  "/dashboard",
  userController.isAuthenticated,
  userController.dashboard,
);

// Logout
router.get("/logout", userController.isAuthenticated, userController.logout);

// ---------- Future / Message Routes ----------

// router.post("/message", (req, res) => {
//   const { name, message } = req.body;
//   if (name && message) {
//     messages.push({ name, message });
//   }
//   res.redirect("/");
// });

module.exports = router;
