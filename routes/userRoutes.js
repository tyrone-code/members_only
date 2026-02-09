// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const isAdmin = require("../middleware/isAdmin");

// ---------- Public Routes ----------

// Home redirects to login
router.get("/", userController.loginPage);

// Login
router.get("/login", userController.loginPage);
router.post("/login", userController.postLogin);

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

router.post("/message", userController.postMessage);
router.post("/message/:id/delete", isAdmin, userController.deleteMessage);
// Signup

// Logout
router.get("/logout", userController.isAuthenticated, userController.logout);

module.exports = router;
