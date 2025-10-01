const express = require("express");
const { connectDB } = require("./config/database");
var cookieParser = require("cookie-parser");
const app = express();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json()); // req body parser middleware
app.use(cookieParser()); // cookies parser middleware

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection establised");
    app.listen(7070, () => {
      console.log("Server started succesfully!!!");
    });
  })
  .catch((err) => {
    console.log("Error in connecting to database", err);
  });
