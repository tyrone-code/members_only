// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 🔥 TEST ROUTE FIRST
router.get("/test", (req, res) => {
  res.send("Router works");
});

// Login
router.get("/login", userController.loginPage);

// ❗ ROOT ROUTE LAST
router.get("/", userController.loginPage);

// Signup
router.get("/signup", userController.signUp);
router.post("/signup", userController.validateUser, userController.createUser);

// Success page
router.get("/account-created", userController.accountCreated);

module.exports = router;
