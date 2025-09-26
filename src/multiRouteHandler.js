const express = require("express");

const { isAdmin } = require("./middlewares/auth");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("Handler 1");
    //res.send("user response 1");
    next();
  },
  (req, res, next) => {
    console.log("Handler 2");
    //res.send("user response 2");
    next();
    // res.send("user response 2") : throws an error and it runs after handler 3 when res already sent
  },
  (req, res, next) => {
    console.log("Handler 3");
    res.send("user response 3");
    //next(); // when we call next() and res is not sent anywhere it will throws error saying can not GET /user
  }
);

app.use("/admin", isAdmin);

app.get("/admin/getAllUser", (req, res) => {
  res.send("Get All users");
});

app.delete("/admin/deleteAllUser", (req, res) => {
  res.send("Delete all users");
});

app.get("/user/login", (req, res) => {
  res.send("Login success");
});

app.use("/user", isAdmin);
app.get("/user/getAllUser", (req, res) => {
  res.send("get all users data");
});

app.listen("5555");
