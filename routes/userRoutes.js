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

router.get("/", userController.loginPage);

// Signup
router.get("/signup", userController.signUp);
router.post("/signup", userController.validateUser, userController.createUser);
router.post("/login", userController.postLogin);
router.get("/logout", userController.logout);

///FIX
// router.post("/message", (req, res) => {
//   const { name, message } = req.body;
//   if (name && message) {
//     messages.push({ name, message });
//   }
//   res.redirect("/");
// });

// Success page
router.get("/account-created", userController.accountCreated);

//dashboard
router.get("/dashboard", userController.dashboard);

module.exports = router;
