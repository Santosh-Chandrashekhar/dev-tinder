const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.use("/signup", async (_, res) => {
  const user = new User({
    firstName: "Mahi",
    lastName: "Thala",
    emailId: "mahi@mail.com",
    password: "mahi@123",
  });

  try {
    await user.save();
    res.send("Data saved successfully!!!!");
  } catch (err) {
    res.statusCode(400).send("Error while saving the data" + err.message);
  }
});

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
