// controllers/userController.js
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.showForm = (req, res) => {
  res.render("form", { errors: [], data: {} }); // Pass empty errors & data
};

exports.validateUser = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
];

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  const { name, email } = req.body;

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render("form", { errors: errors.array(), data: req.body });
  }

  try {
    const user = await User.create(name, email);
    res.send(`User created: ${user.name} (${user.email})`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
};
