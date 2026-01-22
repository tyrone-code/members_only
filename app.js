const express = require("express");
const app = express();
const port = 3000;

// Define a route for the home page
app.get("/", (req, res) => {
  res.send("Hello World! This is my first Express app.");
});

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
