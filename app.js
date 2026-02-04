const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("./config/passport");
const pool = require("./config/db");
require("dotenv").config();

const app = express();

// ---------- View Engine ----------
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// ---------- Static Files ----------
app.use(express.static("public"));

// ---------- Body Parsers ----------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---------- Session ----------
app.use(
  session({
    store: new pgSession({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET, // REQUIRED

    resave: false,
    saveUninitialized: false,
  }),
);

// ---------- Passport ----------
app.use(passport.initialize());
app.use(passport.session());

// ---------- Routes ----------
const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Global error handler // app.use((err, req, res, next) => { // console.error(err.stack); // res.status(500).send("Something broke!"); // });

// ---------- Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
