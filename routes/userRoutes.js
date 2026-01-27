// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Show form
router.get("/new", userController.showForm);

// Handle form submission with validation
router.post("/new", userController.validateUser, userController.createUser);

module.exports = router;
