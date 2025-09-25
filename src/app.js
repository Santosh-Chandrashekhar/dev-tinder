const express = require("express");

const app = express();

// Request handler function
app.use((req, res) => {
  res.send("Hello!");
});

app.listen(7777);
