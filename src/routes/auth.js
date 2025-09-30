const express = require("express");
const bcrypt = require("bcrypt");
const { signUpDataValidation } = require("../utils/validation");
const User = require("../models/user");

const authRouter = express.Router();

// Signup
authRouter.post("/signup", async (req, res) => {
  //console.log(req.body);
  // new instance of User model
  try {
    const signUpData = req.body;
    // vaidate the sign up data
    signUpDataValidation(req.body);

    // Encrypt the password before storing in DB
    const hashedPwd = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      ...signUpData,
      password: hashedPwd,
    });
    console.log("user", user);
    await user.save();
    res.send("Data saved successfully!!!!");
  } catch (err) {
    res.status(400).send("Error while saving the data" + err.message);
  }
});

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
    });
    res.send("Login Successful");
  } catch (error) {
    res.status(400).send("ERROR: " + error);
  }
});

authRouter.post("/logout", async (_, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successfull");
});

module.exports = authRouter;
