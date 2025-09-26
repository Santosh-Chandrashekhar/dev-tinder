const express = require("express");

const app = express();

//Request handler function
app.use("/dashboard", (req, res) => {
  //res.send("Dashboard Page!");
  throw new Error("Error");
});

app.use("/hello", (req, res) => {
  res.send("Hello Page!");
});

app.use("/", (err, req, res, next) => {
  console.log("this is awesome");
  if (err) {
    res.status(500).send("Something went wrong");
  }
  //res.send("Home Page!");
});

//---------------Play with routes--------------------

// b is optional in the route
// app.get("/a{b}c", (req, res) => {
//   res.send("This is ABC route");
// });

// // any of e between d and f
// app.get("/de*f", (req, res) => {
//   res.send("This is DEF route");
// });

// // reading params from route "/user/:101/:28"
// app.get("/user/:userid/{:age}", (req, res) => {
//   console.log(req.params); // { userid: '101', age: '28' }
//   res.send("Dynamic user page");
// });

// app.get("/user", (req, res) => {
//   // /user?userid=123&password=456 req.query { userid: '123', password: '345' }
//   console.log(req.query);
//   res.send(`User page`);
// });

//---------------------------------------------------

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
