// app.js
const express = require("express");
const app = express();
require("dotenv").config(); // Load env vars

// Routes
const userRoutes = require("./routes/userRoutes");

// EJS
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Body parser (built-in)
app.use(express.urlencoded({ extended: false }));

// Use routes
app.use("/users", userRoutes);
app.get("/", (req, res) => res.redirect("/users/new"));

// 404 handler
app.use((req, res) => res.status(404).send("Page not found"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
