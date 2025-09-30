const express = require("express");
const { userAuth } = require("../middlewares/auth");
const editValid = require("../utils/editValidation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  console.log("edit api");
  try {
    const payloadData = req.body;
    const user = req.user;

    // validation for the payload

    const editNotAllowedFields = editValid(payloadData);

    if (editNotAllowedFields.length == 0) {
      Object.keys(payloadData).forEach(
        (field) => (user[field] = payloadData[field])
      );
    } else {
      throw new Error(
        `Edit not allowed for these fields ${editNotAllowedFields.join(",")}`
      );
    }

    await user.save();
    res.json({ message: "User Saved Successfully", data: user });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/password", async (req, res) => {
  try {
    const { emailId, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      throw new Error("Password and confirm password are not same");
    }

    const hashPwd = await bcrypt.hash(req.body.password, 10);
    const user = await User.findOneAndUpdate(
      { emailId: emailId },
      { password: hashPwd },
      { runValidators: true }
    );
    if (user) {
      await user.save();
      res.send("Password updated successfully!");
    } else {
      throw new Error("User Not Found");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
