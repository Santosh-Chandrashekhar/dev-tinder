const express = require("express");

const app = express();

// Request handler function
app.use("/", (req, res) => {
  res.send("Home Page!");
});
app.use("/dashboard", (req, res) => {
  res.send("Dashboard Page!");
});

app.listen(7777);
