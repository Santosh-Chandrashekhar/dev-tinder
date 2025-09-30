const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { signUpDataValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json()); // req body parser middleware
app.use(cookieParser()); // cookies parser middleware

// Signup
app.use("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
    console.log(token);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
    });
    res.send("Login Successful");
  } catch (error) {
    res.status(400).send("ERROR: " + error);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

app.post("/sendConnectionReq", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    res.send(user.firstName + " " + "sent connection request");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// fetch user by emailId
app.get("/user", async (req, res) => {
  //const email = req.body.emailId;
  const id = req.body._id;
  try {
    //const user = await User.findOne({ emailId: email });
    const user = await User.findById({ _id: id });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Fetch all users from db
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length) {
      res.send(users);
    } else {
      res.status(404).send("Users not found");
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Update the user record in db
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updatingData = req.body;
  try {
    const UPDATE_ALLOWED_FIELDS = ["age", "gender", "skills", "photoUrl"];
    const isUpdateAllowd = Object.keys(updatingData).every((field) =>
      UPDATE_ALLOWED_FIELDS.includes(field)
    );
    if (!isUpdateAllowd) {
      throw new Error("Update not allowed on certain fields");
    }

    const updatedRecord = await User.findByIdAndUpdate(userId, updatingData, {
      returnDocument: "after",
      runValidators: true,
    });
    if (updatedRecord) {
      res.send(updatedRecord);
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});

// Delete a record from db
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    res.send("User Deleted successfully" + deletedUser);
  } catch (error) {
    res.status(400).send("Something wend wrong");
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
