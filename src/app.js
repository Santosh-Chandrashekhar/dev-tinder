const express = require("express");

const app = express();

// Request handler function
// app.use("/dashboard", (req, res) => {
//   res.send("Dashboard Page!");
// });

// app.use("/hello", (req, res) => {
//   res.send("Hello Page!");
// });

// app.use("/", (req, res) => {
//   res.send("Home Page!");
// });

app.get("/user", (req, res) => {
  res.send({
    firstName: "Santosh",
    lastName: "C M",
  });
});

app.post("/user", (req, res) => {
  res.send("Data saved successfully in database!");
});

app.put("/user", (req, res) => {
  res.send("Data updated successfully!");
});

app.delete("/user", (req, res) => {
  res.send("Data deleted successfully!");
});

app.listen(7777);

/*
Routes order very important: Which ever the complete route matches first, it will respond to the req
ex: here / and /dashboard
when we go to /dashboard , if we have the / at the begining of the routes , for all the routes it will respond with / response as it matches first
But if you put the / at the bottom of all routes , it will chec for the first perfect match and respond to that i.e /dashboard here
*/
